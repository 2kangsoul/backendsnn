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
exports.ModuleSessionService = void 0;
// @ts-nocheck
const ModuleSession_Repositories_1 = require("../../Repositories/ModuleSession/ModuleSession.Repositories");
class ModuleSessionService {
    constructor() {
        this.repo = new ModuleSession_Repositories_1.ModuleSessionRepository();
    }
    generateSessions(moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.generateSessions(moduleId);
        });
    }
    getSessionsByModuleId(moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.getSessionsByModuleId(moduleId);
        });
    }
    getSessionById(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.getSessionById(sessionId);
        });
    }
    cancelSession(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.cancelSession(sessionId);
        });
    }
    restoreSession(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.restoreSession(sessionId);
        });
    }
    upsertSessionAttendance(sessionId, enrollmentId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.upsertSessionAttendance(sessionId, enrollmentId, data);
        });
    }
    markPresent(sessionId, enrollmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repo.markPresent(sessionId, enrollmentId);
        });
    }
}
exports.ModuleSessionService = ModuleSessionService;
//# sourceMappingURL=ModuleSession.Services.js.map