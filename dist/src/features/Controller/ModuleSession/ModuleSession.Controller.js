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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleSessionController = void 0;
const ModuleSession_Services_1 = require("../../Services/ModuleSession/ModuleSession.Services");
class ModuleSessionController {
    constructor() {
        this.service = new ModuleSession_Services_1.ModuleSessionService();
        // POST /api/modules/:id/sessions/generate
        this.generateSessions = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const moduleId = req.params.id;
                const result = yield this.service.generateSessions(moduleId);
                res.status(201).json({
                    success: true,
                    message: `${result.created} sesi berhasil digenerate`,
                    data: result,
                });
            }
            catch (error) {
                console.error("Error generateSessions:", error);
                res
                    .status(400)
                    .json({
                    success: false,
                    message: error.message || "Internal server error",
                });
            }
        });
        // GET /api/modules/:id/sessions
        this.getSessionsByModuleId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const moduleId = req.params.id;
                const data = yield this.service.getSessionsByModuleId(moduleId);
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error getSessionsByModuleId:", error);
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
            }
        });
        // GET /api/sessions/:id
        this.getSessionById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const sessionId = req.params.id;
                const data = yield this.service.getSessionById(sessionId);
                if (!data) {
                    res
                        .status(404)
                        .json({ success: false, message: "Sesi tidak ditemukan" });
                    return;
                }
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error getSessionById:", error);
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
            }
        });
        // PUT /api/sessions/:id/cancel
        this.cancelSession = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const sessionId = req.params.id;
                const data = yield this.service.cancelSession(sessionId);
                res.status(200).json({ success: true, message: "Sesi dibatalkan", data });
            }
            catch (error) {
                console.error("Error cancelSession:", error);
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
            }
        });
        // PUT /api/sessions/:id/restore
        this.restoreSession = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const sessionId = req.params.id;
                const data = yield this.service.restoreSession(sessionId);
                res.status(200).json({ success: true, message: "Sesi dipulihkan", data });
            }
            catch (error) {
                console.error("Error restoreSession:", error);
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
            }
        });
        // PUT /api/sessions/:id/attendance
        this.markPresent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const sessionId = req.params.id;
                const { enrollmentId } = req.body;
                if (!enrollmentId) {
                    res
                        .status(400)
                        .json({ success: false, message: "enrollmentId wajib diisi" });
                    return;
                }
                const data = yield this.service.markPresent(sessionId, enrollmentId);
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error markPresent:", error);
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
            }
        });
    }
}
exports.ModuleSessionController = ModuleSessionController;
//# sourceMappingURL=ModuleSession.Controller.js.map