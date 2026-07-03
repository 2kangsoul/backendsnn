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
exports.StudentController = void 0;
const Student_Services_1 = require("../../Services/Student/Student.Services");
class StudentController {
    constructor() {
        this.studentService = new Student_Services_1.StudentService();
        this.getAllStudents = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.studentService.getAllStudents();
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        this.getStudentById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.studentService.getStudentById(req.params.id);
                if (!data) {
                    res.status(404).json({ success: false, message: "Student not found" });
                    return;
                }
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        this.getStudentByUserId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.studentService.getStudentByUserId(req.params.userId);
                if (!data) {
                    res.status(404).json({ success: false, message: "Student not found" });
                    return;
                }
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        this.getStudentsNotEnrolled = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.studentService.getStudentsNotEnrolled(req.params.programId);
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        this.createStudent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, bio, studentCode } = req.body;
                if (!userId) {
                    res.status(400).json({ success: false, message: "userId wajib diisi" });
                    return;
                }
                const data = yield this.studentService.createStudent(userId, { bio, studentCode });
                res.status(201).json({ success: true, data });
            }
            catch (error) {
                res.status(400).json({ success: false, message: error.message || "Gagal membuat student profile" });
            }
        });
        this.deleteStudent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.studentService.deleteStudent(req.params.id);
                res.status(200).json({ success: true, message: "Student profile berhasil dihapus" });
            }
            catch (error) {
                res.status(400).json({ success: false, message: error.message || "Gagal menghapus student profile" });
            }
        });
        this.getEnrollmentsByStudentId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.studentService.getEnrollmentsByStudentId(req.params.id);
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
}
exports.StudentController = StudentController;
//# sourceMappingURL=Student.Controller.js.map