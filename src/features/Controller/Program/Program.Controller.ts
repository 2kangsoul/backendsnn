import { Request, Response } from "express";
import { ProgramService } from "../../Services/Program/Program.Services";

export class ProgramController {
  private programService = new ProgramService();

  getAllPrograms = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.programService.getAllPrograms();
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error getAllPrograms:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  getProgramBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const slug = req.params.slug as string;
      const data = await this.programService.getProgramBySlug(slug);
      if (!data) {
        res.status(404).json({ success: false, message: "Program not found" });
        return;
      }
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error getProgramBySlug:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  getProgramById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const data = await this.programService.getProgramById(id);
      if (!data) {
        res.status(404).json({ success: false, message: "Program not found" });
        return;
      }
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error getProgramById:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  getModulesByProgramId = async (req: Request, res: Response): Promise<void> => {
    try {
      const programId = req.params.id as string;
      const data = await this.programService.getModulesByProgramId(programId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error getModulesByProgramId:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  getProgramsByLevel = async (req: Request, res: Response): Promise<void> => {
    try {
      const level = req.params.level as "BEGINNER" | "ADVANCED" | "EXPERT";
      const data = await this.programService.getProgramsByLevel(level);
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error getProgramsByLevel:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  updateProgram = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const data = await this.programService.updateProgram(id, req.body);
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error updateProgram:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  getEnrollmentsByProgramId = async (req: Request, res: Response): Promise<void> => {
    try {
      const programId = req.params.id as string;
      const data = await this.programService.getEnrollmentsByProgramId(programId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error getEnrollmentsByProgramId:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  // ← tambah ini
  enrollStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      const programId = req.params.id as string;
      const { studentId } = req.body;
      if (!studentId) {
        res.status(400).json({ success: false, message: "studentId wajib diisi" });
        return;
      }
      const data = await this.programService.enrollStudent(programId, studentId);
      res.status(201).json({ success: true, data });
    } catch (error: any) {
      console.error("Error enrollStudent:", error);
      res.status(400).json({ success: false, message: error.message || "Internal server error" });
    }
  };

  dropStudent = async (req: Request, res: Response): Promise<void> => {
    try {
      const programId = req.params.id as string;
      const { studentId } = req.body;
      if (!studentId) {
        res.status(400).json({ success: false, message: "studentId wajib diisi" });
        return;
      }
      const data = await this.programService.dropStudent(programId, studentId);
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error("Error dropStudent:", error);
      res.status(400).json({ success: false, message: error.message || "Internal server error" });
    }
  };
}