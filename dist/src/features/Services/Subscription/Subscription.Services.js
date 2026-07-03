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
exports.SubscriptionService = void 0;
const Subscription_Repositories_1 = require("../../Repositories/Subscription/Subscription.Repositories");
class SubscriptionService {
    constructor() {
        this.subscriptionRepository = new Subscription_Repositories_1.SubscriptionRepository();
    }
    getSubscriptionDashboardData() {
        return __awaiter(this, void 0, void 0, function* () {
            // Ambil total keseluruhan
            const total = yield this.subscriptionRepository.countActiveSubscriptions();
            // Hitung tanggal untuk Bulan Ini dan Bulan Lalu
            const now = new Date();
            const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
            // Ambil data bulan ini dan bulan lalu
            const currentMonthCount = yield this.subscriptionRepository.countActiveSubscriptionsByDateRange(startOfCurrentMonth, now);
            const lastMonthCount = yield this.subscriptionRepository.countActiveSubscriptionsByDateRange(startOfLastMonth, endOfLastMonth);
            // Hitung persentase trend
            let trendPercentage = 0;
            if (lastMonthCount === 0) {
                trendPercentage = currentMonthCount > 0 ? 100 : 0;
            }
            else {
                trendPercentage =
                    ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100;
            }
            return {
                total,
                trend: `${Math.abs(trendPercentage).toFixed(1)}%`,
                isPositive: trendPercentage >= 0,
            };
        });
    }
    // ✅ Tambahan baru
    createSubscription(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.subscriptionRepository.createSubscription(data);
        });
    }
}
exports.SubscriptionService = SubscriptionService;
//# sourceMappingURL=Subscription.Services.js.map