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
exports.MonthlyUsersService = void 0;
const monthlyUsers_repository_1 = require("../../Repositories/MonthlyUsers/monthlyUsers.repository");
const MONTH_LABELS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
// Map raw device strings to the dashboard display labels
const DEVICE_LABEL_MAP = {
    desktop: "Desktop",
    phone: "Phone app",
    mobile: "Phone app",
    laptop: "Laptop",
    tablet: "Laptop",
};
class MonthlyUsersService {
    constructor() {
        this.repo = new monthlyUsers_repository_1.MonthlyUsersRepository();
    }
    /**
     * Returns a 12-month array with user registration counts.
     * Months with zero registrations are filled with 0.
     */
    getMonthlyUsers(year) {
        return __awaiter(this, void 0, void 0, function* () {
            const rows = yield this.repo.getMonthlyRegistrations(year);
            // Build a full 12-month array, filling gaps with 0
            const monthMap = new Map(rows.map((r) => [r.month, r.totalUsers]));
            return MONTH_LABELS.map((label, idx) => {
                var _a;
                return ({
                    month: label,
                    year,
                    totalUsers: (_a = monthMap.get(idx + 1)) !== null && _a !== void 0 ? _a : 0,
                });
            });
        });
    }
    /**
     * Summary KPIs for the dashboard header cards.
     */
    getMonthlySummary() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth() + 1;
            const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
            const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;
            const [totalUsers, newUsersThisMonth, newUsersLastMonth] = yield Promise.all([
                this.repo.getTotalActiveUsers(),
                this.repo.getUsersInMonth(currentYear, currentMonth),
                this.repo.getUsersInMonth(lastMonthYear, lastMonth),
            ]);
            const growthPercentage = newUsersLastMonth === 0
                ? newUsersThisMonth > 0
                    ? 100
                    : 0
                : parseFloat((((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) *
                    100).toFixed(2));
            return {
                totalUsers,
                newUsersThisMonth,
                newUsersLastMonth,
                growthPercentage,
                activeUsers: totalUsers,
            };
        });
    }
    /**
     * Device breakdown with percentages — matches the dashboard donut chart data.
     */
    getUsersByDevice() {
        return __awaiter(this, void 0, void 0, function* () {
            const raw = yield this.repo.getUsersByDevice();
            // Normalize device labels to match dashboard display names
            const normalized = raw.map((r) => {
                var _a;
                return (Object.assign(Object.assign({}, r), { deviceType: (_a = DEVICE_LABEL_MAP[r.deviceType.toLowerCase()]) !== null && _a !== void 0 ? _a : r.deviceType }));
            });
            // Merge duplicates that map to the same label
            const merged = normalized.reduce((acc, r) => {
                var _a;
                acc[r.deviceType] = ((_a = acc[r.deviceType]) !== null && _a !== void 0 ? _a : 0) + r.count;
                return acc;
            }, {});
            const total = Object.values(merged).reduce((s, c) => s + c, 0);
            return Object.entries(merged)
                .sort(([, a], [, b]) => b - a)
                .map(([deviceType, count]) => ({
                deviceType,
                count,
                percentage: total === 0 ? 0 : parseFloat(((count / total) * 100).toFixed(1)),
            }));
        });
    }
    /**
     * Country breakdown with percentages — matches the "Users by country" bar chart.
     */
    getUsersByCountry() {
        return __awaiter(this, arguments, void 0, function* (limit = 5) {
            const raw = yield this.repo.getUsersByCountry(limit);
            const total = raw.reduce((s, r) => s + r.count, 0);
            return raw.map((r) => ({
                country: r.country,
                count: r.count,
                percentage: total === 0 ? 0 : parseFloat(((r.count / total) * 100).toFixed(1)),
            }));
        });
    }
    /**
     * Single endpoint that returns everything needed for the
     * "Reports overview" dashboard card (total users, device donut, country bars).
     */
    getRealtimeOverview() {
        return __awaiter(this, void 0, void 0, function* () {
            const [totalUsers, byDevice, byCountry] = yield Promise.all([
                this.repo.getTotalActiveUsers(),
                this.getUsersByDevice(),
                this.getUsersByCountry(5),
            ]);
            return {
                totalUsers,
                byDevice,
                byCountry,
                lastUpdated: new Date().toISOString(),
            };
        });
    }
}
exports.MonthlyUsersService = MonthlyUsersService;
//# sourceMappingURL=monthlyUsers.service.js.map