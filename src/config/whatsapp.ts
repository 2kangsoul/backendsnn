import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  WASocket,
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import path from "path";
import fs from "fs";
import https from "https";
import pino from "pino";

const SESSION_PATH = path.join(process.cwd(), "wa_session");

let sock: WASocket | null = null;
let isConnected = false;
let currentQR: string | null = null; // ← simpan QR string
let connectionStatus: "disconnected" | "connecting" | "connected" =
  "disconnected";
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;

const messageHandlers: Array<(msg: any) => void> = [];
const silentLogger = pino({ level: "silent" });

// ── In-memory message store untuk getMessage callback ─────────────────────────
const msgStore: Record<string, any> = {};
const MAX_STORE_SIZE = 500; // batas supaya tidak bocor memori

function saveToStore(id: string | undefined, message: any) {
  if (!id) return;
  const keys = Object.keys(msgStore);
  if (keys.length >= MAX_STORE_SIZE) {
    delete msgStore[keys[0]!]; // hapus yang paling lama
  }
  msgStore[id] = message;
}

// ── Internet health check (quick, 3 detik saja) ──────────────────────────────
async function checkInternet(): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const req = https.get(
        "https://www.google.com",
        { timeout: 3000 },
        (res) => {
          res.resume(); // consume response supaya tidak hang
          res.on("end", () => resolve(true));
          res.on("error", () => resolve(false));
        },
      );
      req.on("error", () => resolve(false));
      req.on("timeout", () => {
        req.destroy();
        resolve(false);
      });
    } catch {
      resolve(false);
    }
  });
}

// ── KeepAlive ping ────────────────────────────────────────────────────────────
let keepAliveTimer: NodeJS.Timeout | null = null;

function startKeepAlive() {
  stopKeepAlive();
  keepAliveTimer = setInterval(
    () => {
      if (!sock || !isConnected || connectionStatus !== "connected") {
        stopKeepAlive(); // otomatis berhenti kalau kondisi tidak valid
        return;
      }
      sock.sendPresenceUpdate("unavailable").catch(() => stopKeepAlive());
    },
    4 * 60 * 1000,
  ); // ping setiap 4 menit
}

function stopKeepAlive() {
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
    keepAliveTimer = null;
  }
}

export function getWASocket(): WASocket | null {
  return sock;
}
export function isWAConnected(): boolean {
  return isConnected;
}
export function getWAStatus() {
  return {
    isConnected,
    status: connectionStatus,
    hasQR: currentQR !== null,
    qr: currentQR,
  };
}

export function onWAMessage(handler: (msg: any) => void) {
  messageHandlers.push(handler);
}

// ── Reset session (hapus wa_session folder) ───────────────────────────────────
export async function resetWASession(): Promise<void> {
  if (sock) {
    try {
      await sock.logout();
    } catch {}
    sock = null;
  }
  isConnected = false;
  currentQR = null;
  connectionStatus = "disconnected";
  reconnectAttempts = 0;
  stopKeepAlive();

  if (fs.existsSync(SESSION_PATH)) {
    fs.rmSync(SESSION_PATH, { recursive: true, force: true });
    console.log("🗑️ [WA Bot] Session dihapus");
  }
}

