"use strict";
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
exports.startAttendanceBot = startAttendanceBot;
// @ts-nocheck
const prisma_1 = __importDefault(require("../prisma"));
const node_cron_1 = __importDefault(require("node-cron"));
const whatsapp_1 = require("../config/whatsapp");
const haversine_1 = require("../utils/haversine");
const RADIUS_METER = 100;
const SESSION_EXPIRE_MS = 30 * 60 * 1000;
// Jam istirahat: 12:00 – 13:30 (dalam menit dari tengah malam)
const BREAK_START_MINUTE = 12 * 60; // 720
const BREAK_END_MINUTE = 13 * 60 + 30; // 810
/** Cek apakah waktu sekarang sedang dalam jam istirahat */
function isBreakTime(date = new Date()) {
    const minuteOfDay = date.getHours() * 60 + date.getMinutes();
    return minuteOfDay >= BREAK_START_MINUTE && minuteOfDay < BREAK_END_MINUTE;
}
/** Toleransi live location mati: 10 menit normal, 120 menit saat istirahat */
function getLiveTimeout() {
    return isBreakTime() ? 120 * 60 * 1000 : 10 * 60 * 1000;
}
const NINE_ROUTER_URL = process.env.NINE_ROUTER_URL || "http://localhost:20128/v1";
const NINE_ROUTER_KEY = process.env.NINE_ROUTER_KEY || "your_nine_router_api_key";
// ── Daftar free model — dicoba berurutan, skip kalau kena limit ───────────────
const FREE_MODELS = [
    "gc/gemini-2.5-flash",
    "deepseek-v4-flash-free",
    "gc/gemini-2.5-pro",
    "ag/gemini-2.5-flash",
    "ag/gemini-3.5-flash",
    "ollama/qwen3.5",
    "ollama/gemini-2.5-flash",
    "ollama/minimax-2.5",
    "bpm/seed-2-0-mini-260215",
    "cl/openai/gpt-4.1",
];
const modelCooldown = new Map(); // model → timestamp boleh dipakai lagi
let activeModelIndex = 0;
function getAvailableModel() {
    const now = Date.now();
    for (let i = 0; i < FREE_MODELS.length; i++) {
        const idx = (activeModelIndex + i) % FREE_MODELS.length;
        const model = FREE_MODELS[idx];
        const cooldownUntil = modelCooldown.get(model) || 0;
        if (now >= cooldownUntil) {
            activeModelIndex = idx;
            return model;
        }
    }
    // Semua cooldown — pakai yang paling dekat expire
    let earliest = Infinity;
    let earliestModel = FREE_MODELS[0];
    for (const [model, until] of modelCooldown.entries()) {
        if (until < earliest) {
            earliest = until;
            earliestModel = model;
        }
    }
    console.warn(`⚠️ [AI] Semua model cooldown, pakai ${earliestModel} (${Math.ceil((earliest - Date.now()) / 1000)}s lagi)`);
    return earliestModel;
}
function setModelCooldown(model, seconds = 65) {
    modelCooldown.set(model, Date.now() + seconds * 1000);
    console.log(`⏳ [AI] Model ${model} cooldown ${seconds}s — switch ke model lain`);
    activeModelIndex = (activeModelIndex + 1) % FREE_MODELS.length;
}
// Simpan as-is (nomor HP atau LID)
const BOT_OWNER_PHONES = (process.env.BOT_OWNER_PHONE || "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
const BOT_OWNER_PHONES_NORMALIZED = BOT_OWNER_PHONES.map((p) => p.replace(/\D/g, "").replace(/^0/, "62")).filter((p) => p.length >= 10);
const chatHistory = new Map();
const MAX_HISTORY = 10;
function isInternalReasoning(text) {
    const normalized = text.trim().toLowerCase();
    return (normalized.startsWith("kita perlu") ||
        normalized.startsWith("we need") ||
        normalized.startsWith("the user") ||
        normalized.includes("instruksi awal") ||
        normalized.includes("system prompt") ||
        normalized.includes("reasoning"));
}
// ── Ambil konteks data murid dari DB ─────────────────────────────────────────
function getStudentContext(phone) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const formattedPhone = phone.replace(/\D/g, "").replace(/^0/, "62");
            const user = yield prisma_1.default.user.findFirst({
                where: {
                    no_handphone: { in: [formattedPhone, "0" + formattedPhone.slice(2)] },
                },
                include: {
                    studentProfile: {
                        include: {
                            enrollments: {
                                where: { status: "ACTIVE" },
                                include: {
                                    program: {
                                        include: {
                                            modules: {
                                                where: { deletedAt: null },
                                                orderBy: { order: "asc" },
                                                include: {
                                                    sessions: {
                                                        orderBy: { order: "asc" },
                                                        include: {
                                                            attendances: {
                                                                where: {
                                                                    enrollment: {
                                                                        student: {
                                                                            user: {
                                                                                no_handphone: {
                                                                                    in: [
                                                                                        formattedPhone,
                                                                                        "0" + formattedPhone.slice(2),
                                                                                    ],
                                                                                },
                                                                            },
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                    sessionAttendances: {
                                        include: {
                                            session: {
                                                select: {
                                                    id: true,
                                                    order: true,
                                                    sessionDate: true,
                                                    startTime: true,
                                                    moduleId: true,
                                                    isCancelled: true,
                                                },
                                            },
                                        },
                                        orderBy: { createdAt: "desc" },
                                        take: 20,
                                    },
                                },
                            },
                        },
                    },
                },
            });
            if (!user || !user.studentProfile)
                return "Murid tidak ditemukan dalam sistem.";
            const now = new Date();
            let context = `Nama murid: ${user.fullName}\n`;
            for (const enrollment of user.studentProfile.enrollments) {
                context += `\nProgram: ${enrollment.program.title}\n`;
                context += `Progress: ${enrollment.progress}%\n`;
                for (const mod of enrollment.program.modules) {
                    const sessions = mod.sessions.filter((s) => !s.isCancelled);
                    const totalSess = sessions.length;
                    const studentAtts = enrollment.sessionAttendances.filter((a) => a.session.moduleId === mod.id);
                    const presentCount = studentAtts.filter((a) => a.isPresent).length;
                    context += `\nModul ${mod.order}: ${mod.title}\n`;
                    context += `  Kehadiran: ${presentCount}/${totalSess} sesi (${totalSess > 0 ? Math.round((presentCount / totalSess) * 100) : 0}%)\n`;
                    context += `  Lokasi: ${mod.location || "TBA"}\n`;
                    const nextSess = sessions.find((s) => new Date(s.sessionDate) > now);
                    if (nextSess) {
                        const d = new Date(nextSess.sessionDate);
                        context += `  Sesi berikutnya: #${nextSess.order} - ${d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })} jam ${nextSess.startTime}\n`;
                    }
                    const recentSess = [...sessions]
                        .filter((s) => new Date(s.sessionDate) <= now)
                        .sort((a, b) => new Date(b.sessionDate).getTime() -
                        new Date(a.sessionDate).getTime())
                        .slice(0, 3);
                    if (recentSess.length > 0) {
                        context += `  Sesi terakhir:\n`;
                        for (const s of recentSess) {
                            const att = enrollment.sessionAttendances.find((a) => a.session.id === s.id);
                            const status = (att === null || att === void 0 ? void 0 : att.isPresent) ? "✅ Hadir" : "❌ Absen";
                            const d = new Date(s.sessionDate);
                            context += `    - Sesi #${s.order} (${d.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}): ${status}\n`;
                        }
                    }
                }
            }
            return context;
        }
        catch (e) {
            console.error("Error getStudentContext:", e);
            return "Gagal mengambil data murid.";
        }
    });
}
// ── Typing indicator ──────────────────────────────────────────────────────────
function showTyping(jid) {
    return __awaiter(this, void 0, void 0, function* () {
        const sock = (0, whatsapp_1.getWASocket)();
        if (!sock || !(0, whatsapp_1.isWAConnected)())
            return;
        try {
            yield sock.sendPresenceUpdate("available", jid);
            yield sock.sendPresenceUpdate("composing", jid);
        }
        catch (_a) { }
    });
}
function stopTyping(jid) {
    return __awaiter(this, void 0, void 0, function* () {
        const sock = (0, whatsapp_1.getWASocket)();
        if (!sock || !(0, whatsapp_1.isWAConnected)())
            return;
        try {
            yield sock.sendPresenceUpdate("paused", jid);
            yield new Promise((r) => setTimeout(r, 2000));
            yield sock.sendPresenceUpdate("unavailable", jid);
        }
        catch (_a) { }
    });
}
function markAsRead(jid, msgKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const sock = (0, whatsapp_1.getWASocket)();
        if (!sock || !(0, whatsapp_1.isWAConnected)())
            return;
        try {
            yield sock.readMessages([msgKey]);
        }
        catch (_a) { }
    });
}
// ── Deteksi tipe pesan ────────────────────────────────────────────────────────
function getMessageInput(msg) {
    var _a, _b, _c, _d, _e;
    const m = msg.message || {};
    const text = ((_a = m.conversation) === null || _a === void 0 ? void 0 : _a.trim()) || ((_c = (_b = m.extendedTextMessage) === null || _b === void 0 ? void 0 : _b.text) === null || _c === void 0 ? void 0 : _c.trim());
    if (text)
        return text;
    if (m.stickerMessage)
        return "[Pengguna mengirim sticker]";
    if (m.imageMessage) {
        const cap = (_d = m.imageMessage.caption) === null || _d === void 0 ? void 0 : _d.trim();
        return cap
            ? `[Pengguna mengirim gambar dengan caption: ${cap}]`
            : "[Pengguna mengirim gambar]";
    }
    if (m.videoMessage) {
        const cap = (_e = m.videoMessage.caption) === null || _e === void 0 ? void 0 : _e.trim();
        return cap
            ? `[Pengguna mengirim video dengan caption: ${cap}]`
            : "[Pengguna mengirim video]";
    }
    if (m.audioMessage || m.pttMessage)
        return "[Pengguna mengirim pesan suara]";
    if (m.documentMessage)
        return "[Pengguna mengirim dokumen]";
    if (m.locationMessage) {
        const lat = m.locationMessage.degreesLatitude;
        const lng = m.locationMessage.degreesLongitude;
        return `[Pengguna mengirim lokasi biasa: ${lat}, ${lng}]`;
    }
    if (m.liveLocationMessage) {
        const lat = m.liveLocationMessage.degreesLatitude;
        const lng = m.liveLocationMessage.degreesLongitude;
        return `[Pengguna mengirim live location: ${lat}, ${lng}]`;
    }
    if (m.contactMessage)
        return "[Pengguna mengirim kontak]";
    return null;
}
// ── Kirim ke AI — auto retry model lain kalau kena limit ──────────────────────
function callAI(messages) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const triedModels = new Set();
        for (let attempt = 0; attempt < FREE_MODELS.length; attempt++) {
            const model = getAvailableModel();
            if (triedModels.has(model))
                break;
            triedModels.add(model);
            console.log(`🔍 [AI] Mencoba model: ${model}`);
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000);
                const response = yield fetch(`${NINE_ROUTER_URL}/chat/completions`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${NINE_ROUTER_KEY}`,
                    },
                    body: JSON.stringify({
                        model,
                        messages,
                        max_tokens: 150,
                        temperature: 0.5,
                        stream: false,
                    }),
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);
                // Kena rate limit / quota — cooldown model ini, coba berikutnya
                if (response.status === 402 || response.status === 429) {
                    const errText = yield response.text();
                    // Cek berapa detik harus nunggu
                    const resetMatch = errText.match(/reset after (\d+)([ms])/);
                    let cooldownSec = 65;
                    if (resetMatch) {
                        cooldownSec =
                            resetMatch[2] === "m"
                                ? parseInt(resetMatch[1]) * 60 + 5
                                : parseInt(resetMatch[1]) + 5;
                    }
                    setModelCooldown(model, cooldownSec);
                    console.log(`⏭️ [AI] Model ${model} skip (${response.status}) — coba model lain`);
                    continue;
                }
                if (!response.ok) {
                    const errText = yield response.text();
                    console.error(`❌ [AI] Model ${model} error ${response.status}: ${errText}`);
                    setModelCooldown(model, 30);
                    continue;
                }
                const rawText = yield response.text();
                let data;
                try {
                    data = JSON.parse(rawText);
                }
                catch (_d) {
                    // SSE fallback
                    const lines = rawText
                        .split("\n")
                        .filter((l) => l.startsWith("data: ") && !l.includes("[DONE]"));
                    const allContent = lines
                        .map((l) => {
                        var _a, _b, _c, _d, _e, _f;
                        try {
                            const c = JSON.parse(l.replace("data: ", ""));
                            return (((_c = (_b = (_a = c.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.delta) === null || _c === void 0 ? void 0 : _c.content) ||
                                ((_f = (_e = (_d = c.choices) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.message) === null || _f === void 0 ? void 0 : _f.content) ||
                                "");
                        }
                        catch (_g) {
                            return "";
                        }
                    })
                        .join("");
                    data = { choices: [{ message: { content: allContent || null } }] };
                }
                // Jangan pernah pakai reasoning_content sebagai jawaban ke user.
                let content = (_c = (_b = (_a = data.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
                if (!content || isInternalReasoning(content)) {
                    console.error(`❌ [AI] Model ${model} content kosong — skip`);
                    setModelCooldown(model, 10);
                    continue;
                }
                console.log(`✅ [AI] Model ${model} berhasil!`);
                return content;
            }
            catch (e) {
                if ((e === null || e === void 0 ? void 0 : e.name) === "AbortError") {
                    console.error(`❌ [AI] Model ${model} timeout`);
                    setModelCooldown(model, 30);
                    continue;
                }
                console.error(`❌ [AI] Model ${model} error:`, e === null || e === void 0 ? void 0 : e.message);
                setModelCooldown(model, 10);
                continue;
            }
        }
        throw new Error("Semua model gagal");
    });
}
// ── Main askAI ────────────────────────────────────────────────────────────────
function askAI(phone_1, userMessage_1) {
    return __awaiter(this, arguments, void 0, function* (phone, userMessage, ownerMode = false) {
        try {
            if (!chatHistory.has(phone))
                chatHistory.set(phone, []);
            const history = chatHistory.get(phone);
            const studentCtx = ownerMode ? null : yield getStudentContext(phone);
            let systemPrompt = "";
            if (ownerMode) {
                systemPrompt = `Jawab pertanyaan berikut dengan singkat, padat, dan natural — maksimal 3-4 kalimat.
Bisa membantu berbagai hal: coding, analisis, penulisan, info umum, ide bisnis, parfum, dll.
Gunakan Bahasa Indonesia. Kalau user pakai bahasa lain, ikuti.
Jangan bertele-tele, langsung ke poin.

Format untuk WhatsApp (tanpa Markdown):
- Jangan gunakan **, ##, *, -, atau backtick
- Gunakan emoji sebagai pengganti bullet: ✅ 📌 💡 📅
- Pisahkan paragraf dengan baris kosong`;
            }
            else if (studentCtx && !studentCtx.includes("tidak ditemukan")) {
                systemPrompt = `Kamu adalah asisten virtual SNN Institute Of Olfactory Sciences yang membantu murid melalui WhatsApp.

DATA MURID:
${studentCtx}

PANDUAN KETAT:
- Jawab HANYA seputar: jadwal sesi, kehadiran/absensi, materi modul, program studi, info kelas
- Kalau ditanya di luar topik studi/absensi, tolak sopan: "Maaf, saya hanya bisa bantu seputar jadwal dan kehadiran kelas kamu 😊"
- Bahasa Indonesia ramah dan profesional
- Gunakan emoji secukupnya
- Jawaban singkat, maksimal 3-4 kalimat
- Jangan sebut ID database

FORMAT WHATSAPP (tanpa Markdown):
- Jangan gunakan **, ##, *, -, atau backtick
- Gunakan emoji sebagai pengganti bullet: ✅ 📌 💡 📅`;
            }
            else {
                systemPrompt = `Jawab pertanyaan berikut dalam Bahasa Indonesia dengan ramah dan singkat — maksimal 3-4 kalimat, langsung ke poin.
Jika ditanya tentang SNN Institute, jelaskan bahwa ini lembaga sertifikasi kompounding olfaktori.

Format untuk WhatsApp:
- Tidak menggunakan Markdown seperti **, ##, *, atau backtick
- Gunakan emoji secukupnya
- Tulis seperti chat biasa`;
            }
            history.push({ role: "user", content: userMessage });
            while (history.length > MAX_HISTORY)
                history.shift();
            const messages = [{ role: "system", content: systemPrompt }, ...history];
            const rawReply = yield callAI(messages);
            let aiReply = rawReply
                .replace(/<thinking>[\s\S]*?<\/thinking>/gi, "")
                .replace(/<think>[\s\S]*?<\/think>/gi, "")
                .replace(/<[^>]+>/g, "")
                .replace(/#{1,6} /g, "")
                .replace(/[*][*](.+?)[*][*]/g, "$1")
                .replace(/[*](.+?)[*]/g, "$1")
                .replace(/[`](.+?)[`]/g, "$1")
                .replace(/^[ \t]*[-] /gm, "➤ ")
                .replace(/[\n]{3,}/g, "\n\n")
                .trim();
            if (!aiReply || isInternalReasoning(aiReply)) {
                aiReply = "Hai! Ada yang bisa saya bantu? 😊";
            }
            history.push({ role: "assistant", content: aiReply });
            console.log(`🤖 [AI] Reply ke ${phone}: ${aiReply.substring(0, 80)}...`);
            return aiReply;
        }
        catch (e) {
            console.error("❌ [AI] Semua model gagal:", e);
            return "Maaf, asisten AI sedang tidak tersedia. Silakan coba lagi nanti. 🙏";
        }
    });
}
// ── Helper: kirim reply ───────────────────────────────────────────────────────
function sendReply(rawJid, from, text) {
    return __awaiter(this, void 0, void 0, function* () {
        const sockNow = (0, whatsapp_1.getWASocket)();
        if (sockNow && (0, whatsapp_1.isWAConnected)()) {
            yield sockNow.sendMessage(rawJid, { text });
            console.log(`📤 [Bot] Reply terkirim ke ${rawJid}`);
        }
        else {
            yield (0, whatsapp_1.sendWAMessage)(from, text);
        }
    });
}
const pendingByPhone = new Map();
const activeSessions = new Map();
const lidToPhone = new Map();
function formatPhone(phone) {
    return phone.replace(/\D/g, "").replace(/^0/, "62");
}
function isSessionExpired(pending) {
    return Date.now() > pending.scheduleStartAt + SESSION_EXPIRE_MS;
}
function confirmCheckIn(phone, pending, lat, lon) {
    return __awaiter(this, void 0, void 0, function* () {
        pending.state = "LIVE_ACTIVE";
        pending.lastLat = lat;
        pending.lastLon = lon;
        pending.lastLocationAt = Date.now();
        pending.checkedInAt = Date.now();
        yield prisma_1.default.sessionAttendance.upsert({
            where: {
                sessionId_enrollmentId: {
                    sessionId: pending.sessionId,
                    enrollmentId: pending.enrollmentId,
                },
            },
            create: {
                sessionId: pending.sessionId,
                enrollmentId: pending.enrollmentId,
                isPresent: true,
                checkedInAt: new Date(),
            },
            update: { isPresent: true, checkedInAt: new Date() },
        });
        yield updateEnrollmentProgress(pending.enrollmentId, pending.sessionId);
        console.log(`✅ [Bot] Check-in ${phone} — sesi ${pending.sessionId}`);
        yield (0, whatsapp_1.sendWAMessage)(phone, `✅ *Check-in berhasil!*\n\nKamu tercatat hadir di lokasi kelas. 📍\n\n⚠️ *Penting:* Jaga Live Location kamu tetap aktif hingga jam *16.00 WIB*.\n\n☕ *Istirahat 12.00 – 13.30:* Live Location boleh mati atau kamu boleh keluar. Pastikan Share Live Location lagi setelah istirahat selesai.\n\nDi luar jam istirahat, jika Live Location mati lebih dari 10 menit atau kamu tidak ada dari kawasan kampus, absensi akan dianggap *tidak hadir*.\n\nSelamat belajar! 🎓`);
    });
}
function startAttendanceBot() {
    startReminderBot();
    console.log("🤖 [Attendance Bot] Cron dimulai — cek jadwal setiap menit");
    // ── Cron checkout: setiap hari jam 16:00 ────────────────────────────────────
    node_cron_1.default.schedule("0 16 * * *", () => __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        console.log("🔒 [Checkout Cron] Proses checkout jam 16:00...");
        const NORMAL_TIMEOUT_MS = 10 * 60 * 1000; // 10 menit di luar istirahat
        const BREAK_END_MS = BREAK_END_MINUTE * 60 * 1000; // 13:30 dalam ms dari tengah malam
        const entries = Array.from(pendingByPhone.entries());
        for (const [phone, pending] of entries) {
            if (pending.state !== "LIVE_ACTIVE")
                continue;
            const now = Date.now();
            const lastUpdate = pending.lastLocationAt || 0;
            const gapMs = now - lastUpdate;
            // Cek apakah gap mencakup waktu istirahat:
            // lastUpdate sebelum jam 13:30 hari ini, dan sekarang sudah lewat 13:30
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            const breakEndToday = todayStart.getTime() + BREAK_END_MS;
            const lastUpdateInBreak = lastUpdate < breakEndToday && now >= breakEndToday;
            // Toleransi: kalau gap mencakup istirahat, kurangi durasi istirahat (90 menit) dari gap
            const effectiveGapMs = lastUpdateInBreak
                ? gapMs - (BREAK_END_MINUTE - BREAK_START_MINUTE) * 60 * 1000
                : gapMs;
            const isLiveStillActive = effectiveGapMs < NORMAL_TIMEOUT_MS;
            const isStillInRadius = pending.lastLat !== undefined &&
                pending.lastLon !== undefined &&
                (0, haversine_1.haversineDistance)(pending.moduleLat, pending.moduleLon, pending.lastLat, pending.lastLon) <= RADIUS_METER;
            if (isLiveStillActive && isStillInRadius) {
                // Masih di lokasi saat jam 16:00 → tetap HADIR, update checkedOutAt
                pending.state = "DONE";
                yield prisma_1.default.sessionAttendance.upsert({
                    where: {
                        sessionId_enrollmentId: {
                            sessionId: pending.sessionId,
                            enrollmentId: pending.enrollmentId,
                        },
                    },
                    create: {
                        sessionId: pending.sessionId,
                        enrollmentId: pending.enrollmentId,
                        isPresent: true,
                        checkedInAt: new Date(pending.checkedInAt || now),
                        checkedOutAt: new Date(),
                    },
                    update: { checkedOutAt: new Date() },
                });
                yield (0, whatsapp_1.sendWAMessage)(phone, `✅ *Absensi selesai!*\n\nKamu tercatat *HADIR PENUH* untuk sesi hari ini. 🎉\nTerima kasih sudah hadir hingga selesai!\n\nSampai jumpa di sesi berikutnya! 👋`);
                console.log(`✅ [Checkout] ${phone} HADIR PENUH — sesi ${pending.sessionId}`);
            }
            else {
                // Keluar radius atau live location mati → ubah jadi TIDAK HADIR + catat alasan
                pending.state = "DONE";
                const note = !isLiveStillActive
                    ? "Live Location mati lebih dari 10 menit di luar jam istirahat"
                    : `Keluar radius kelas sebelum jam 16.00 (jarak terakhir: ${Math.round((0, haversine_1.haversineDistance)(pending.moduleLat, pending.moduleLon, (_a = pending.lastLat) !== null && _a !== void 0 ? _a : 0, (_b = pending.lastLon) !== null && _b !== void 0 ? _b : 0))}m)`;
                yield prisma_1.default.sessionAttendance.upsert({
                    where: {
                        sessionId_enrollmentId: {
                            sessionId: pending.sessionId,
                            enrollmentId: pending.enrollmentId,
                        },
                    },
                    create: {
                        sessionId: pending.sessionId,
                        enrollmentId: pending.enrollmentId,
                        isPresent: false,
                        checkedInAt: new Date(pending.checkedInAt || now),
                        note,
                    },
                    update: { isPresent: false, note },
                });
                yield updateEnrollmentProgress(pending.enrollmentId, pending.sessionId);
                yield (0, whatsapp_1.sendWAMessage)(phone, `❌ *Absensi tidak lengkap.*\n\nKamu tercatat *TIDAK HADIR* untuk sesi hari ini.\n\nAlasan: ${note}.\n\nJika ada kendala, silakan hubungi admin. 🙏`);
                console.log(`❌ [Checkout] ${phone} TIDAK HADIR — ${note}`);
            }
            pendingByPhone.delete(phone);
        }
        console.log("🔒 [Checkout Cron] Selesai.");
    }));
    console.log("🔒 [Checkout Bot] Aktif — checkout otomatis setiap hari jam 16:00 WIB");
    const sockInst = (0, whatsapp_1.getWASocket)();
    if (sockInst) {
        sockInst.ev.on("contacts.upsert", (contacts) => {
            for (const contact of contacts) {
                if (contact.lid && contact.id) {
                    const lid = contact.lid.replace(/@.*/, "");
                    const phone = contact.id.replace(/@.*/, "");
                    if (lid && phone && lid !== phone)
                        lidToPhone.set(lid, phone);
                }
            }
            console.log(`📱 [Bot] lidToPhone updated: ${lidToPhone.size} entries`);
        });
    }
    (0, whatsapp_1.onWAMessage)((msg) => __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        try {
            const rawJid = msg.key.remoteJid || "";
            let from = rawJid.replace("@s.whatsapp.net", "").replace("@lid", "");
            const resolvedPhone = lidToPhone.get(from);
            if (resolvedPhone)
                from = resolvedPhone;
            if (from.endsWith("@g.us") ||
                from.endsWith("@newsletter") ||
                from.endsWith("@broadcast")) {
                console.log(`🚫 [Bot] Pesan dari group/newsletter diabaikan: ${from}`);
                return;
            }
            const ownerResolvedPhone = lidToPhone.get(from) || from;
            const ownerNormalized = ownerResolvedPhone
                .replace(/[^0-9]/g, "")
                .replace(/^0/, "62");
            const fromVariants = [
                from,
                ownerResolvedPhone,
                ownerNormalized,
                from.replace(/\D/g, ""),
                from.replace(/\D/g, "").replace(/^0/, "62"),
            ].filter(Boolean);
            const isOwner = BOT_OWNER_PHONES.some((owner) => fromVariants.includes(owner)) ||
                BOT_OWNER_PHONES_NORMALIZED.some((owner) => fromVariants.includes(owner));
            console.log(`📨 [Bot] from=${from} resolved=${ownerResolvedPhone} isOwner=${isOwner}`);
            if (isOwner) {
                const userInput = getMessageInput(msg);
                if (userInput) {
                    console.log(`👑 [Bot] Owner mode: ${from}`);
                    yield markAsRead(rawJid, msg.key);
                    yield showTyping(rawJid);
                    const aiReply = yield askAI(from, userInput, true);
                    yield stopTyping(rawJid);
                    yield sendReply(rawJid, from, aiReply);
                }
                return;
            }
            let pending = pendingByPhone.get(from);
            if (!pending) {
                const locationMsg = ((_a = msg.message) === null || _a === void 0 ? void 0 : _a.locationMessage) || ((_b = msg.message) === null || _b === void 0 ? void 0 : _b.liveLocationMessage);
                if (locationMsg && pendingByPhone.size >= 1) {
                    for (const [key, val] of pendingByPhone.entries()) {
                        if (val.state !== "DONE" && !key.includes("@")) {
                            pending = val;
                            pendingByPhone.set(from, val);
                            lidToPhone.set(from, key);
                            console.log(`📨 [Bot] LID assign: ${from} → ${key}`);
                            break;
                        }
                    }
                }
                if (!pending) {
                    console.log(`📨 [Bot] ${from} tidak ada di pending — forward ke AI`);
                    const userInput = getMessageInput(msg);
                    if (userInput) {
                        yield markAsRead(rawJid, msg.key);
                        yield showTyping(rawJid);
                        const aiReply = yield askAI(from, userInput);
                        yield stopTyping(rawJid);
                        yield sendReply(rawJid, from, aiReply);
                    }
                    return;
                }
            }
            const replyTo = pending.phone;
            if (isSessionExpired(pending)) {
                pending.state = "DONE";
                yield (0, whatsapp_1.sendWAMessage)(replyTo, `⏰ *Waktu absensi telah habis.*\n\nBatas waktu absensi adalah 30 menit setelah kelas dimulai.\nKamu tercatat *tidak hadir* untuk sesi ini.`);
                return;
            }
            if (pending.state === "WAITING_LIVE_LOCATION") {
                // Hanya terima liveLocationMessage, bukan locationMessage biasa
                const liveLocMsg = (_c = msg.message) === null || _c === void 0 ? void 0 : _c.liveLocationMessage;
                if (!liveLocMsg) {
                    yield (0, whatsapp_1.sendWAMessage)(replyTo, `📍 Silakan kirim *Share Live Location* (bukan Share Lokasi biasa) untuk absensi.\n\nCara:\n1. Ketuk ikon 📎 / lampiran\n2. Pilih *Lokasi*\n3. Pilih *Bagikan lokasi langsung* (pilih durasi minimal 1 jam)\n\n_Pastikan kamu berada di lokasi kelas (radius ${RADIUS_METER}m)._`);
                    return;
                }
                const lat = liveLocMsg.degreesLatitude;
                const lon = liveLocMsg.degreesLongitude;
                const jarak = (0, haversine_1.haversineDistance)(pending.moduleLat, pending.moduleLon, lat, lon);
                const jarakFormatted = Math.round(jarak);
                console.log(`📍 [Bot] Live location ${replyTo}: ${lat},${lon} — jarak ${jarakFormatted}m`);
                if (jarak <= RADIUS_METER) {
                    yield confirmCheckIn(replyTo, pending, lat, lon);
                }
                else {
                    yield (0, whatsapp_1.sendWAMessage)(replyTo, `❌ *Lokasi tidak sesuai!*\n\nKamu berada di luar jangkauan lokasi kelas.\n📍 Jarak kamu: *${jarakFormatted}m* (maks. ${RADIUS_METER}m)\n\nPastikan kamu sudah berada di lokasi kelas, lalu kirim *Share Live Location* lagi.`);
                }
                return;
            }
            if (pending.state === "LIVE_ACTIVE") {
                const liveLocMsg = (_d = msg.message) === null || _d === void 0 ? void 0 : _d.liveLocationMessage;
                if (liveLocMsg) {
                    const lat = liveLocMsg.degreesLatitude;
                    const lon = liveLocMsg.degreesLongitude;
                    const jarak = (0, haversine_1.haversineDistance)(pending.moduleLat, pending.moduleLon, lat, lon);
                    const jarakFormatted = Math.round(jarak);
                    // Update last known position
                    pending.lastLat = lat;
                    pending.lastLon = lon;
                    pending.lastLocationAt = Date.now();
                    console.log(`📡 [Bot] Live update ${replyTo}: ${lat},${lon} — jarak ${jarakFormatted}m`);
                    if (jarak > RADIUS_METER) {
                        console.log(`⚠️ [Bot] ${replyTo} keluar radius saat sesi berlangsung (${jarakFormatted}m)`);
                        // Tidak langsung tandai tidak hadir — cron jam 16:00 yang memutuskan
                    }
                }
                // Kalau murid chat teks saat sudah check-in → lempar ke AI
                const userInput = getMessageInput(msg);
                if (userInput && !liveLocMsg) {
                    const aiReply = yield askAI(replyTo, userInput);
                    yield (0, whatsapp_1.sendWAMessage)(replyTo, aiReply);
                }
                return;
            }
            if (pending.state === "DONE") {
                const userInput = getMessageInput(msg);
                if (userInput) {
                    const aiReply = yield askAI(replyTo, userInput);
                    yield (0, whatsapp_1.sendWAMessage)(replyTo, aiReply);
                }
                else {
                    yield (0, whatsapp_1.sendWAMessage)(replyTo, `✅ Absensi kamu sudah selesai diproses untuk sesi ini.`);
                }
            }
        }
        catch (error) {
            console.error("❌ [Bot Handler] Error:", error);
        }
    }));
    node_cron_1.default.schedule("* * * * *", () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const now = new Date();
            const windowStart = new Date(now.getTime() - 60 * 1000);
            const windowEnd = new Date(now.getTime());
            const sessions = yield prisma_1.default.moduleSession.findMany({
                where: {
                    isCancelled: false,
                    isHoliday: false,
                    sessionDate: { gte: windowStart, lte: windowEnd },
                    module: { is: { status: "PUBLISHED", deletedAt: null } },
                },
                include: {
                    module: {
                        include: {
                            program: {
                                include: {
                                    enrollments: {
                                        where: { status: "ACTIVE" },
                                        include: {
                                            student: {
                                                include: {
                                                    user: {
                                                        select: { fullName: true, no_handphone: true },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            for (const session of sessions) {
                if (!session.module)
                    continue;
                if (activeSessions.has(session.id))
                    continue;
                if (!session.module.latitude || !session.module.longitude) {
                    console.log(`⚠️ [Bot] Sesi ${session.id} tidak punya koordinat — skip`);
                    continue;
                }
                console.log(`📅 [Bot] Sesi ${session.order} modul "${session.module.title}" dimulai`);
                activeSessions.set(session.id, true);
                const enrollments = ((_a = session.module.program) === null || _a === void 0 ? void 0 : _a.enrollments) || [];
                for (const enrollment of enrollments) {
                    const user = enrollment.student.user;
                    const phone = user.no_handphone;
                    if (!phone)
                        continue;
                    const formattedPhone = formatPhone(phone);
                    const pendingData = {
                        studentId: enrollment.studentId,
                        sessionId: session.id,
                        enrollmentId: enrollment.id,
                        moduleLat: session.module.latitude,
                        moduleLon: session.module.longitude,
                        phone: formattedPhone,
                        state: "WAITING_LIVE_LOCATION",
                        scheduleStartAt: Date.now(),
                        moduleTitle: session.module.title,
                    };
                    pendingByPhone.set(formattedPhone, pendingData);
                    yield prisma_1.default.sessionAttendance.upsert({
                        where: {
                            sessionId_enrollmentId: {
                                sessionId: session.id,
                                enrollmentId: enrollment.id,
                            },
                        },
                        create: {
                            sessionId: session.id,
                            enrollmentId: enrollment.id,
                            isPresent: false,
                        },
                        update: {},
                    });
                    yield (0, whatsapp_1.sendWAMessage)(phone, `🎓 *SNN Institute — Absensi Sesi ${session.order}*\n\nHalo ${user.fullName}! 👋\n\nSesi ke-*${session.order}* modul *"${session.module.title}"* sudah dimulai.\n\n📍 Silakan kirim *Share Live Location* untuk memulai absensi.\n\nCara:\n1. Ketuk ikon 📎 / lampiran\n2. Pilih *Lokasi*\n3. Pilih *Bagikan lokasi langsung* (pilih durasi *minimal 1 jam*)\n\n_Pastikan kamu berada di lokasi kelas (radius ${RADIUS_METER}m)._\n_Live Location harus aktif hingga jam *16.00 WIB*._\n_Batas waktu check-in: 30 menit._`);
                    console.log(`📤 [Bot] WA terkirim ke ${user.fullName} (${phone})`);
                }
                setTimeout(() => {
                    activeSessions.delete(session.id);
                    for (const [key, val] of pendingByPhone.entries()) {
                        if (val.sessionId === session.id)
                            pendingByPhone.delete(key);
                    }
                    console.log(`🔒 [Bot] Sesi ${session.order} ditutup`);
                }, SESSION_EXPIRE_MS);
            }
        }
        catch (error) {
            console.error("❌ [Bot Cron] Error:", error);
        }
    }));
}
function updateEnrollmentProgress(enrollmentId, sessionId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sessionData = yield prisma_1.default.moduleSession.findUnique({
                where: { id: sessionId },
                select: { moduleId: true },
            });
            if (!sessionData)
                return;
            const totalSessions = yield prisma_1.default.moduleSession.count({
                where: { moduleId: sessionData.moduleId, isCancelled: false },
            });
            const presentCount = yield prisma_1.default.sessionAttendance.count({
                where: { enrollmentId, isPresent: true },
            });
            const progress = totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;
            yield prisma_1.default.programEnrollment.update({
                where: { id: enrollmentId },
                data: { progress },
            });
            console.log(`📊 [Bot] Progress ${enrollmentId}: ${presentCount}/${totalSessions} = ${progress}%`);
        }
        catch (e) {
            console.error("Error updateProgress:", e);
        }
    });
}
function startReminderBot() {
    node_cron_1.default.schedule("0 13 * * *", () => __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            console.log("🔔 [Reminder] Cek sesi besok...");
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(0, 0, 0, 0);
            const dayAfter = new Date(tomorrow);
            dayAfter.setDate(dayAfter.getDate() + 1);
            const sessions = yield prisma_1.default.moduleSession.findMany({
                where: {
                    isCancelled: false,
                    isHoliday: false,
                    sessionDate: { gte: tomorrow, lt: dayAfter },
                    module: { is: { status: "PUBLISHED", deletedAt: null } },
                },
                include: {
                    module: {
                        include: {
                            program: {
                                include: {
                                    enrollments: {
                                        where: { status: "ACTIVE" },
                                        include: {
                                            student: {
                                                include: {
                                                    user: {
                                                        select: { fullName: true, no_handphone: true },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            if (sessions.length === 0) {
                console.log("🔔 [Reminder] Tidak ada sesi besok");
                return;
            }
            console.log(`🔔 [Reminder] Ditemukan ${sessions.length} sesi besok`);
            for (const session of sessions) {
                if (!session.module)
                    continue;
                const enrollments = ((_a = session.module.program) === null || _a === void 0 ? void 0 : _a.enrollments) || [];
                const sessionDate = new Date(session.sessionDate);
                const dayName = sessionDate.toLocaleDateString("id-ID", {
                    weekday: "long",
                });
                const dateStr = sessionDate.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                });
                for (const enrollment of enrollments) {
                    const user = enrollment.student.user;
                    const phone = user.no_handphone;
                    if (!phone)
                        continue;
                    yield (0, whatsapp_1.sendWAMessage)(phone, `🔔 *Reminder Sesi Besok!*\n\nHalo ${user.fullName}! 👋\n\nBesok kamu ada sesi kelas:\n\n📚 *Modul:* ${session.module.title}\n🗓️ *Hari:* ${dayName}, ${dateStr}\n⏰ *Jam:* ${session.startTime} WIB\n📍 *Lokasi:* ${session.module.location || "Lihat info program"}\n📖 *Sesi ke-:* ${session.order}\n\nJangan lupa hadir ya! Semangat! 💪`);
                    console.log(`🔔 [Reminder] Terkirim ke ${user.fullName} (${phone})`);
                }
            }
            console.log("🔔 [Reminder] Selesai kirim reminder");
        }
        catch (error) {
            console.error("❌ [Reminder Cron] Error:", error);
        }
    }));
    console.log("🔔 [Reminder Bot] Aktif — reminder setiap hari jam 20:00 WIB");
}
//# sourceMappingURL=attendance.bot.js.map