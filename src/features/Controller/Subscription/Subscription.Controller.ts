import { Request, Response } from "express";
import { SubscriptionService } from "../../Services/Subscription/Subscription.Services";

export class SubscriptionController {
  private subscriptionService = new SubscriptionService();

  getSubscriptionData = async (req: Request, res: Response): Promise<void> => {
    try {
      const data =
        await this.subscriptionService.getSubscriptionDashboardData();
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error getSubscriptionData:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };

  // ✅ Tambahan baru
  createSubscription = async (req: Request, res: Response): Promise<void> => {
    try {
      const { plan, status, userId, expiredAt } = req.body;
      const data = await this.subscriptionService.createSubscription({
        plan,
        status,
        userId,
        expiredAt: expiredAt ? new Date(expiredAt) : null,
      });
      res.status(201).json({ success: true, data });
    } catch (error) {
      console.error("Error createSubscription:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };
}