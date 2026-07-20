import { Request, Response } from "express";
import prisma from "../../../prisma";

export class OrderController {
  getFinancials = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: "PAID", deletedAt: null },
      });
      res.status(200).json({
        success: true,
        data: {
          totalRevenue: result._sum.totalAmount ?? 0,
          // ponytail: profit = 40% revenue, add kolom DB kalau mau per-order
          totalProfit: (result._sum.totalAmount ?? 0) * 0.4,
          profitTrend: "0%",
          isProfitPositive: true,
        },
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getRecentOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const orders = await prisma.order.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          orderNumber: true,
          createdAt: true,
          status: true,
          totalAmount: true,
        },
      });
      res.status(200).json({ success: true, data: orders });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  getMonthlyRevenue = async (req: Request, res: Response): Promise<void> => {
    try {
      const year = new Date().getFullYear();
      const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const data = await Promise.all(
        MONTHS.map(async (month, i) => {
          const start = new Date(year, i, 1);
          const end = new Date(year, i + 1, 1);
          const result = await prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { status: "PAID", deletedAt: null, createdAt: { gte: start, lt: end } },
          });
          return { month, revenue: result._sum.totalAmount ?? 0 };
        })
      );
      res.status(200).json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  };

  createOrder = async (req: Request, res: Response): Promise<void> => {
    res.status(501).json({ success: false, message: "Not implemented yet" });
  };
}
