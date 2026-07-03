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
exports.OrderService = void 0;
const Order_Repositories_1 = require("./../../Repositories/Order/Order.Repositories");
class OrderService {
    constructor() {
        this.orderRepository = new Order_Repositories_1.OrderRepository();
    }
    getFinancialDashboardData() {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Ambil Total Keseluruhan
            const total = yield this.orderRepository.getTotalFinancials();
            const totalRevenue = total._sum.totalAmount || 0;
            const totalProfit = total._sum.profitAmount || 0;
            // 2. Hitung Tanggal (Bulan Ini vs Bulan Lalu)
            const now = new Date();
            const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
            // 3. Data Bulan Ini & Bulan Lalu
            const currentMonthData = yield this.orderRepository.getFinancialsByDateRange(startOfCurrentMonth, now);
            const lastMonthData = yield this.orderRepository.getFinancialsByDateRange(startOfLastMonth, endOfLastMonth);
            const currentProfit = currentMonthData._sum.profitAmount || 0;
            const lastProfit = lastMonthData._sum.profitAmount || 0;
            // 4. Hitung Persentase Trend Profit
            let profitTrendPercentage = 0;
            if (lastProfit === 0) {
                profitTrendPercentage = currentProfit > 0 ? 100 : 0;
            }
            else {
                profitTrendPercentage = ((currentProfit - lastProfit) / lastProfit) * 100;
            }
            return {
                totalRevenue,
                totalProfit,
                profitTrend: `${Math.abs(profitTrendPercentage).toFixed(1)}%`,
                isProfitPositive: profitTrendPercentage >= 0
            };
        });
    }
    getRecentOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.orderRepository.getRecentOrders();
        });
    }
    createOrder(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.orderRepository.createOrder(data);
        });
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=Order.Services.js.map