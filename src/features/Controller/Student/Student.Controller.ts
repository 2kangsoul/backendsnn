// @ts-nocheck
import { Request, Response } from "express";
import { StudentService } from "../../Services/Student/Student.Services";

export class StudentController {
  private studentService = new StudentService();

  getAllStudents = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.studentService.getAllStudents();
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  getStudentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.studentService.getStudentById(req.params.id);
      if (!data) {
        res.status(404).json({ success: false, message: "Student not found" });
        return;
      }
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  getStudentByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.studentService.getStudentByUserId(req.params.userId);
      if (!data) {
        res.status(404).json({ success: false, message: "Student not found" });
        return;
      }
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  getStudentsNotEnrolled = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.studentService.getStudentsNotEnrolled(req.params.programId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  createStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, bio, studentCode } = req.body;
      if (!userId) {
        res.status(400).json({ success: false, message: "userId wajib diisi" });
        return;
      }
      const data = await this.studentService.createStudent(userId, { bio, studentCode });
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || "Gagal membuat student profile" });
    }
  };

  deleteStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.studentService.deleteStudent(req.params.id);
      res.status(200).json({ success: true, message: "Student profile berhasil dihapus" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message || "Gagal menghapus student profile" });
    }
  };

  getEnrollmentsByStudentId = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.studentService.getEnrollmentsByStudentId(req.params.id);
      res.status(200).json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
}
