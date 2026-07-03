// @ts-nocheck
import { Router } from "express";
import { ModuleSessionController } from "../../Controller/ModuleSession/ModuleSession.Controller";
import { verifyToken } from "../../../Middleware/verifyToken";

const router = Router();
const ctrl = new ModuleSessionController();

// ── Routes dengan prefix /api/modules/:id ────────────────────────────────────
// Didaftarkan di moduleRouter
router.post("/:id/sessions/generate", verifyToken, ctrl.generateSessions);
router.get("/:id/sessions", verifyToken, ctrl.getSessionsByModuleId);

// ── Routes dengan prefix /api/sessions ───────────────────────────────────────
// Didaftarkan sebagai sessionRouter terpisah
export const sessionRouter = Router();
sessionRouter.get("/:id", verifyToken, ctrl.getSessionById);
sessionRouter.put("/:id/cancel", verifyToken, ctrl.cancelSession);
sessionRouter.put("/:id/restore", verifyToken, ctrl.restoreSession);
sessionRouter.put("/:id/attendance", verifyToken, ctrl.markPresent);

export default router;
