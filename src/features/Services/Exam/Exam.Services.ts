// @ts-nocheck
import { ExamRepository } from "../../Repositories/Exam/Exam.Repositories";

export class ExamService {
  private repo = new ExamRepository();

  async createExam(moduleId: string, data: any)                  { return await this.repo.createExam(moduleId, data); }
  async getExamsByModuleId(moduleId: string)                     { return await this.repo.getExamsByModuleId(moduleId); }
  async getExamById(examId: string)                              { return await this.repo.getExamById(examId); }
  async getExamForStudent(examId: string, enrollmentId: string)  { return await this.repo.getExamForStudent(examId, enrollmentId); }
  async updateExam(examId: string, data: any)                    { return await this.repo.updateExam(examId, data); }
  async deleteExam(examId: string)                               { return await this.repo.deleteExam(examId); }
  async createQuestion(examId: string, data: any)                { return await this.repo.createQuestion(examId, data); }
  async updateQuestion(questionId: string, data: any)            { return await this.repo.updateQuestion(questionId, data); }
  async deleteQuestion(questionId: string)                       { return await this.repo.deleteQuestion(questionId); }
  async startExam(examId: string, enrollmentId: string)          { return await this.repo.startExam(examId, enrollmentId); }
  async submitExam(submissionId: string, answers: any[])         { return await this.repo.submitExam(submissionId, answers); }
  async getSubmissionsByEnrollment(enrollmentId: string, examId?: string) { return await this.repo.getSubmissionsByEnrollment(enrollmentId, examId); }
  async gradeEssay(submissionId: string, grades: any[])          { return await this.repo.gradeEssay(submissionId, grades); }
  async getSubmissionsByExam(examId: string)                     { return await this.repo.getSubmissionsByExam(examId); }
  // BARU
  async getSubmissionById(submissionId: string)                  { return await this.repo.getSubmissionById(submissionId); }
}
