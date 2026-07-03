// @ts-nocheck
import { Request, Response } from "express";
import { ExamService } from "../../Services/Exam/Exam.Services";

export class ExamController {
  private service = new ExamService();

  // ── Lecture ───────────────────────────────────────────────────────────────
  createExam = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.createExam(req.params.id, req.body);
      res.status(201).json({ success: true, data });
    } catch (e: any) { res.status(400).json({ success: false, message: e.message }); }
  };

  getExamsByModule = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.getExamsByModuleId(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
  };

  getExamById = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.getExamById(req.params.id);
      if (!data) { res.status(404).json({ success: false, message: "Ujian tidak ditemukan" }); return; }
      res.status(200).json({ success: true, data });
    } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
  };

  updateExam = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.updateExam(req.params.id, req.body);
      res.status(200).json({ success: true, data });
    } catch (e: any) { res.status(400).json({ success: false, message: e.message }); }
  };

  deleteExam = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.service.deleteExam(req.params.id);
      res.status(200).json({ success: true, message: "Ujian dihapus" });
    } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
  };

  createQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.createQuestion(req.params.id, req.body);
      res.status(201).json({ success: true, data });
    } catch (e: any) { res.status(400).json({ success: false, message: e.message }); }
  };

  updateQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.updateQuestion(req.params.id, req.body);
      res.status(200).json({ success: true, data });
    } catch (e: any) { res.status(400).json({ success: false, message: e.message }); }
  };

  deleteQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.service.deleteQuestion(req.params.id);
      res.status(200).json({ success: true, message: "Soal dihapus" });
    } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
  };

  getSubmissionsByExam = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.getSubmissionsByExam(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
  };

  gradeEssay = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.gradeEssay(req.params.id, req.body.grades);
      res.status(200).json({ success: true, data });
    } catch (e: any) { res.status(400).json({ success: false, message: e.message }); }
  };

  // ── Student ───────────────────────────────────────────────────────────────
  getExamForStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { enrollmentId } = req.query;
      if (!enrollmentId) { res.status(400).json({ success: false, message: "enrollmentId wajib" }); return; }
      const data = await this.service.getExamForStudent(req.params.id, String(enrollmentId));
      if (!data) { res.status(404).json({ success: false, message: "Ujian tidak ditemukan atau belum tersedia" }); return; }
      res.status(200).json({ success: true, data });
    } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
  };

  startExam = async (req: Request, res: Response): Promise<void> => {
    try {
      const { enrollmentId } = req.body;
      if (!enrollmentId) { res.status(400).json({ success: false, message: "enrollmentId wajib" }); return; }
      const data = await this.service.startExam(req.params.id, enrollmentId);
      res.status(201).json({ success: true, data });
    } catch (e: any) { res.status(400).json({ success: false, message: e.message }); }
  };

  submitExam = async (req: Request, res: Response): Promise<void> => {
    try {
      const { answers } = req.body;
      if (!answers?.length) { res.status(400).json({ success: false, message: "Jawaban wajib diisi" }); return; }
      const data = await this.service.submitExam(req.params.id, answers);
      res.status(200).json({ success: true, data });
    } catch (e: any) { res.status(400).json({ success: false, message: e.message }); }
  };

  getMySubmissions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { enrollmentId, examId } = req.query;
      if (!enrollmentId) { res.status(400).json({ success: false, message: "enrollmentId wajib" }); return; }
      const data = await this.service.getSubmissionsByEnrollment(String(enrollmentId), examId ? String(examId) : undefined);
      res.status(200).json({ success: true, data });
    } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
  };

  // ── BARU: Get submission by id ────────────────────────────────────────────
  getSubmissionById = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.getSubmissionById(req.params.id);
      if (!data) { res.status(404).json({ success: false, message: "Submission tidak ditemukan" }); return; }
      res.status(200).json({ success: true, data });
    } catch (e: any) { res.status(500).json({ success: false, message: e.message }); }
  };
}
