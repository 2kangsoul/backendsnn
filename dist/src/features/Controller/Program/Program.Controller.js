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
exports.ProgramController = void 0;
const Program_Services_1 = require("../../Services/Program/Program.Services");
class ProgramController {
    constructor() {
        this.programService = new Program_Services_1.ProgramService();
        this.getAllPrograms = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.programService.getAllPrograms();
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error getAllPrograms:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        this.getProgramBySlug = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const slug = req.params.slug;
                const data = yield this.programService.getProgramBySlug(slug);
                if (!data) {
                    res.status(404).json({ success: false, message: "Program not found" });
                    return;
                }
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error getProgramBySlug:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        this.getProgramById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const data = yield this.programService.getProgramById(id);
                if (!data) {
                    res.status(404).json({ success: false, message: "Program not found" });
                    return;
                }
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error getProgramById:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        this.getModulesByProgramId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const programId = req.params.id;
                const data = yield this.programService.getModulesByProgramId(programId);
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error getModulesByProgramId:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        this.getProgramsByLevel = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const level = req.params.level;
                const data = yield this.programService.getProgramsByLevel(level);
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error getProgramsByLevel:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        this.updateProgram = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const data = yield this.programService.updateProgram(id, req.body);
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error updateProgram:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        this.getEnrollmentsByProgramId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const programId = req.params.id;
                const data = yield this.programService.getEnrollmentsByProgramId(programId);
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error getEnrollmentsByProgramId:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        // ← tambah ini
        this.enrollStudent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const programId = req.params.id;
                const { studentId } = req.body;
                if (!studentId) {
                    res.status(400).json({ success: false, message: "studentId wajib diisi" });
                    return;
                }
                const data = yield this.programService.enrollStudent(programId, studentId);
                res.status(201).json({ success: true, data });
            }
            catch (error) {
                console.error("Error enrollStudent:", error);
                res.status(400).json({ success: false, message: error.message || "Internal server error" });
            }
        });
        this.dropStudent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const programId = req.params.id;
                const { studentId } = req.body;
                if (!studentId) {
                    res.status(400).json({ success: false, message: "studentId wajib diisi" });
                    return;
                }
                const data = yield this.programService.dropStudent(programId, studentId);
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error dropStudent:", error);
                res.status(400).json({ success: false, message: error.message || "Internal server error" });
            }
        });
    }
}
exports.ProgramController = ProgramController;
//# sourceMappingURL=Program.Controller.js.map