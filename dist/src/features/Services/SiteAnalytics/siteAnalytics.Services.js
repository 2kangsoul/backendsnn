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
exports.AnalyticService = void 0;
const siteAnalytics_Repositories_1 = require("../../Repositories/SiteAnalytics/siteAnalytics.Repositories");
class AnalyticService {
    constructor() {
        this.analyticRepository = new siteAnalytics_Repositories_1.AnalyticRepository();
    }
    getPageviewsDashboardData() {
        return __awaiter(this, void 0, void 0, function* () {
            const total = yield this.analyticRepository.countPageviews();
            const now = new Date();
            const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
            const currentMonthCount = yield this.analyticRepository.countPageviewsByDateRange(startOfCurrentMonth, now);
            const lastMonthCount = yield this.analyticRepository.countPageviewsByDateRange(startOfLastMonth, endOfLastMonth);
            let trendPercentage = 0;
            if (lastMonthCount === 0) {
                trendPercentage = currentMonthCount > 0 ? 100 : 0;
            }
            else {
                trendPercentage = ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100;
            }
            return {
                total,
                trend: `${Math.abs(trendPercentage).toFixed(1)}%`,
                isPositive: trendPercentage >= 0
            };
        });
    }
    // ✅ Tambahan baru
    getTotalSessionsData() {
        return __awaiter(this, void 0, void 0, function* () {
            const total = yield this.analyticRepository.countTotalSessions();
            const now = new Date();
            const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
            const currentMonthCount = yield this.analyticRepository.countSessionsByDateRange(startOfCurrentMonth, now);
            const lastMonthCount = yield this.analyticRepository.countSessionsByDateRange(startOfLastMonth, endOfLastMonth);
            let trendPercentage = 0;
            if (lastMonthCount === 0) {
                trendPercentage = currentMonthCount > 0 ? 100 : 0;
            }
            else {
                trendPercentage = ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100;
            }
            // ✅ Tambahan baru: data chart per bulan
            const chartData = yield this.analyticRepository.getSessionsPerMonth();
            return {
                total,
                trend: `${Math.abs(trendPercentage).toFixed(1)}%`,
                isPositive: trendPercentage >= 0,
                chartData,
            };
        });
    }
}
exports.AnalyticService = AnalyticService;
//# sourceMappingURL=siteAnalytics.Services.js.map