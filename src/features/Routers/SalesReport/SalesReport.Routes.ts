import { Router, Request, Response } from "express";
import { verifyToken } from "../../../Middleware/verifyToken";
import multer from "multer";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

const MODEL = () =>
  process.env.NINE_ROUTER_MODEL_REPORT ||
  process.env.NINE_ROUTER_MODEL_EXAM ||
  "kr/claude-sonnet-4.5";

async function callNineRouter(body: object): Promise<string> {
  const res = await fetch(`${process.env.NINE_ROUTER_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.NINE_ROUTER_KEY}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`9Router error ${res.status}: ${errText.slice(0, 200)}`);
  }
  const data = await res.json();
  let text = data.choices?.[0]?.message?.content || "";
  return text.replace(/<thinking>[\s\S]*?<\/thinking>/gi, "").trim();
}

// ── POST /api/ai/sales-report ─────────────────────────────────────────────────
router.post(
  "/sales-report",
  verifyToken,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { prompt } = req.body;
      if (!prompt)
        return res
          .status(400)
          .json({ success: false, message: "Prompt wajib diisi" });

      const rawText = await callNineRouter({
        model: MODEL(),
        messages: [{ role: "user", content: prompt }],
        max_tokens: 4000,
        temperature: 0.5,
        stream: false,
      });

      let cleaned = rawText
        .replace(/```[\w]*\n?/g, "")
        .replace(/```/g, "")
        .trim();
      const s = cleaned.indexOf("{"),
        e = cleaned.lastIndexOf("}");
      if (s !== -1 && e !== -1) cleaned = cleaned.slice(s, e + 1);
      const parsed = JSON.parse(cleaned);

      return res.status(200).json({ success: true, data: parsed });
    } catch (error: any) {
      console.error("sales-report error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
);

// ── POST /api/ai/extract-pdf ──────────────────────────────────────────────────
// Menerima file PDF lalu minta AI ekstrak teksnya (menggantikan call browser di ExamManager)
router.post(
  "/extract-pdf",
  verifyToken,
  upload.single("file"),
  async (req: Request, res: Response): Promise<any> => {
    try {
      if (!req.file)
        return res
          .status(400)
          .json({ success: false, message: "File PDF wajib diupload" });

      const base64 = req.file.buffer.toString("base64");

      const text = await callNineRouter({
        model: MODEL(),
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Ekstrak semua teks dari dokumen PDF ini. Kembalikan HANYA teks kontennya saja, tanpa penjelasan tambahan.",
              },
              {
                type: "image_url",
                image_url: { url: `data:application/pdf;base64,${base64}` },
              },
            ],
          },
        ],
        max_tokens: 8000,
        stream: false,
      });

      return res.status(200).json({ success: true, text });
    } catch (error: any) {
      console.error("extract-pdf error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
);

// ── POST /api/ai/extract-html ─────────────────────────────────────────────────
// Fallback ekstrak HTML SPA via AI (menggantikan call browser di ExamManager)
router.post(
  "/extract-html",
  verifyToken,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { html } = req.body;
      if (!html)
        return res
          .status(400)
          .json({ success: false, message: "HTML wajib diisi" });

      const text = await callNineRouter({
        model: MODEL(),
        messages: [
          {
            role: "user",
            content: `Dari HTML berikut, ekstrak SEMUA teks konten materi pembelajaran yang bermakna. Abaikan kode CSS/JS. Kembalikan hanya teks materi:\n\n${html.slice(0, 15000)}`,
          },
        ],
        max_tokens: 8000,
        stream: false,
      });

      return res.status(200).json({ success: true, text });
    } catch (error: any) {
      console.error("extract-html error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },
);

export default router;
