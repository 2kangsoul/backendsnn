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
exports.AnalyticRepository = void 0;
const prisma_1 = __importDefault(require("../../../prisma"));
class AnalyticRepository {
    // 1. Menghitung total semua pageviews
    countPageviews() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.siteAnalytic.count();
        });
    }
    // 2. Menghitung pageviews berdasarkan rentang tanggal (Untuk Trend)
    countPageviewsByDateRange(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.siteAnalytic.count({
                where: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });
        });
    }
    // ✅ Tambahan baru
    countTotalSessions() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.siteAnalytic.count();
        });
    }
    // ✅ Tambahan baru
    countSessionsByDateRange(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.siteAnalytic.count({
                where: {
                    createdAt: {
                        gte: startDate,
                        lte: endDate,
                    },
                },
            });
        });
    }
    // ✅ Tambahan baru: sessions per bulan untuk chart
    getSessionsPerMonth() {
        return __awaiter(this, void 0, void 0, function* () {
            const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const now = new Date();
            const year = now.getFullYear();
            const results = yield Promise.all(MONTH_NAMES.map((month, i) => __awaiter(this, void 0, void 0, function* () {
                const start = new Date(year, i, 1);
                const end = new Date(year, i + 1, 0, 23, 59, 59, 999);
                const count = yield prisma_1.default.siteAnalytic.count({
                    where: {
                        createdAt: { gte: start, lte: end },
                    },
                });
                return { month, sessions: count };
            })));
            return results;
        });
    }
}
exports.AnalyticRepository = AnalyticRepository;
//# sourceMappingURL=siteAnalytics.Repositories.js.map