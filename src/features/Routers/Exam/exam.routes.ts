// @ts-nocheck
import { Router } from "express";
import { ExamController } from "../../Controller/Exam/Exam.Controller";
import { verifyToken } from "../../../Middleware/verifyToken";

const ctrl = new ExamController();

// ── Module-scoped routes (prefix: /api/modules) ──────────────────────────────
export const moduleExamRouter = Router();
moduleExamRouter.post("/:id/exams", verifyToken, ctrl.createExam);
moduleExamRouter.get("/:id/exams", verifyToken, ctrl.getExamsByModule);

// ── Exam routes (prefix: /api/exams) ─────────────────────────────────────────
export const examRouter = Router();
examRouter.get("/:id",             verifyToken, ctrl.getExamById);
examRouter.put("/:id",             verifyToken, ctrl.updateExam);
examRouter.delete("/:id",          verifyToken, ctrl.deleteExam);
examRouter.post("/:id/questions",  verifyToken, ctrl.createQuestion);
examRouter.get("/:id/student",     verifyToken, ctrl.getExamForStudent);
examRouter.post("/:id/start",      verifyToken, ctrl.startExam);
examRouter.get("/:id/submissions", verifyToken, ctrl.getSubmissionsByExam);

// ── Question routes (prefix: /api/questions) ─────────────────────────────────
export const questionRouter = Router();
questionRouter.put("/:id",    verifyToken, ctrl.updateQuestion);
questionRouter.delete("/:id", verifyToken, ctrl.deleteQuestion);

// ── Submission routes (prefix: /api/submissions) ─────────────────────────────
export const submissionRouter = Router();
submissionRouter.get("/",              verifyToken, ctrl.getMySubmissions);
submissionRouter.get("/:id",           verifyToken, ctrl.getSubmissionById);   // ← BARU
submissionRouter.post("/:id/submit",   verifyToken, ctrl.submitExam);
submissionRouter.put("/:id/grade",     verifyToken, ctrl.gradeEssay);

export default examRouter;
