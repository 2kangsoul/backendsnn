import { Request, Response } from "express";
import { LectureService } from "../../Services/Lecture/Lecture.Services";

export class LectureController {
  private lectureService = new LectureService();

  getAllLectures = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.lectureService.getAllLectures();
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error getAllLectures:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  getLectureById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const data = await this.lectureService.getLectureById(id);
      if (!data) {
        res.status(404).json({ success: false, message: "Lecture profile not found" });
        return;
      }
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error getLectureById:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  getLectureByUserId = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.params.userId as string;
      const data = await this.lectureService.getLectureByUserId(userId);
      if (!data) {
        res.status(404).json({ success: false, message: "Lecture profile not found" });
        return;
      }
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error getLectureByUserId:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  // Lecture bisa lihat profil sendiri
  getMyProfile = async (req: any, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const data = await this.lectureService.getLectureByUserId(userId);
      if (!data) {
        res.status(404).json({ success: false, message: "Lecture profile not found" });
        return;
      }
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error getMyProfile:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  createLecture = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, lectureCode, bio, specialization } = req.body;
    if (!userId) {
      res.status(400).json({ success: false, message: "userId wajib diisi" });
      return;
    }

    // Cek apakah sudah ada (termasuk soft deleted)
    const existing = await this.lectureService.getLectureByUserIdIncludeDeleted(userId);
    if (existing) {
      // Restore + update
      const data = await this.lectureService.updateLecture(existing.id, {
        lectureCode,
        bio,
        specialization,
        deletedAt: null, // restore
      });
      res.status(200).json({ success: true, data });
      return;
    }

    const data = await this.lectureService.createLecture({ userId, lectureCode, bio, specialization });
    res.status(201).json({ success: true, data });
  } catch (error: any) {
    console.error("Error createLecture:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

  updateLecture = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const { lectureCode, bio, specialization } = req.body;
      const data = await this.lectureService.updateLecture(id, {
        lectureCode,
        bio,
        specialization,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error updateLecture:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  // Lecture update profil sendiri
  updateMyProfile = async (req: any, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const existing = await this.lectureService.getLectureByUserId(userId);
      if (!existing) {
        res.status(404).json({ success: false, message: "Lecture profile not found" });
        return;
      }
      const { lectureCode, bio, specialization } = req.body;
      const data = await this.lectureService.updateLecture(existing.id, {
        lectureCode,
        bio,
        specialization,
      });
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error updateMyProfile:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  deleteLecture = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.lectureService.deleteLecture(id);
      res.status(200).json({ success: true, message: "Lecture profile deleted" });
    } catch (error) {
      console.error("Error deleteLecture:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
}