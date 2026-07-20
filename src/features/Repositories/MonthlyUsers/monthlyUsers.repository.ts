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
          AND country != ''
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