// @ts-nocheck
import { Router, Request, Response } from "express";
import { verifyToken } from "../../../Middleware/verifyToken";
import multer from "multer";
import * as cheerio from "cheerio";

const router = Router();
import prisma from "../../../prisma";
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const allowed = /\.(html|htm|txt)$/i;
    if (allowed.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file HTML atau TXT yang diizinkan"));
    }
  },
});

// ── Extract teks dari HTML ────────────────────────────────────────────────────
function extractTextFromHTML(html: string): string {
  const $ = cheerio.load(html);
  $("script, style, noscript, svg, canvas").remove();

  const textParts: string[] = [];

  const title = $("title").text().trim();
  if (title) textParts.push(`JUDUL: ${title}`);

  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  if (bodyText) textParts.push(bodyText);

  return textParts.join("\n").slice(0, 8000);
}

// ── Extract teks dari TXT ─────────────────────────────────────────────────────
function extractTextFromTxt(buffer: Buffer): string {
  return buffer.toString("utf-8").replace(/\s+/g, " ").trim().slice(0, 8000);
}

// ── POST /api/exams/:id/generate-ai ──────────────────────────────────────────
router.post(
  "/:examId/generate-ai",
  verifyToken,
  upload.single("material"),
  async (req: Request, res: Response): Promise<any> => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "File wajib diupload (format: .html, .htm, atau .txt)",
        });
      }

      const {
        questionCount = "10",
        questionTypes = "MULTIPLE_CHOICE",
        difficulty = "MEDIUM",
        pointsPerQ = "10",
      } = req.body;

      // 1. Extract teks sesuai tipe file
      const isTxt =
        req.file.mimetype === "text/plain" ||
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
      const typeInstructions: any = {
        MULTIPLE_CHOICE:
          "pilihan ganda dengan 4 pilihan (A, B, C, D), hanya 1 jawaban benar",
        TRUE_FALSE: "benar/salah dengan 2 pilihan: 'Benar' dan 'Salah'",
        ESSAY: "essay terbuka yang membutuhkan jawaban deskriptif",
      };

      const types = questionTypes.split(",").map((t: string) => t.trim());
      const typeDesc = types
        .map((t: string) => typeInstructions[t] || t)
        .join(", dan ");

      const difficultyDesc: any = {
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
      const examModel =
        process.env.NINE_ROUTER_MODEL_EXAM || "kr/claude-sonnet-4.5";

      const aiResponse = await fetch(
        `${process.env.NINE_ROUTER_URL}/chat/completions`,
        {
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
        },
      );

      if (!aiResponse.ok) {
        const errText = await aiResponse.text();
        console.error("9Router error:", errText.slice(0, 300));
        throw new Error(`9Router error: ${aiResponse.status}`);
      }

      const responseText = await aiResponse.text();

      let aiData: any;
      try {
        aiData = JSON.parse(responseText);
      } catch (_) {
        const sseLines = responseText
          .split("\n")
          .filter(
            (line) => line.startsWith("data: ") && line !== "data: [DONE]",
          );

        if (sseLines.length > 0) {
          let fullContent = "";
          for (const line of sseLines) {
            try {
              const chunk = JSON.parse(line.replace("data: ", ""));
              const delta =
                chunk.choices?.[0]?.delta?.content ||
                chunk.choices?.[0]?.message?.content ||
                "";
              fullContent += delta;
            } catch (_) {}
          }
          aiData = { choices: [{ message: { content: fullContent } }] };
        } else {
          throw new Error(
            "Format response AI tidak dikenali: " + responseText.slice(0, 100),
          );
        }
      }

      const rawText = aiData.choices?.[0]?.message?.content || "";

      // 4. Strip <thinking> lalu parse JSON
      const strippedText = rawText
        .replace(/<thinking>[\s\S]*?<\/thinking>/gi, "")
        .trim();

      let parsed: any;
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
      } catch (e) {
        console.error("PARSE ERROR:", e.message);
        console.error("Raw content:", strippedText.slice(0, 200));
        return res.status(500).json({
          success: false,
          message: "AI gagal generate soal dalam format yang benar. Coba lagi.",
          rawResponse: strippedText.slice(0, 300),
        });
      }

      // 5. Validasi dan normalize soal
      const questions = (parsed.questions || []).map((q: any, i: number) => ({
        text: q.text || `Soal ${i + 1}`,
        type: q.type || "MULTIPLE_CHOICE",
        points: Number(q.points) || Number(pointsPerQ),
        explanation: q.explanation || null,
        options: (q.options || []).map((o: any) => ({
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
    } catch (error: any) {
      console.error("Error generate AI exam:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Gagal generate soal",
      });
    }
  },
);

// ── POST /api/exams/:examId/save-ai-questions ─────────────────────────────────
router.post(
  "/:examId/save-ai-questions",
  verifyToken,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { examId } = req.params;
      const { questions } = req.body;

      if (!questions?.length) {
        return res
          .status(400)
          .json({ success: false, message: "Tidak ada soal untuk disimpan" });
      }

      const saved = [];
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const created = await prisma.question.create({
          data: {
            examId,
            text: q.text,
            type: q.type,
            points: q.points || 10,
            order: i,
            explanation: q.explanation || null,
            options: q.options?.length
              ? {
                  create: q.options.map((opt: any, j: number) => ({
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
    } catch (error: any) {
      console.error("Error save AI questions:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Gagal simpan soal",
      });
    }
  },
);

export default router;
