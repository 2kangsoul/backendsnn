import { Request, Response } from "express";
import { AnalyticService } from "../../Services/SiteAnalytics/siteAnalytics.Services";

export class AnalyticController {
  private analyticService = new AnalyticService();

  getPageviews = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.analyticService.getPageviewsDashboardData();
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error getPageviews:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  // ✅ Tambahan baru
  getTotalSessions = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.analyticService.getTotalSessionsData();
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error getTotalSessions:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
}