export async function initWhatsApp() {
  if (!fs.existsSync(SESSION_PATH)) {
    fs.mkdirSync(SESSION_PATH, { recursive: true });
  }

  connectionStatus = "connecting";
  const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);

  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    browser: ["SNN Bot", "Chrome", "1.0.0"],
    logger: silentLogger,
    getMessage: async (key) => {
      const stored = key.id ? msgStore[key.id] : undefined;
      return stored ?? { conversation: "" };
    },
    syncFullHistory: false,
    markOnlineOnConnect: false,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      currentQR = qr; // ← simpan QR string untuk di-expose ke frontend
      connectionStatus = "connecting";
      console.log("📱 [WA Bot] QR tersedia — buka Settings untuk scan");
    }

    if (connection === "close") {
      isConnected = false;
      currentQR = null;
      connectionStatus = "disconnected";
      const statusCode = (lastDisconnect?.error as Boom)?.output?.statusCode;
      const shouldReconnect =
        statusCode !== DisconnectReason.loggedOut &&
        statusCode !== DisconnectReason.multideviceMismatch &&
        statusCode !== 440; // Connection Replaced — ada sesi lain yang aktif
      console.log(
        `🔴 [WA Bot] Koneksi terputus (kode: ${statusCode}). Reconnect: ${shouldReconnect}`,
      );
      if (statusCode === 440) {
        console.warn(
          "⚠️ [WA Bot] Sesi diambil alih device lain. Pastikan tidak ada instance bot ganda.",
        );
      }
      if (shouldReconnect) {
        stopKeepAlive();
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          const delay = Math.min(5000 * Math.pow(2, reconnectAttempts), 60000);
          reconnectAttempts++;
          console.log(
            `🔄 [WA Bot] Reconnect attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} dalam ${delay / 1000}s...`,
          );
          setTimeout(async () => {
            const hasInternet = await checkInternet();
            if (!hasInternet) {
              // Internet mati — jangan buang counter, coba lagi segera
              console.warn(
                "🌐 [WA Bot] Internet tidak ada, retry tanpa hitung attempt...",
              );
              reconnectAttempts--; // kembalikan counter
            }
            initWhatsApp(); // tetap coba reconnect apapun kondisinya
          }, delay);
        } else {
          console.error(
            "❌ [WA Bot] Sudah mencapai batas maksimum reconnect. Hentikan.",
          );
          connectionStatus = "disconnected";
        }
      }
    } else if (connection === "open") {
      isConnected = true;
      currentQR = null; // ← clear QR setelah connected
      connectionStatus = "connected";
      reconnectAttempts = 0; // ← reset counter setelah berhasil connect
      startKeepAlive(); // ← mulai ping berkala
      console.log("✅ [WA Bot] WhatsApp terhubung!");
    }
  });

  sock.ev.on("messages.upsert", ({ messages, type }) => {
    // Simpan semua pesan ke store untuk getMessage callback
    for (const msg of messages) {
      if (msg.key.id && msg.message) {
        saveToStore(msg.key.id, msg.message);
      }
    }

    if (type !== "notify") return;
    for (const msg of messages) {
      // Abaikan pesan dari group/newsletter supaya tidak spam log
      const remoteJid = msg.key.remoteJid ?? "";
      if (remoteJid.endsWith("@g.us") || remoteJid.endsWith("@newsletter"))
        continue;

      if (!msg.key.fromMe) {
        messageHandlers.forEach((handler) => handler(msg));
      }
    }
  });
}

export async function sendWAMessage(
  phone: string,
  text: string,
  retries = 3,
): Promise<boolean> {
  const jid = phone.replace(/\D/g, "").replace(/^0/, "62") + "@s.whatsapp.net";

  for (let attempt = 1; attempt <= retries; attempt++) {
    // Tunggu koneksi kalau belum terhubung (max 10 detik)
    if (!isConnected || !sock) {
      console.warn(
        `⚠️ [WA Bot] Belum terhubung, tunggu... (attempt ${attempt}/${retries})`,
      );
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    if (!sock || !isConnected) continue;

    try {
      await sock.sendMessage(jid, { text });
      console.log(`📤 [WA Bot] Pesan terkirim ke ${jid}`);
      return true;
    } catch (error: any) {
      console.error(
        `❌ [WA Bot] Gagal kirim (attempt ${attempt}):`,
        error?.message || error,
      );
      if (attempt < retries)
        await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  console.error(
    `❌ [WA Bot] Gagal kirim ke ${jid} setelah ${retries} percobaan`,
  );
  return false;
}