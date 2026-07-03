import { Request, Response } from "express";
import { PerfumeService } from "../../Services/Perfume/Perfume.Services";

export class PerfumeController {
  private perfumeService = new PerfumeService();

  getAllPerfumes = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.perfumeService.getAllPerfumes();
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error getAllPerfumes:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  getTop10ByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = req.params.category as string;
      const data = await this.perfumeService.getTop10ByCategory(category);
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error getTop10ByCategory:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  getAllCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.perfumeService.getAllCategories();
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error getAllCategories:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  getPerfumeById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const data = await this.perfumeService.getPerfumeById(id);
      if (!data) {
        res.status(404).json({ success: false, message: "Perfume not found" });
        return;
      }
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error getPerfumeById:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  // ✅ FUNGSI BARU DITAMBAHKAN DI SINI
  getPerfumesByNote = async (req: Request, res: Response): Promise<void> => {
    try {
      const slug = req.params.slug as string;
      const data = await this.perfumeService.getPerfumesByNote(slug);
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error getPerfumesByNote:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  createPerfume = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.perfumeService.createPerfume(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      console.error("Error createPerfume:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  likePerfume = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const data = await this.perfumeService.likePerfume(id, userId);
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error likePerfume:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  checkUserLike = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const liked = await this.perfumeService.checkUserLike(id, userId);
      res.status(200).json({ success: true, data: { liked } });
    } catch (error) {
      console.error("Error checkUserLike:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  deletePerfume = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.id as string;
      await this.perfumeService.deletePerfume(id);
      res.status(200).json({ success: true, message: "Perfume deleted" });
    } catch (error) {
      console.error("Error deletePerfume:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
}