import { Request, Response } from "express";

export class OrderController {
  getFinancials = async (req: Request, res: Response): Promise<void> => {
    res.status(501).json({
      success: false,
      message: "Not implemented yet",
    });
  };

  getRecentOrders = async (req: Request, res: Response): Promise<void> => {
    res.status(501).json({
      success: false,
      message: "Not implemented yet",
    });
  };

  createOrder = async (req: Request, res: Response): Promise<void> => {
    res.status(501).json({
      success: false,
      message: "Not implemented yet",
    });
  };
}