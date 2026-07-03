import prisma from "../../../prisma";


export class AnalyticRepository {
  // 1. Menghitung total semua pageviews
  async countPageviews(): Promise<number> {
    return await prisma.siteAnalytic.count();
  }

  // 2. Menghitung pageviews berdasarkan rentang tanggal (Untuk Trend)
  async countPageviewsByDateRange(startDate: Date, endDate: Date): Promise<number> {
    return await prisma.siteAnalytic.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  // ✅ Tambahan baru
  async countTotalSessions(): Promise<number> {
    return await prisma.siteAnalytic.count();
  }

  // ✅ Tambahan baru
  async countSessionsByDateRange(startDate: Date, endDate: Date): Promise<number> {
    return await prisma.siteAnalytic.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  // ✅ Tambahan baru: sessions per bulan untuk chart
  async getSessionsPerMonth() {
    const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const now = new Date();
    const year = now.getFullYear();

    const results = await Promise.all(
      MONTH_NAMES.map(async (month, i) => {
        const start = new Date(year, i, 1);
        const end = new Date(year, i + 1, 0, 23, 59, 59, 999);
        const count = await prisma.siteAnalytic.count({
          where: {
            createdAt: { gte: start, lte: end },
          },
        });
        return { month, sessions: count };
      })
    );

    return results;
  }
}