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
exports.SubscriptionRepository = void 0;
const prisma_1 = __importDefault(require("../../../prisma"));
class SubscriptionRepository {
    // 1. Menghitung total semua subscription yang aktif
    countActiveSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.subscription.count({
                where: { status: "Active" },
            });
        });
    }
    // 2. Menghitung subscription aktif berdasarkan rentang tanggal (Untuk Trend)
    countActiveSubscriptionsByDateRange(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.subscription.count({
                where: {
                    status: "Active",
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });
        });
    }
    // ✅ Tambahan baru
    createSubscription(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return yield prisma_1.default.subscription.create({
                data: {
                    plan: data.plan,
                    status: data.status,
                    userId: data.userId,
                    expiredAt: (_a = data.expiredAt) !== null && _a !== void 0 ? _a : null,
                },
            });
        });
    }
}
exports.SubscriptionRepository = SubscriptionRepository;
//# sourceMappingURL=Subscription.Repositories.js.map