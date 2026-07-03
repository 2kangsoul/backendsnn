import prisma from "../../../prisma";
import { MonthlyUserRow } from "../../Models/MonthlyUsers/monthlyUsers.model";


export class MonthlyUsersRepository {
  /**
   * Aggregates new user registrations per month for a given year.
   */
  async getMonthlyRegistrations(year: number): Promise<MonthlyUserRow[]> {
    const result: Array<{ month: number; year: number; total: bigint }> =
      await prisma.$queryRaw`
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
  }

  /**
   * Total active (non-deleted) user count.
   */
  async getTotalActiveUsers(): Promise<number> {
    return prisma.user.count({
      where: { deletedAt: null },
    });
  }

  /**
   * Count of users registered in a specific month/year.
   */
  async getUsersInMonth(year: number, month: number): Promise<number> {
    const start = new Date(year, month - 1, 1);
    const end   = new Date(year, month, 1);

    return prisma.user.count({
      where: {
        deletedAt: null,
        createdAt: { gte: start, lt: end },
      },
    });
  }

  /**
   * Users grouped by device — uses $queryRaw to avoid Prisma groupBy
   * type issues with nullable fields (ts2345).
   * Primary source: User.device
   * Fallback: SiteAnalytic.deviceType (if User.device is all null)
   */
  async getUsersByDevice(): Promise<Array<{ deviceType: string; count: number }>> {
    // Try User.device first
    const fromUsers: Array<{ device: string | null; total: bigint }> =
      await prisma.$queryRaw`
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
      return fromUsers.map((r) => ({
        deviceType: r.device ?? "Unknown",
        count: Number(r.total),
      }));
    }

    // Fallback: SiteAnalytic.deviceType
    const fromAnalytics: Array<{ deviceType: string; total: bigint }> =
      await prisma.$queryRaw`
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
  }

  /**
   * Users grouped by country — $queryRaw to avoid nullable groupBy issues.
   */
  async getUsersByCountry(
    limit: number = 5
  ): Promise<Array<{ country: string; count: number }>> {
    const rows: Array<{ country: string | null; total: bigint }> =
      await prisma.$queryRaw`
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

    return rows.map((r) => ({
      country: r.country ?? "Unknown",
      count: Number(r.total),
    }));
  }

  /**
   * Total user count including deleted.
   */
  async getTotalAllTimeUsers(): Promise<number> {
    return prisma.user.count();
  }
}