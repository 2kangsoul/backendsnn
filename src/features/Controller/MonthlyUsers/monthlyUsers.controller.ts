import { Request, Response } from "express";
import { MonthlyUsersService } from "../../Services/MonthlyUsers/monthlyUsers.service";

const monthlyUsersService = new MonthlyUsersService();

export class MonthlyUsersController {
  /**
   * GET /api/monthly-users
   * Returns aggregated new user registrations grouped by month for the current year
   */
  async getMonthlyUsers(req: Request, res: Response): Promise<void> {
    try {
      const year = req.query.year
        ? parseInt(req.query.year as string)
        : new Date().getFullYear();

      const data = await monthlyUsersService.getMonthlyUsers(year);

      res.status(200).json({
        success: true,
        message: "Monthly users data fetched successfully",
        data,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch monthly users data",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/monthly-users/summary
   * Returns total users, new users this month, growth percentage vs last month
   */
  async getMonthlySummary(req: Request, res: Response): Promise<void> {
    try {
      const data = await monthlyUsersService.getMonthlySummary();

      res.status(200).json({
        success: true,
        message: "Monthly users summary fetched successfully",
        data,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch monthly users summary",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/monthly-users/by-device
   * Returns user count grouped by device type (Desktop, Phone app, Laptop)
   */
  async getUsersByDevice(req: Request, res: Response): Promise<void> {
    try {
      const data = await monthlyUsersService.getUsersByDevice();

      res.status(200).json({
        success: true,
        message: "Users by device fetched successfully",
        data,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch users by device",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/monthly-users/by-country
   * Returns user count grouped by country with percentage breakdown
   */
  async getUsersByCountry(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit
        ? parseInt(req.query.limit as string)
        : 5;

      const data = await monthlyUsersService.getUsersByCountry(limit);

      res.status(200).json({
        success: true,
        message: "Users by country fetched successfully",
        data,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch users by country",
        error: error.message,
      });
    }
  }

  /**
   * GET /api/monthly-users/realtime
   * Returns combined dashboard overview: total, device breakdown, country breakdown
   */
  async getRealtimeOverview(req: Request, res: Response): Promise<void> {
    try {
      const data = await monthlyUsersService.getRealtimeOverview();

      res.status(200).json({
        success: true,
        message: "Realtime overview fetched successfully",
        data,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch realtime overview",
        error: error.message,
      });
    }
  }
}
