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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const prisma_1 = __importDefault(require("../../../prisma"));
class OrderRepository {
    // 1. Ambil total keseluruhan dari awal sampai sekarang
    // Ubah OrderRepository.ts menjadi sementara seperti ini untuk testing:
    // Ubah OrderRepository.ts
    getTotalFinancials() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.order.aggregate({
                _sum: {
                    totalAmount: true,
                    profitAmount: true,
                },
                where: {
                    deletedAt: null,
                },
            });
        });
    }
    // 2. Ambil total berdasarkan rentang waktu (untuk hitung Trend)
    getFinancialsByDateRange(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.order.aggregate({
                _sum: {
                    totalAmount: true,
                    profitAmount: true,
                },
                where: {
                    deletedAt: null,
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });
        });
    }
    // ✅ Tambahan baru
    getRecentOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.order.findMany({
                orderBy: {
                    createdAt: "desc",
                },
                take: 5,
                where: {
                    deletedAt: null,
                },
                select: {
                    orderNumber: true,
                    createdAt: true,
                    status: true,
                    totalAmount: true,
                },
            });
        });
    }
    // ✅ Tambahan baru
    createOrder(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return yield prisma_1.default.order.create({
                data: {
                    orderNumber: data.orderNumber,
                    totalAmount: data.totalAmount,
                    profitAmount: data.profitAmount,
                    status: data.status,
                    userId: data.userId,
                    note: (_a = data.note) !== null && _a !== void 0 ? _a : null,
                    items: {
                        create: data.items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.price,
                        })),
                    },
                },
            });
        });
    }
}
exports.OrderRepository = OrderRepository;
//# sourceMappingURL=Order.Repositories.js.map