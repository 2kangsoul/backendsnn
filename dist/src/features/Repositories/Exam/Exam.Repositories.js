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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamRepository = void 0;
// @ts-nocheck
const prisma_1 = __importDefault(require("../../../prisma"));
class ExamRepository {
    // ── Lecture: CRUD Exam ────────────────────────────────────────────────────
    createExam(moduleId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return yield prisma_1.default.exam.create({
                data: {
                    moduleId,
                    title: data.title,
                    description: data.description || null,
                    duration: data.duration || 60,
                    passingScore: data.passingScore || 70,
                    maxAttempts: data.maxAttempts || 1,
                    startAt: data.startAt || null,
                    endAt: data.endAt || null,
                    showResult: (_a = data.showResult) !== null && _a !== void 0 ? _a : true,
                    status: "DRAFT",
                },
            });
        });
    }
    getExamsByModuleId(moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.exam.findMany({
                where: { moduleId, deletedAt: null },
                orderBy: { createdAt: "asc" },
                include: {
                    _count: { select: { questions: true, submissions: true } },
                },
            });
        });
    }
    getExamById(examId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.exam.findUnique({
                where: { id: examId },
                include: {
                    questions: {
                        orderBy: { order: "asc" },
                        include: { options: { orderBy: { order: "asc" } } },
                    },
                    _count: { select: { submissions: true } },
                },
            });
        });
    }
    getExamForStudent(examId, enrollmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const exam = yield prisma_1.default.exam.findUnique({
                where: { id: examId, status: "PUBLISHED" },
                include: {
                    questions: {
                        orderBy: { order: "asc" },
                        include: {
                            options: {
                                orderBy: { order: "asc" },
                                select: { id: true, text: true, order: true }, // hide isCorrect
                            },
                        },
                    },
                },
            });
            if (!exam)
                return null;
            const attemptCount = yield prisma_1.default.examSubmission.count({
                where: { examId, enrollmentId },
            });
            return Object.assign(Object.assign({}, exam), { attemptCount, canAttempt: attemptCount < exam.maxAttempts });
        });
    }
    updateExam(examId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            return yield prisma_1.default.exam.update({
                where: { id: examId },
                data: {
                    title: (_a = data.title) !== null && _a !== void 0 ? _a : undefined,
                    description: (_b = data.description) !== null && _b !== void 0 ? _b : undefined,
                    status: (_c = data.status) !== null && _c !== void 0 ? _c : undefined,
                    duration: (_d = data.duration) !== null && _d !== void 0 ? _d : undefined,
                    passingScore: (_e = data.passingScore) !== null && _e !== void 0 ? _e : undefined,
                    maxAttempts: (_f = data.maxAttempts) !== null && _f !== void 0 ? _f : undefined,
                    startAt: (_g = data.startAt) !== null && _g !== void 0 ? _g : undefined,
                    endAt: (_h = data.endAt) !== null && _h !== void 0 ? _h : undefined,
                    showResult: (_j = data.showResult) !== null && _j !== void 0 ? _j : undefined,
                },
            });
        });
    }
    deleteExam(examId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.exam.update({
                where: { id: examId },
                data: { deletedAt: new Date() },
            });
        });
    }
    // ── Lecture: CRUD Questions ───────────────────────────────────────────────
    createQuestion(examId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return yield prisma_1.default.question.create({
                data: {
                    examId,
                    text: data.text,
                    type: data.type || "MULTIPLE_CHOICE",
                    points: data.points || 10,
                    order: data.order || 0,
                    explanation: data.explanation || null,
                    options: ((_a = data.options) === null || _a === void 0 ? void 0 : _a.length) ? {
                        create: data.options.map((opt, i) => ({
                            text: opt.text,
                            isCorrect: opt.isCorrect || false,
                            order: i,
                        })),
                    } : undefined,
                },
                include: { options: { orderBy: { order: "asc" } } },
            });
        });
    }
    updateQuestion(questionId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            yield prisma_1.default.question.update({
                where: { id: questionId },
                data: {
                    text: (_a = data.text) !== null && _a !== void 0 ? _a : undefined,
                    points: (_b = data.points) !== null && _b !== void 0 ? _b : undefined,
                    order: (_c = data.order) !== null && _c !== void 0 ? _c : undefined,
                    explanation: (_d = data.explanation) !== null && _d !== void 0 ? _d : undefined,
                },
            });
            if ((_e = data.options) === null || _e === void 0 ? void 0 : _e.length) {
                yield prisma_1.default.questionOption.deleteMany({ where: { questionId } });
                yield prisma_1.default.questionOption.createMany({
                    data: data.options.map((opt, i) => ({
                        questionId,
                        text: opt.text,
                        isCorrect: opt.isCorrect || false,
                        order: i,
                    })),
                });
            }
            return yield prisma_1.default.question.findUnique({
                where: { id: questionId },
                include: { options: { orderBy: { order: "asc" } } },
            });
        });
    }
    deleteQuestion(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma_1.default.questionOption.deleteMany({ where: { questionId } });
            return yield prisma_1.default.question.delete({ where: { id: questionId } });
        });
    }
    // ── Student: Submission ───────────────────────────────────────────────────
    startExam(examId, enrollmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const exam = yield prisma_1.default.exam.findUnique({
                where: { id: examId },
                select: { maxAttempts: true, status: true, startAt: true, endAt: true },
            });
            if (!exam)
                throw new Error("Ujian tidak ditemukan");
            if (exam.status !== "PUBLISHED")
                throw new Error("Ujian belum tersedia");
            const now = new Date();
            if (exam.startAt && now < new Date(exam.startAt))
                throw new Error("Ujian belum dimulai");
            if (exam.endAt && now > new Date(exam.endAt))
                throw new Error("Ujian sudah ditutup");
            const attemptCount = yield prisma_1.default.examSubmission.count({ where: { examId, enrollmentId } });
            if (attemptCount >= exam.maxAttempts)
                throw new Error(`Kamu sudah mencapai batas maksimum ${exam.maxAttempts}x percobaan`);
            return yield prisma_1.default.examSubmission.create({
                data: { examId, enrollmentId, attemptNo: attemptCount + 1, startedAt: now },
            });
        });
    }
    submitExam(submissionId, answers) {
        return __awaiter(this, void 0, void 0, function* () {
            const submission = yield prisma_1.default.examSubmission.findUnique({
                where: { id: submissionId },
                include: {
                    exam: {
                        include: { questions: { include: { options: true } } },
                    },
                },
            });
            if (!submission)
                throw new Error("Submission tidak ditemukan");
            if (submission.submittedAt)
                throw new Error("Ujian sudah di-submit");
            let totalPoints = 0;
            let earnedPoints = 0;
            const studentAnswers = [];
            for (const q of submission.exam.questions) {
                totalPoints += q.points;
                const userAnswer = answers.find((a) => a.questionId === q.id);
                if (q.type === "MULTIPLE_CHOICE" || q.type === "TRUE_FALSE") {
                    const selectedOption = q.options.find((o) => o.id === (userAnswer === null || userAnswer === void 0 ? void 0 : userAnswer.selectedOptionId));
                    const isCorrect = (selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.isCorrect) || false;
                    const pointsEarned = isCorrect ? q.points : 0;
                    earnedPoints += pointsEarned;
                    studentAnswers.push({
                        submissionId,
                        questionId: q.id,
                        selectedOptionId: (userAnswer === null || userAnswer === void 0 ? void 0 : userAnswer.selectedOptionId) || null,
                        answerText: null,
                        isCorrect,
                        pointsEarned,
                    });
                }
                else if (q.type === "ESSAY") {
                    studentAnswers.push({
                        submissionId,
                        questionId: q.id,
                        selectedOptionId: null,
                        answerText: (userAnswer === null || userAnswer === void 0 ? void 0 : userAnswer.answerText) || null,
                        isCorrect: null,
                        pointsEarned: null,
                    });
                }
            }
            yield prisma_1.default.studentAnswer.createMany({ data: studentAnswers });
            const hasEssay = submission.exam.questions.some((q) => q.type === "ESSAY");
            const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
            const isPassed = hasEssay ? null : score >= submission.exam.passingScore;
            const updated = yield prisma_1.default.examSubmission.update({
                where: { id: submissionId },
                data: {
                    submittedAt: new Date(),
                    score: hasEssay ? null : score,
                    isPassed,
                    gradedAt: hasEssay ? null : new Date(),
                },
                include: {
                    answers: {
                        include: {
                            question: { select: { text: true, type: true, points: true, explanation: true } },
                            selectedOption: { select: { text: true, isCorrect: true } },
                        },
                    },
                },
            });
            return { submission: updated, score, isPassed, hasEssay };
        });
    }
    getSubmissionsByEnrollment(enrollmentId, examId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.examSubmission.findMany({
                where: Object.assign({ enrollmentId }, (examId ? { examId } : {})),
                orderBy: { createdAt: "desc" },
                include: {
                    exam: { select: { id: true, title: true, passingScore: true, showResult: true } },
                    answers: {
                        include: {
                            question: { select: { text: true, type: true, points: true, explanation: true } },
                            selectedOption: { select: { text: true, isCorrect: true } },
                        },
                    },
                },
            });
        });
    }
    gradeEssay(submissionId, grades) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const grade of grades) {
                yield prisma_1.default.studentAnswer.update({
                    where: { id: grade.answerId },
                    data: { pointsEarned: grade.pointsEarned, isCorrect: grade.isCorrect },
                });
            }
            const answers = yield prisma_1.default.studentAnswer.findMany({ where: { submissionId } });
            const submission = yield prisma_1.default.examSubmission.findUnique({
                where: { id: submissionId },
                include: { exam: { select: { passingScore: true, questions: { select: { points: true } } } } },
            });
            const totalPoints = submission.exam.questions.reduce((s, q) => s + q.points, 0);
            const earnedPoints = answers.reduce((s, a) => s + (a.pointsEarned || 0), 0);
            const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
            const isPassed = score >= submission.exam.passingScore;
            return yield prisma_1.default.examSubmission.update({
                where: { id: submissionId },
                data: { score, isPassed, gradedAt: new Date() },
            });
        });
    }
    getSubmissionsByExam(examId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.examSubmission.findMany({
                where: { examId },
                orderBy: { createdAt: "desc" },
                include: {
                    enrollment: {
                        include: {
                            student: {
                                include: { user: { select: { id: true, fullName: true, email: true } } },
                            },
                        },
                    },
                },
            });
        });
    }
    // ── BARU: Get submission by id ────────────────────────────────────────────
    getSubmissionById(submissionId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.examSubmission.findUnique({
                where: { id: submissionId },
                include: {
                    exam: { select: { id: true, title: true, passingScore: true, showResult: true } },
                    answers: {
                        include: {
                            question: { select: { text: true, type: true, points: true, explanation: true } },
                            selectedOption: { select: { text: true, isCorrect: true } },
                        },
                    },
                },
            });
        });
    }
}
exports.ExamRepository = ExamRepository;
//# sourceMappingURL=Exam.Repositories.js.map