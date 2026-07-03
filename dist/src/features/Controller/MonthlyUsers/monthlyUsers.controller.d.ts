import { Request, Response } from "express";
export declare class MonthlyUsersController {
    /**
     * GET /api/monthly-users
     * Returns aggregated new user registrations grouped by month for the current year
     */
    getMonthlyUsers(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/monthly-users/summary
     * Returns total users, new users this month, growth percentage vs last month
     */
    getMonthlySummary(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/monthly-users/by-device
     * Returns user count grouped by device type (Desktop, Phone app, Laptop)
     */
    getUsersByDevice(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/monthly-users/by-country
     * Returns user count grouped by country with percentage breakdown
     */
    getUsersByCountry(req: Request, res: Response): Promise<void>;
    /**
     * GET /api/monthly-users/realtime
     * Returns combined dashboard overview: total, device breakdown, country breakdown
     */
    getRealtimeOverview(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=monthlyUsers.controller.d.ts.map