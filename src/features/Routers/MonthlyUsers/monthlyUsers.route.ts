import { Router } from "express";
import { MonthlyUsersController } from "../../Controller/MonthlyUsers/monthlyUsers.controller";

const router = Router();
const controller = new MonthlyUsersController();

/**
 * @route   GET /api/monthly-users
 * @desc    Monthly user registrations grouped by month
 * @query   year (optional, defaults to current year)
 * @access  Private (Admin)
 *
 * Response example:
 * {
 *   "data": [
 *     { "month": "Jan", "year": 2025, "totalUsers": 120 },
 *     { "month": "Feb", "year": 2025, "totalUsers": 95 },
 *     ...
 *   ]
 * }
 */
router.get("/", (req, res) => controller.getMonthlyUsers(req, res));

/**
 * @route   GET /api/monthly-users/summary
 * @desc    KPI summary: total users, new this month, growth % vs last month
 * @access  Private (Admin)
 *
 * Response example:
 * {
 *   "data": {
 *     "totalUsers": 23650,
 *     "newUsersThisMonth": 1860,
 *     "newUsersLastMonth": 1580,
 *     "growthPercentage": 17.72,
 *     "activeUsers": 23650
 *   }
 * }
 */
router.get("/summary", (req, res) => controller.getMonthlySummary(req, res));

/**
 * @route   GET /api/monthly-users/by-device
 * @desc    User count grouped by device type (Desktop, Phone app, Laptop)
 * @access  Private (Admin)
 *
 * Response example:
 * {
 *   "data": [
 *     { "deviceType": "Desktop",   "count": 15624, "percentage": 66.1 },
 *     { "deviceType": "Phone app", "count": 5548,  "percentage": 23.5 },
 *     { "deviceType": "Laptop",    "count": 2478,  "percentage": 10.5 }
 *   ]
 * }
 */
router.get("/by-device", (req, res) => controller.getUsersByDevice(req, res));

/**
 * @route   GET /api/monthly-users/by-country
 * @desc    User count grouped by country with percentage share
 * @query   limit (optional, default 5)
 * @access  Private (Admin)
 *
 * Response example:
 * {
 *   "data": [
 *     { "country": "United States", "count": 6385, "percentage": 27 },
 *     { "country": "United Kingdom","count": 5440, "percentage": 23 },
 *     ...
 *   ]
 * }
 */
router.get("/by-country", (req, res) => controller.getUsersByCountry(req, res));

/**
 * @route   GET /api/monthly-users/realtime
 * @desc    Combined overview for the "Reports overview" dashboard card.
 *          Returns totalUsers + byDevice + byCountry in one call.
 * @access  Private (Admin)
 *
 * Response example:
 * {
 *   "data": {
 *     "totalUsers": 23650,
 *     "byDevice": [...],
 *     "byCountry": [...],
 *     "lastUpdated": "2025-06-19T10:32:00.000Z"
 *   }
 * }
 */
router.get("/realtime", (req, res) => controller.getRealtimeOverview(req, res));

export default router;
