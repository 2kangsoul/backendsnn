"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWASocket = getWASocket;
exports.isWAConnected = isWAConnected;
exports.getWAStatus = getWAStatus;
exports.onWAMessage = onWAMessage;
exports.resetWASession = resetWASession;
exports.initWhatsApp = initWhatsApp;
exports.sendWAMessage = sendWAMessage;
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
const pino_1 = __importDefault(require("pino"));
const SESSION_PATH = path_1.default.join(process.cwd(), "wa_session");
let sock = null;
let isConnected = false;
let currentQR = null; // ← simpan QR string
let connectionStatus = "disconnected";
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const messageHandlers = [];
const silentLogger = (0, pino_1.default)({ level: "silent" });
// ── In-memory message store untuk getMessage callback ─────────────────────────
const msgStore = {};
const MAX_STORE_SIZE = 500; // batas supaya tidak bocor memori
function saveToStore(id, message) {
    if (!id)
        return;
    const keys = Object.keys(msgStore);
    if (keys.length >= MAX_STORE_SIZE) {
        delete msgStore[keys[0]]; // hapus yang paling lama
    }
    msgStore[id] = message;
}
// ── Internet health check (quick, 3 detik saja) ──────────────────────────────
function checkInternet() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            try {
                const req = https_1.default.get("https://www.google.com", { timeout: 3000 }, (res) => {
                    res.resume(); // consume response supaya tidak hang
                    res.on("end", () => resolve(true));
                    res.on("error", () => resolve(false));
                });
                req.on("error", () => resolve(false));
                req.on("timeout", () => {
                    req.destroy();
                    resolve(false);
                });
            }
            catch (_a) {
                resolve(false);
            }
        });
    });
}
// ── KeepAlive ping ────────────────────────────────────────────────────────────
let keepAliveTimer = null;
function startKeepAlive() {
    stopKeepAlive();
    keepAliveTimer = setInterval(() => {
        if (!sock || !isConnected || connectionStatus !== "connected") {
            stopKeepAlive(); // otomatis berhenti kalau kondisi tidak valid
            return;
        }
        sock.sendPresenceUpdate("unavailable").catch(() => stopKeepAlive());
    }, 4 * 60 * 1000); // ping setiap 4 menit
}
function stopKeepAlive() {
    if (keepAliveTimer) {
        clearInterval(keepAliveTimer);
        keepAliveTimer = null;
    }
}
function getWASocket() {
    return sock;
}
function isWAConnected() {
    return isConnected;
}
function getWAStatus() {
    return {
        isConnected,
        status: connectionStatus,
        hasQR: currentQR !== null,
        qr: currentQR,
    };
}
function onWAMessage(handler) {
    messageHandlers.push(handler);
}
// ── Reset session (hapus wa_session folder) ───────────────────────────────────
function resetWASession() {
    return __awaiter(this, void 0, void 0, function* () {
        if (sock) {
            try {
                yield sock.logout();
            }
            catch (_a) { }
            sock = null;
        }
        isConnected = false;
        currentQR = null;
        connectionStatus = "disconnected";
        reconnectAttempts = 0;
        stopKeepAlive();
        if (fs_1.default.existsSync(SESSION_PATH)) {
            fs_1.default.rmSync(SESSION_PATH, { recursive: true, force: true });
            console.log("🗑️ [WA Bot] Session dihapus");
        }
    });
}
function initWhatsApp() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs_1.default.existsSync(SESSION_PATH)) {
            fs_1.default.mkdirSync(SESSION_PATH, { recursive: true });
        }
        connectionStatus = "connecting";
        const { state, saveCreds } = yield (0, baileys_1.useMultiFileAuthState)(SESSION_PATH);
        sock = (0, baileys_1.default)({
            auth: state,
            printQRInTerminal: false,
            browser: ["SNN Bot", "Chrome", "1.0.0"],
            logger: silentLogger,
            getMessage: (key) => __awaiter(this, void 0, void 0, function* () {
                const stored = key.id ? msgStore[key.id] : undefined;
                return stored !== null && stored !== void 0 ? stored : { conversation: "" };
            }),
            syncFullHistory: false,
            markOnlineOnConnect: false,
        });
        sock.ev.on("creds.update", saveCreds);
        sock.ev.on("connection.update", (update) => {
            var _a, _b;
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
                const statusCode = (_b = (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode;
                const shouldReconnect = statusCode !== baileys_1.DisconnectReason.loggedOut &&
                    statusCode !== baileys_1.DisconnectReason.multideviceMismatch &&
                    statusCode !== 440; // Connection Replaced — ada sesi lain yang aktif
                console.log(`🔴 [WA Bot] Koneksi terputus (kode: ${statusCode}). Reconnect: ${shouldReconnect}`);
                if (statusCode === 440) {
                    console.warn("⚠️ [WA Bot] Sesi diambil alih device lain. Pastikan tidak ada instance bot ganda.");
                }
                if (shouldReconnect) {
                    stopKeepAlive();
                    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                        const delay = Math.min(5000 * Math.pow(2, reconnectAttempts), 60000);
                        reconnectAttempts++;
                        console.log(`🔄 [WA Bot] Reconnect attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} dalam ${delay / 1000}s...`);
                        setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                            const hasInternet = yield checkInternet();
                            if (!hasInternet) {
                                // Internet mati — jangan buang counter, coba lagi segera
                                console.warn("🌐 [WA Bot] Internet tidak ada, retry tanpa hitung attempt...");
                                reconnectAttempts--; // kembalikan counter
                            }
                            initWhatsApp(); // tetap coba reconnect apapun kondisinya
                        }), delay);
                    }
                    else {
                        console.error("❌ [WA Bot] Sudah mencapai batas maksimum reconnect. Hentikan.");
                        connectionStatus = "disconnected";
                    }
                }
            }
            else if (connection === "open") {
                isConnected = true;
                currentQR = null; // ← clear QR setelah connected
                connectionStatus = "connected";
                reconnectAttempts = 0; // ← reset counter setelah berhasil connect
                startKeepAlive(); // ← mulai ping berkala
                console.log("✅ [WA Bot] WhatsApp terhubung!");
            }
        });
        sock.ev.on("messages.upsert", ({ messages, type }) => {
            var _a;
            // Simpan semua pesan ke store untuk getMessage callback
            for (const msg of messages) {
                if (msg.key.id && msg.message) {
                    saveToStore(msg.key.id, msg.message);
                }
            }
            if (type !== "notify")
                return;
            for (const msg of messages) {
                // Abaikan pesan dari group/newsletter supaya tidak spam log
                const remoteJid = (_a = msg.key.remoteJid) !== null && _a !== void 0 ? _a : "";
                if (remoteJid.endsWith("@g.us") || remoteJid.endsWith("@newsletter"))
                    continue;
                if (!msg.key.fromMe) {
                    messageHandlers.forEach((handler) => handler(msg));
                }
            }
        });
    });
}
function sendWAMessage(phone_1, text_1) {
    return __awaiter(this, arguments, void 0, function* (phone, text, retries = 3) {
        const jid = phone.replace(/\D/g, "").replace(/^0/, "62") + "@s.whatsapp.net";
        for (let attempt = 1; attempt <= retries; attempt++) {
            // Tunggu koneksi kalau belum terhubung (max 10 detik)
            if (!isConnected || !sock) {
                console.warn(`⚠️ [WA Bot] Belum terhubung, tunggu... (attempt ${attempt}/${retries})`);
                yield new Promise((resolve) => setTimeout(resolve, 3000));
            }
            if (!sock || !isConnected)
                continue;
            try {
                yield sock.sendMessage(jid, { text });
                console.log(`📤 [WA Bot] Pesan terkirim ke ${jid}`);
                return true;
            }
            catch (error) {
                console.error(`❌ [WA Bot] Gagal kirim (attempt ${attempt}):`, (error === null || error === void 0 ? void 0 : error.message) || error);
                if (attempt < retries)
                    yield new Promise((resolve) => setTimeout(resolve, 2000));
            }
        }
        console.error(`❌ [WA Bot] Gagal kirim ke ${jid} setelah ${retries} percobaan`);
        return false;
    });
}
//# sourceMappingURL=whatsapp.js.map