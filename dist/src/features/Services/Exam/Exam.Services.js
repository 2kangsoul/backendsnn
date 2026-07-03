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
exports.ExamService = void 0;
// @ts-nocheck
const Exam_Repositories_1 = require("../../Repositories/Exam/Exam.Repositories");
class ExamService {
    constructor() {
        this.repo = new Exam_Repositories_1.ExamRepository();
    }
    createExam(moduleId, data) {
        return __awaiter(this, void 0, void 0, function* () { return yield this.repo.createExam(moduleId, data); });
    }
    getExamsByModuleId(moduleId) {
        return __awaiter(this, void 0, void 0, function* () { return yield this.repo.getExamsByModuleId(moduleId); });
    }
    getExamById(examId) {
        return __awaiter(this, void 0, void 0, function* () { return yield this.repo.getExamById(examId); });
    }
    getExamForStudent(examId, enrollmentId) {
        return __awaiter(this, void 0, void 0, function* () { return yield this.repo.getExamForStudent(examId, enrollmentId); });
    }
    updateExam(examId, data) {
        return __awaiter(this, void 0, void 0, function* () { return yield this.repo.updateExam(examId, data); });
    }
    deleteExam(examId) {
        return __awaiter(this, void 0, void 0, function* () { return yield this.repo.deleteExam(examId); });
    }
    createQuestion(examId, data) {
        return __awaiter(this, void 0, void 0, function* () { return yield this.repo.createQuestion(examId, data); });
    }
    updateQuestion(questionId, data) {
        return __awaiter(this, void 0, void 0, function* () { return yield this.repo.updateQuestion(questionId, data); });
    }
    deleteQuestion(questionId) {
        return __awaiter(this, void 0, void 0, function* () { return yield this.repo.deleteQuestion(questionId); });
    }
    startExam(examId, enrollmentId) {
        return __awaiter(this, void 0, void 0, function* () { return yield this.repo.startExam(examId, enrollmentId); });
    }
    submitExam(submissionId, answers) {
        return __awaiter(this, void 0, void 0, function* () { return yield this.repo.submitExam(submissionId, answers); });
    }
    getSubmissionsByEnrollment(enrollmentId, examId) {
        return __awaiter(this, void 0, void 0, function* () { return yield this.repo.getSubmissionsByEnrollment(enrollmentId, examId); });
    }
    gradeEssay(submissionId, grades) {
        return __awaiter(this, void 0, void 0, function* () { return yield this.repo.gradeEssay(submissionId, grades); });
    }
    getSubmissionsByExam(examId) {
        return __awaiter(this, void 0, void 0, function* () { return yield this.repo.getSubmissionsByExam(examId); });
    }
    // BARU
    getSubmissionById(submissionId) {
        return __awaiter(this, void 0, void 0, function* () { return yield this.repo.getSubmissionById(submissionId); });
    }
}
exports.ExamService = ExamService;
//# sourceMappingURL=Exam.Services.js.map