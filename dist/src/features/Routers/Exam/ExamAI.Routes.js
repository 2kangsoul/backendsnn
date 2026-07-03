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
// @ts-nocheck
const express_1 = require("express");
const verifyToken_1 = require("../../../Middleware/verifyToken");
const multer_1 = __importDefault(require("multer"));
const cheerio = __importStar(require("cheerio"));
const router = (0, express_1.Router)();
const prisma_1 = __importDefault(require("../../../prisma"));
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (_, file, cb) => {
        const allowed = /\.(html|htm|txt)$/i;
        if (allowed.test(file.originalname)) {
            cb(null, true);
        }
        else {
            cb(new Error("Hanya file HTML atau TXT yang diizinkan"));
        }
    },
});
// ── Extract teks dari HTML ────────────────────────────────────────────────────
function extractTextFromHTML(html) {
    const $ = cheerio.load(html);
    $("script, style, noscript, svg, canvas").remove();
    const textParts = [];
    const title = $("title").text().trim();
    if (title)
        textParts.push(`JUDUL: ${title}`);
    const bodyText = $("body").text().replace(/\s+/g, " ").trim();
    if (bodyText)
        textParts.push(bodyText);
    return textParts.join("\n").slice(0, 8000);
}
// ── Extract teks dari TXT ─────────────────────────────────────────────────────
function extractTextFromTxt(buffer) {
    return buffer.toString("utf-8").replace(/\s+/g, " ").trim().slice(0, 8000);
}
// ── POST /api/exams/:id/generate-ai ──────────────────────────────────────────
router.post("/:examId/generate-ai", verifyToken_1.verifyToken, upload.single("material"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "File wajib diupload (format: .html, .htm, atau .txt)",
            });
        }
        const { questionCount = "10", questionTypes = "MULTIPLE_CHOICE", difficulty = "MEDIUM", pointsPerQ = "10", } = req.body;
        // 1. Extract teks sesuai tipe file
        const isTxt = req.file.mimetype === "text/plain" ||
            req.file.originalname.toLowerCase().endsWith(".txt");
        const extractedText = isTxt
            ? extractTextFromTxt(req.file.buffer)
            : extractTextFromHTML(req.file.buffer.toString("utf-8"));
        if (extractedText.length < 50) {
            return res.status(400).json({
                success: false,
                message: `Konten file terlalu sedikit (${extractedText.length} karakter). Pastikan file berisi materi yang cukup.`,
            });
        }
        // 2. Build prompt
        const typeInstructions = {
            MULTIPLE_CHOICE: "pilihan ganda dengan 4 pilihan (A, B, C, D), hanya 1 jawaban benar",
            TRUE_FALSE: "benar/salah dengan 2 pilihan: 'Benar' dan 'Salah'",
            ESSAY: "essay terbuka yang membutuhkan jawaban deskriptif",
        };
        const types = questionTypes.split(",").map((t) => t.trim());
        const typeDesc = types
            .map((t) => typeInstructions[t] || t)
            .join(", dan ");
        const difficultyDesc = {
            EASY: "mudah (faktual, ingatan langsung dari materi)",
            MEDIUM: "sedang (pemahaman dan aplikasi konsep)",
            HARD: "sulit (analisis, sintesis, dan evaluasi mendalam)",
        };
        const userPrompt = `Buat ${questionCount} soal ujian dari materi berikut.

KETENTUAN:
- Tipe: ${typeDesc}
- Kesulitan: ${difficultyDesc[difficulty] || difficultyDesc.MEDIUM}
- Poin per soal: ${pointsPerQ}
- Bahasa: Indonesia
- Teks soal maksimal 50 kata
- Setiap pilihan jawaban maksimal 8 kata
- Penjelasan maksimal 20 kata

MATERI:
${extractedText.slice(0, 5000)}

PENTING: Balas HANYA dengan JSON berikut, TANPA teks lain, TANPA penjelasan, TANPA markdown:
{"questions":[{"text":"soal disini","type":"MULTIPLE_CHOICE","points":${pointsPerQ},"explanation":"penjelasan singkat","options":[{"text":"pilihan A","isCorrect":false},{"text":"pilihan B","isCorrect":true},{"text":"pilihan C","isCorrect":false},{"text":"pilihan D","isCorrect":false}]}]}

Buat ${questionCount} soal dengan format PERSIS seperti di atas. Mulai langsung dengan { jangan ada teks sebelumnya.`;
        // 3. Kirim ke 9Router AI
        const examModel = process.env.NINE_ROUTER_MODEL_EXAM || "kr/claude-sonnet-4.5";
        const aiResponse = yield fetch(`${process.env.NINE_ROUTER_URL}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.NINE_ROUTER_KEY}`,
            },
            body: JSON.stringify({
                model: examModel,
                messages: [{ role: "user", content: userPrompt }],
                max_tokens: 10000000,
                temperature: 0.3,
                stream: false,
            }),
        });
        if (!aiResponse.ok) {
            const errText = yield aiResponse.text();
            console.error("9Router error:", errText.slice(0, 300));
            throw new Error(`9Router error: ${aiResponse.status}`);
        }
        const responseText = yield aiResponse.text();
        let aiData;
        try {
            aiData = JSON.parse(responseText);
        }
        catch (_) {
            const sseLines = responseText
                .split("\n")
                .filter((line) => line.startsWith("data: ") && line !== "data: [DONE]");
            if (sseLines.length > 0) {
                let fullContent = "";
                for (const line of sseLines) {
                    try {
                        const chunk = JSON.parse(line.replace("data: ", ""));
                        const delta = ((_c = (_b = (_a = chunk.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.delta) === null || _c === void 0 ? void 0 : _c.content) ||
                            ((_f = (_e = (_d = chunk.choices) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.message) === null || _f === void 0 ? void 0 : _f.content) ||
                            "";
                        fullContent += delta;
                    }
                    catch (_) { }
                }
                aiData = { choices: [{ message: { content: fullContent } }] };
            }
            else {
                throw new Error("Format response AI tidak dikenali: " + responseText.slice(0, 100));
            }
        }
        const rawText = ((_j = (_h = (_g = aiData.choices) === null || _g === void 0 ? void 0 : _g[0]) === null || _h === void 0 ? void 0 : _h.message) === null || _j === void 0 ? void 0 : _j.content) || "";
        // 4. Strip <thinking> lalu parse JSON
        const strippedText = rawText
            .replace(/<thinking>[\s\S]*?<\/thinking>/gi, "")
            .trim();
        let parsed;
        try {
            let cleaned = strippedText
                .replace(/```[\w]*\n?/g, "")
                .replace(/```/g, "")
                .trim();
            const jsonStart = cleaned.indexOf("{");
            const jsonEnd = cleaned.lastIndexOf("}");
            if (jsonStart !== -1 && jsonEnd !== -1) {
                cleaned = cleaned.slice(jsonStart, jsonEnd + 1);
            }
            parsed = JSON.parse(cleaned);
        }
        catch (e) {
            console.error("PARSE ERROR:", e.message);
            console.error("Raw content:", strippedText.slice(0, 200));
            return res.status(500).json({
                success: false,
                message: "AI gagal generate soal dalam format yang benar. Coba lagi.",
                rawResponse: strippedText.slice(0, 300),
            });
        }
        // 5. Validasi dan normalize soal
        const questions = (parsed.questions || []).map((q, i) => ({
            text: q.text || `Soal ${i + 1}`,
            type: q.type || "MULTIPLE_CHOICE",
            points: Number(q.points) || Number(pointsPerQ),
            explanation: q.explanation || null,
            options: (q.options || []).map((o) => ({
                text: o.text || "",
                isCorrect: Boolean(o.isCorrect),
            })),
        }));
        return res.status(200).json({
            success: true,
            data: {
                questions,
                totalQuestions: questions.length,
                extractedLength: extractedText.length,
                message: `Berhasil generate ${questions.length} soal dari materi`,
            },
        });
    }
    catch (error) {
        console.error("Error generate AI exam:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Gagal generate soal",
        });
    }
}));
// ── POST /api/exams/:examId/save-ai-questions ─────────────────────────────────
router.post("/:examId/save-ai-questions", verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { examId } = req.params;
        const { questions } = req.body;
        if (!(questions === null || questions === void 0 ? void 0 : questions.length)) {
            return res
                .status(400)
                .json({ success: false, message: "Tidak ada soal untuk disimpan" });
        }
        const saved = [];
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            const created = yield prisma_1.default.question.create({
                data: {
                    examId,
                    text: q.text,
                    type: q.type,
                    points: q.points || 10,
                    order: i,
                    explanation: q.explanation || null,
                    options: ((_a = q.options) === null || _a === void 0 ? void 0 : _a.length)
                        ? {
                            create: q.options.map((opt, j) => ({
                                text: opt.text,
                                isCorrect: opt.isCorrect || false,
                                order: j,
                            })),
                        }
                        : undefined,
                },
                include: { options: { orderBy: { order: "asc" } } },
            });
            saved.push(created);
        }
        return res.status(201).json({
            success: true,
            data: saved,
            message: `${saved.length} soal berhasil disimpan ke ujian`,
        });
    }
    catch (error) {
        console.error("Error save AI questions:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Gagal simpan soal",
        });
    }
}));
exports.default = router;
//# sourceMappingURL=ExamAI.Routes.js.map