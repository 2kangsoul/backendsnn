"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonthlyUsersController = void 0;
const monthlyUsers_service_1 = require("../../Services/MonthlyUsers/monthlyUsers.service");
const monthlyUsersService = new monthlyUsers_service_1.MonthlyUsersService();
class MonthlyUsersController {
    /**
     * GET /api/monthly-users
     * Returns aggregated new user registrations grouped by month for the current year
     */
    getMonthlyUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const year = req.query.year
                    ? parseInt(req.query.year)
                    : new Date().getFullYear();
                const data = yield monthlyUsersService.getMonthlyUsers(year);
                res.status(200).json({
                    success: true,
                    message: "Monthly users data fetched successfully",
                    data,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch monthly users data",
                    error: error.message,
                });
            }
        });
    }
    /**
     * GET /api/monthly-users/summary
     * Returns total users, new users this month, growth percentage vs last month
     */
    getMonthlySummary(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield monthlyUsersService.getMonthlySummary();
                res.status(200).json({
                    success: true,
                    message: "Monthly users summary fetched successfully",
                    data,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch monthly users summary",
                    error: error.message,
                });
            }
        });
    }
    /**
     * GET /api/monthly-users/by-device
     * Returns user count grouped by device type (Desktop, Phone app, Laptop)
     */
    getUsersByDevice(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield monthlyUsersService.getUsersByDevice();
                res.status(200).json({
                    success: true,
                    message: "Users by device fetched successfully",
                    data,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch users by device",
                    error: error.message,
                });
            }
        });
    }
    /**
     * GET /api/monthly-users/by-country
     * Returns user count grouped by country with percentage breakdown
     */
    getUsersByCountry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = req.query.limit
                    ? parseInt(req.query.limit)
                    : 5;
                const data = yield monthlyUsersService.getUsersByCountry(limit);
                res.status(200).json({
                    success: true,
                    message: "Users by country fetched successfully",
                    data,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch users by country",
                    error: error.message,
                });
            }
        });
    }
    /**
     * GET /api/monthly-users/realtime
     * Returns combined dashboard overview: total, device breakdown, country breakdown
     */
    getRealtimeOverview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield monthlyUsersService.getRealtimeOverview();
                res.status(200).json({
                    success: true,
                    message: "Realtime overview fetched successfully",
                    data,
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: "Failed to fetch realtime overview",
                    error: error.message,
                });
            }
        });
    }
}
exports.MonthlyUsersController = MonthlyUsersController;
//# sourceMappingURL=monthlyUsers.controller.js.map