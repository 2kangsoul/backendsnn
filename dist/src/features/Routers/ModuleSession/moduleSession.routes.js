"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionRouter = void 0;
// @ts-nocheck
const express_1 = require("express");
const ModuleSession_Controller_1 = require("../../Controller/ModuleSession/ModuleSession.Controller");
const verifyToken_1 = require("../../../Middleware/verifyToken");
const router = (0, express_1.Router)();
const ctrl = new ModuleSession_Controller_1.ModuleSessionController();
// ── Routes dengan prefix /api/modules/:id ────────────────────────────────────
// Didaftarkan di moduleRouter
router.post("/:id/sessions/generate", verifyToken_1.verifyToken, ctrl.generateSessions);
router.get("/:id/sessions", verifyToken_1.verifyToken, ctrl.getSessionsByModuleId);
// ── Routes dengan prefix /api/sessions ───────────────────────────────────────
// Didaftarkan sebagai sessionRouter terpisah
exports.sessionRouter = (0, express_1.Router)();
exports.sessionRouter.get("/:id", verifyToken_1.verifyToken, ctrl.getSessionById);
exports.sessionRouter.put("/:id/cancel", verifyToken_1.verifyToken, ctrl.cancelSession);
exports.sessionRouter.put("/:id/restore", verifyToken_1.verifyToken, ctrl.restoreSession);
exports.sessionRouter.put("/:id/attendance", verifyToken_1.verifyToken, ctrl.markPresent);
exports.default = router;
//# sourceMappingURL=moduleSession.routes.js.map