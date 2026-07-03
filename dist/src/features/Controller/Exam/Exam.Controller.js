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
exports.ExamController = void 0;
const Exam_Services_1 = require("../../Services/Exam/Exam.Services");
class ExamController {
    constructor() {
        this.service = new Exam_Services_1.ExamService();
        // ── Lecture ───────────────────────────────────────────────────────────────
        this.createExam = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.service.createExam(req.params.id, req.body);
                res.status(201).json({ success: true, data });
            }
            catch (e) {
                res.status(400).json({ success: false, message: e.message });
            }
        });
        this.getExamsByModule = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.service.getExamsByModuleId(req.params.id);
                res.status(200).json({ success: true, data });
            }
            catch (e) {
                res.status(500).json({ success: false, message: e.message });
            }
        });
        this.getExamById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.service.getExamById(req.params.id);
                if (!data) {
                    res.status(404).json({ success: false, message: "Ujian tidak ditemukan" });
                    return;
                }
                res.status(200).json({ success: true, data });
            }
            catch (e) {
                res.status(500).json({ success: false, message: e.message });
            }
        });
        this.updateExam = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.service.updateExam(req.params.id, req.body);
                res.status(200).json({ success: true, data });
            }
            catch (e) {
                res.status(400).json({ success: false, message: e.message });
            }
        });
        this.deleteExam = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.service.deleteExam(req.params.id);
                res.status(200).json({ success: true, message: "Ujian dihapus" });
            }
            catch (e) {
                res.status(500).json({ success: false, message: e.message });
            }
        });
        this.createQuestion = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.service.createQuestion(req.params.id, req.body);
                res.status(201).json({ success: true, data });
            }
            catch (e) {
                res.status(400).json({ success: false, message: e.message });
            }
        });
        this.updateQuestion = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.service.updateQuestion(req.params.id, req.body);
                res.status(200).json({ success: true, data });
            }
            catch (e) {
                res.status(400).json({ success: false, message: e.message });
            }
        });
        this.deleteQuestion = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.service.deleteQuestion(req.params.id);
                res.status(200).json({ success: true, message: "Soal dihapus" });
            }
            catch (e) {
                res.status(500).json({ success: false, message: e.message });
            }
        });
        this.getSubmissionsByExam = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.service.getSubmissionsByExam(req.params.id);
                res.status(200).json({ success: true, data });
            }
            catch (e) {
                res.status(500).json({ success: false, message: e.message });
            }
        });
        this.gradeEssay = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.service.gradeEssay(req.params.id, req.body.grades);
                res.status(200).json({ success: true, data });
            }
            catch (e) {
                res.status(400).json({ success: false, message: e.message });
            }
        });
        // ── Student ───────────────────────────────────────────────────────────────
        this.getExamForStudent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { enrollmentId } = req.query;
                if (!enrollmentId) {
                    res.status(400).json({ success: false, message: "enrollmentId wajib" });
                    return;
                }
                const data = yield this.service.getExamForStudent(req.params.id, String(enrollmentId));
                if (!data) {
                    res.status(404).json({ success: false, message: "Ujian tidak ditemukan atau belum tersedia" });
                    return;
                }
                res.status(200).json({ success: true, data });
            }
            catch (e) {
                res.status(500).json({ success: false, message: e.message });
            }
        });
        this.startExam = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { enrollmentId } = req.body;
                if (!enrollmentId) {
                    res.status(400).json({ success: false, message: "enrollmentId wajib" });
                    return;
                }
                const data = yield this.service.startExam(req.params.id, enrollmentId);
                res.status(201).json({ success: true, data });
            }
            catch (e) {
                res.status(400).json({ success: false, message: e.message });
            }
        });
        this.submitExam = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { answers } = req.body;
                if (!(answers === null || answers === void 0 ? void 0 : answers.length)) {
                    res.status(400).json({ success: false, message: "Jawaban wajib diisi" });
                    return;
                }
                const data = yield this.service.submitExam(req.params.id, answers);
                res.status(200).json({ success: true, data });
            }
            catch (e) {
                res.status(400).json({ success: false, message: e.message });
            }
        });
        this.getMySubmissions = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { enrollmentId, examId } = req.query;
                if (!enrollmentId) {
                    res.status(400).json({ success: false, message: "enrollmentId wajib" });
                    return;
                }
                const data = yield this.service.getSubmissionsByEnrollment(String(enrollmentId), examId ? String(examId) : undefined);
                res.status(200).json({ success: true, data });
            }
            catch (e) {
                res.status(500).json({ success: false, message: e.message });
            }
        });
        // ── BARU: Get submission by id ────────────────────────────────────────────
        this.getSubmissionById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.service.getSubmissionById(req.params.id);
                if (!data) {
                    res.status(404).json({ success: false, message: "Submission tidak ditemukan" });
                    return;
                }
                res.status(200).json({ success: true, data });
            }
            catch (e) {
                res.status(500).json({ success: false, message: e.message });
            }
        });
    }
}
exports.ExamController = ExamController;
//# sourceMappingURL=Exam.Controller.js.map