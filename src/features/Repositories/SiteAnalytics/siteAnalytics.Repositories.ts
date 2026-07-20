import prisma from "../../../prisma";

export class AnalyticRepository {
  async countPageviews(): Promise<number> {
    return await prisma.siteAnalytic.count();
  }

  async countPageviewsByDateRange(startDate: Date, endDate: Date): Promise<number> {
    return await prisma.siteAnalytic.count({
      where: { createdAt: { gte: startDate, lte: endDate } },
    });
  }
}
