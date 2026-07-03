"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submissionRouter = exports.questionRouter = exports.examRouter = exports.moduleExamRouter = void 0;
// @ts-nocheck
const express_1 = require("express");
const Exam_Controller_1 = require("../../Controller/Exam/Exam.Controller");
const verifyToken_1 = require("../../../Middleware/verifyToken");
const ctrl = new Exam_Controller_1.ExamController();
// ── Module-scoped routes (prefix: /api/modules) ──────────────────────────────
exports.moduleExamRouter = (0, express_1.Router)();
exports.moduleExamRouter.post("/:id/exams", verifyToken_1.verifyToken, ctrl.createExam);
exports.moduleExamRouter.get("/:id/exams", verifyToken_1.verifyToken, ctrl.getExamsByModule);
// ── Exam routes (prefix: /api/exams) ─────────────────────────────────────────
exports.examRouter = (0, express_1.Router)();
exports.examRouter.get("/:id", verifyToken_1.verifyToken, ctrl.getExamById);
exports.examRouter.put("/:id", verifyToken_1.verifyToken, ctrl.updateExam);
exports.examRouter.delete("/:id", verifyToken_1.verifyToken, ctrl.deleteExam);
exports.examRouter.post("/:id/questions", verifyToken_1.verifyToken, ctrl.createQuestion);
exports.examRouter.get("/:id/student", verifyToken_1.verifyToken, ctrl.getExamForStudent);
exports.examRouter.post("/:id/start", verifyToken_1.verifyToken, ctrl.startExam);
exports.examRouter.get("/:id/submissions", verifyToken_1.verifyToken, ctrl.getSubmissionsByExam);
// ── Question routes (prefix: /api/questions) ─────────────────────────────────
exports.questionRouter = (0, express_1.Router)();
exports.questionRouter.put("/:id", verifyToken_1.verifyToken, ctrl.updateQuestion);
exports.questionRouter.delete("/:id", verifyToken_1.verifyToken, ctrl.deleteQuestion);
// ── Submission routes (prefix: /api/submissions) ─────────────────────────────
exports.submissionRouter = (0, express_1.Router)();
exports.submissionRouter.get("/", verifyToken_1.verifyToken, ctrl.getMySubmissions);
exports.submissionRouter.get("/:id", verifyToken_1.verifyToken, ctrl.getSubmissionById); // ← BARU
exports.submissionRouter.post("/:id/submit", verifyToken_1.verifyToken, ctrl.submitExam);
exports.submissionRouter.put("/:id/grade", verifyToken_1.verifyToken, ctrl.gradeEssay);
exports.default = exports.examRouter;
//# sourceMappingURL=exam.routes.js.map