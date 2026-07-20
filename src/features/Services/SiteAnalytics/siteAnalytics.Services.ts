import { AnalyticRepository } from "../../Repositories/SiteAnalytics/siteAnalytics.Repositories";

export class AnalyticService {
  private analyticRepository = new AnalyticRepository();

  async getPageviewsDashboardData() {
    const total = await this.analyticRepository.countPageviews();
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    const currentMonthCount = await this.analyticRepository.countPageviewsByDateRange(startOfCurrentMonth, now);
    const lastMonthCount = await this.analyticRepository.countPageviewsByDateRange(startOfLastMonth, endOfLastMonth);
    const trendPercentage = lastMonthCount === 0
      ? (currentMonthCount > 0 ? 100 : 0)
      : ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100;
    return { total, trend: `${Math.abs(trendPercentage).toFixed(1)}%`, isPositive: trendPercentage >= 0 };
  }
}
