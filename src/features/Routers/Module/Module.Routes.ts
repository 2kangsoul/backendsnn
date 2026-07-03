import prisma from "../../../prisma";
import { Router, Request, Response } from "express";
import multer from "multer";
import { supabase } from "../../../config/supabaseStorage";
import { verifyToken } from "../../../Middleware/verifyToken";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf", "text/html"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Hanya file PDF atau HTML yang diizinkan") as any, false);
    }
  },
});

// ── GET /api/modules/:id/sessions/:sessionId/attendances ──────────────────────
// Absensi per sesi (menggantikan /attendances lama)
router.get(
  "/:id/sessions/:sessionId/attendances",
  verifyToken,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const sessionId = String(req.params.sessionId);
      const attendances = await prisma.sessionAttendance.findMany({
        where: { sessionId },
        include: {
          enrollment: {
            include: {
              student: {
                include: {
                  user: {
                    select: {
                      id: true,
                      fullName: true,
                      email: true,
                      profilePic: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      });
      return res.status(200).json({ success: true, data: attendances });
    } catch (error) {
      console.error("Error getSessionAttendances:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  },
);

// ── GET /api/modules/:id/sessions ─────────────────────────────────────────────
// List semua sesi + rekap absensi per modul
router.get(
  "/:id/sessions",
  verifyToken,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const moduleId = String(req.params.id);
      const sessions = await prisma.moduleSession.findMany({
        where: { moduleId },
        orderBy: { order: "asc" },
        include: {
          attendances: {
            include: {
              enrollment: {
                include: {
                  student: {
                    include: {
                      user: {
                        select: {
                          id: true,
                          fullName: true,
                          email: true,
                          profilePic: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          _count: { select: { attendances: true } },
        },
      });
      return res.status(200).json({ success: true, data: sessions });
    } catch (error) {
      console.error("Error getSessions:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  },
);

// ── POST /api/modules/:id/sessions/generate ───────────────────────────────────
// Generate sesi otomatis (delegasi ke ModuleSession router via App.ts)
// Endpoint ini sudah didaftarkan di moduleSessionRouter — tidak perlu duplikat

// ── GET /api/modules/:id/material/preview ────────────────────────────────────
router.get(
  "/:id/material/preview",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const moduleId = String(req.params.id);
      const isDownload = req.query.download === "1";
      const module = await prisma.module.findUnique({ where: { id: moduleId } });

      if (!module?.materialUrl) {
        return res.status(404).json({ success: false, message: "Materi tidak ditemukan" });
      }

      const response = await fetch(module.materialUrl);
      if (!response.ok) {
        return res.status(502).json({ success: false, message: "Gagal mengambil file dari storage" });
      }

      const buffer = await response.arrayBuffer();
      const isHtml = module.materialUrl.endsWith(".html");
      const contentType = isHtml ? "text/html; charset=utf-8" : "application/pdf";
      const ext = isHtml ? ".html" : ".pdf";

      res.setHeader("Content-Type", contentType);
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Cache-Control", "no-cache");

      if (isDownload) {
        res.setHeader("Content-Disposition", `attachment; filename="materi-modul${ext}"`);
      } else if (isHtml) {
        res.setHeader("Content-Security-Policy", "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:;");
      }

      return res.send(Buffer.from(buffer));
    } catch (error) {
      console.error("Error previewMaterial:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  },
);

// ── PUT /api/modules/:id/material ────────────────────────────────────────────
router.put(
  "/:id/material",
  verifyToken,
  upload.single("file"),
  async (req: Request, res: Response): Promise<any> => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "File wajib diupload" });
      }

      const moduleId = String(req.params.id);
      const multerFile = req.file as Express.Multer.File;
      const ext = multerFile.mimetype === "text/html" ? ".html" : ".pdf";
      const fileName = `module-${moduleId}-${Date.now()}${ext}`;
      const contentType = multerFile.mimetype === "text/html"
        ? "text/html; charset=utf-8"
        : "application/pdf";

      const { error } = await supabase.storage
        .from("module-materials")
        .upload(fileName, multerFile.buffer, { contentType, upsert: true });

      if (error) {
        console.error("Supabase upload error:", error);
        return res.status(500).json({ success: false, message: "Gagal upload ke Supabase Storage" });
      }

      const { data: publicUrlData } = supabase.storage
        .from("module-materials")
        .getPublicUrl(fileName);

      const materialUrl = publicUrlData.publicUrl;

      const updatedModule = await prisma.module.update({
        where: { id: moduleId },
        data: { materialUrl },
      });

      return res.status(200).json({
        success: true,
        message: "Materi berhasil diupload",
        data: { materialUrl, module: updatedModule },
      });
    } catch (error: any) {
      console.error("Error uploadMaterial:", error);
      return res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
  },
);

// ── DELETE /api/modules/:id/material ─────────────────────────────────────────
router.delete(
  "/:id/material",
  verifyToken,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const moduleId = String(req.params.id);
      const module = await prisma.module.findUnique({ where: { id: moduleId } });

      if (!module)
        return res.status(404).json({ success: false, message: "Modul tidak ditemukan" });

      if (module.materialUrl) {
        const fileName = module.materialUrl.split("/").pop();
        if (fileName) {
          await supabase.storage.from("module-materials").remove([fileName]);
        }
      }

      const updatedModule = await prisma.module.update({
        where: { id: moduleId },
        data: { materialUrl: null },
      });

      return res.status(200).json({ success: true, message: "Materi berhasil dihapus", data: updatedModule });
    } catch (error) {
      console.error("Error deleteMaterial:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  },
);

// ── PUT /api/modules/:id ──────────────────────────────────────────────────────
router.put(
  "/:id",
  verifyToken,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const moduleId = String(req.params.id);
      const {
        status, title, description, location,
        scheduleDate, durationHour, maxParticipant, notes,
        latitude, longitude,
        recurringDay, recurringTime, totalSessions,
      } = req.body;

      const updateData: any = {};
      if (status !== undefined)         updateData.status = status;
      if (title !== undefined)          updateData.title = title;
      if (description !== undefined)    updateData.description = description;
      if (location !== undefined)       updateData.location = location;
      if (scheduleDate !== undefined)   updateData.scheduleDate = scheduleDate;
      if (durationHour !== undefined)   updateData.durationHour = durationHour;
      if (maxParticipant !== undefined) updateData.maxParticipant = maxParticipant;
      if (notes !== undefined)          updateData.notes = notes;
      if (latitude !== undefined)       updateData.latitude = latitude;
      if (longitude !== undefined)      updateData.longitude = longitude;
      if (recurringDay !== undefined)   updateData.recurringDay = recurringDay;
      if (recurringTime !== undefined)  updateData.recurringTime = recurringTime;
      if (totalSessions !== undefined)  updateData.totalSessions = Number(totalSessions);

      const updatedModule = await prisma.module.update({
        where: { id: moduleId },
        data: updateData,
      });

      return res.status(200).json({ success: true, data: updatedModule });
    } catch (error) {
      console.error("Error updateModule:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  },
);

// ── GET /api/modules/:id ── HARUS PALING BAWAH ───────────────────────────────
router.get("/:id", async (req: Request, res: Response): Promise<any> => {
  try {
    const moduleId = String(req.params.id);
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        sessions: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            sessionDate: true,
            startTime: true,
            order: true,
            isHoliday: true,
            isCancelled: true,
            _count: { select: { attendances: true } },
          },
        },
        _count: { select: { sessions: true } },
      },
    });
    if (!module)
      return res.status(404).json({ success: false, message: "Modul tidak ditemukan" });
    return res.status(200).json({ success: true, data: module });
  } catch (error) {
    console.error("Error getModule:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;