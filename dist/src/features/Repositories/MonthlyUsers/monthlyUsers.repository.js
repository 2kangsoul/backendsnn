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
exports.MonthlyUsersRepository = void 0;
const prisma_1 = __importDefault(require("../../../prisma"));
class MonthlyUsersRepository {
    /**
     * Aggregates new user registrations per month for a given year.
     */
    getMonthlyRegistrations(year) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield prisma_1.default.$queryRaw `
        SELECT
          EXTRACT(MONTH FROM "createdAt")::int AS month,
          EXTRACT(YEAR  FROM "createdAt")::int AS year,
          COUNT(*)                              AS total
        FROM users
        WHERE
          "deletedAt" IS NULL
          AND EXTRACT(YEAR FROM "createdAt") = ${year}
        GROUP BY year, month
        ORDER BY month ASC
      `;
            return result.map((r) => ({
                month: r.month,
                year: r.year,
                totalUsers: Number(r.total),
            }));
        });
    }
    /**
     * Total active (non-deleted) user count.
     */
    getTotalActiveUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.user.count({
                where: { deletedAt: null },
            });
        });
    }
    /**
     * Count of users registered in a specific month/year.
     */
    getUsersInMonth(year, month) {
        return __awaiter(this, void 0, void 0, function* () {
            const start = new Date(year, month - 1, 1);
            const end = new Date(year, month, 1);
            return prisma_1.default.user.count({
                where: {
                    deletedAt: null,
                    createdAt: { gte: start, lt: end },
                },
            });
        });
    }
    /**
     * Users grouped by device — uses $queryRaw to avoid Prisma groupBy
     * type issues with nullable fields (ts2345).
     * Primary source: User.device
     * Fallback: SiteAnalytic.deviceType (if User.device is all null)
     */
    getUsersByDevice() {
        return __awaiter(this, void 0, void 0, function* () {
            // Try User.device first
            const fromUsers = yield prisma_1.default.$queryRaw `
        SELECT
          device,
          COUNT(*) AS total
        FROM users
        WHERE "deletedAt" IS NULL
          AND device IS NOT NULL
        GROUP BY device
        ORDER BY total DESC
      `;
            if (fromUsers.length > 0) {
                return fromUsers.map((r) => {
                    var _a;
                    return ({
                        deviceType: (_a = r.device) !== null && _a !== void 0 ? _a : "Unknown",
                        count: Number(r.total),
                    });
                });
            }
            // Fallback: SiteAnalytic.deviceType
            const fromAnalytics = yield prisma_1.default.$queryRaw `
        SELECT
          "deviceType",
          COUNT(DISTINCT "userId") AS total
        FROM site_analytics
        WHERE "userId" IS NOT NULL
        GROUP BY "deviceType"
        ORDER BY total DESC
      `;
            return fromAnalytics.map((r) => ({
                deviceType: r.deviceType,
                count: Number(r.total),
            }));
        });
    }
    /**
     * Users grouped by country — $queryRaw to avoid nullable groupBy issues.
     */
    getUsersByCountry() {
        return __awaiter(this, arguments, void 0, function* (limit = 5) {
            const rows = yield prisma_1.default.$queryRaw `
        SELECT
          country,
          COUNT(*) AS total
        FROM users
        WHERE "deletedAt" IS NULL
          AND country IS NOT NULL
        GROUP BY country
        ORDER BY total DESC
        LIMIT ${limit}
      `;
            return rows.map((r) => {
                var _a;
                return ({
                    country: (_a = r.country) !== null && _a !== void 0 ? _a : "Unknown",
                    count: Number(r.total),
                });
            });
        });
    }
    /**
     * Total user count including deleted.
     */
    getTotalAllTimeUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.user.count();
        });
    }
}
exports.MonthlyUsersRepository = MonthlyUsersRepository;
//# sourceMappingURL=monthlyUsers.repository.js.map