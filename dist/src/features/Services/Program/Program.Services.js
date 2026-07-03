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
exports.ProgramService = void 0;
const Program_Repositories_1 = require("./../../Repositories/Program/Program.Repositories");
class ProgramService {
    constructor() {
        this.programRepository = new Program_Repositories_1.ProgramRepository();
    }
    getAllPrograms() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.programRepository.getAllPrograms();
        });
    }
    getProgramBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.programRepository.getProgramBySlug(slug);
        });
    }
    getProgramById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.programRepository.getProgramById(id);
        });
    }
    getModulesByProgramId(programId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.programRepository.getModulesByProgramId(programId);
        });
    }
    getProgramsByLevel(level) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.programRepository.getProgramsByLevel(level);
        });
    }
    updateProgram(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.programRepository.updateProgram(id, data);
        });
    }
    getEnrollmentsByProgramId(programId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.programRepository.getEnrollmentsByProgramId(programId);
        });
    }
    // ← tambah ini
    enrollStudent(programId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.programRepository.enrollStudent(programId, studentId);
        });
    }
    dropStudent(programId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.programRepository.dropStudent(programId, studentId);
        });
    }
}
exports.ProgramService = ProgramService;
//# sourceMappingURL=Program.Services.js.map