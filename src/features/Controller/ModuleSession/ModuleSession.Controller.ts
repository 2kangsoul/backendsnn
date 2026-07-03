// @ts-nocheck
import { Request, Response } from "express";
import { ModuleSessionService } from "../../Services/ModuleSession/ModuleSession.Services";

export class ModuleSessionController {
  private service = new ModuleSessionService();

  // POST /api/modules/:id/sessions/generate
  generateSessions = async (req: Request, res: Response): Promise<void> => {
    try {
      const moduleId = req.params.id;
      const result = await this.service.generateSessions(moduleId);
      res.status(201).json({
        success: true,
        message: `${result.created} sesi berhasil digenerate`,
        data: result,
      });
    } catch (error: any) {
      console.error("Error generateSessions:", error);
      res
        .status(400)
        .json({
          success: false,
          message: error.message || "Internal server error",
        });
    }
  };

  // GET /api/modules/:id/sessions
  getSessionsByModuleId = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const moduleId = req.params.id;
      const data = await this.service.getSessionsByModuleId(moduleId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error("Error getSessionsByModuleId:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  // GET /api/sessions/:id
  getSessionById = async (req: Request, res: Response): Promise<void> => {
    try {
      const sessionId = req.params.id;
      const data = await this.service.getSessionById(sessionId);
      if (!data) {
        res
          .status(404)
          .json({ success: false, message: "Sesi tidak ditemukan" });
        return;
      }
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error("Error getSessionById:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  // PUT /api/sessions/:id/cancel
  cancelSession = async (req: Request, res: Response): Promise<void> => {
    try {
      const sessionId = req.params.id;
      const data = await this.service.cancelSession(sessionId);
      res.status(200).json({ success: true, message: "Sesi dibatalkan", data });
    } catch (error: any) {
      console.error("Error cancelSession:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  // PUT /api/sessions/:id/restore
  restoreSession = async (req: Request, res: Response): Promise<void> => {
    try {
      const sessionId = req.params.id;
      const data = await this.service.restoreSession(sessionId);
      res.status(200).json({ success: true, message: "Sesi dipulihkan", data });
    } catch (error: any) {
      console.error("Error restoreSession:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  // PUT /api/sessions/:id/attendance
  markPresent = async (req: Request, res: Response): Promise<void> => {
    try {
      const sessionId = req.params.id;
      const { enrollmentId } = req.body;
      if (!enrollmentId) {
        res
          .status(400)
          .json({ success: false, message: "enrollmentId wajib diisi" });
        return;
      }
      const data = await this.service.markPresent(sessionId, enrollmentId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error("Error markPresent:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };
}
