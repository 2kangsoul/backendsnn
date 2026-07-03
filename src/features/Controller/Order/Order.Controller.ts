import { Request, Response } from "express";
import { OrderService } from "../../Services/Order/Order.Services";

export class OrderController {
  private orderService = new OrderService();

  getFinancials = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.orderService.getFinancialDashboardData();
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error getFinancials:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  // ✅ Tambahan baru
  getRecentOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.orderService.getRecentOrders();
      res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error getRecentOrders:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };

  // ✅ Tambahan baru
  createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.orderService.createOrder(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      console.error("Error createOrder:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
}