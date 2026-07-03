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

    let trendPercentage = 0;
    if (lastMonthCount === 0) {
      trendPercentage = currentMonthCount > 0 ? 100 : 0;
    } else {
      trendPercentage = ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100;
    }

    return {
      total,
      trend: `${Math.abs(trendPercentage).toFixed(1)}%`,
      isPositive: trendPercentage >= 0
    };
  }

  // ✅ Tambahan baru
  async getTotalSessionsData() {
    const total = await this.analyticRepository.countTotalSessions();

    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const currentMonthCount = await this.analyticRepository.countSessionsByDateRange(startOfCurrentMonth, now);
    const lastMonthCount = await this.analyticRepository.countSessionsByDateRange(startOfLastMonth, endOfLastMonth);

    let trendPercentage = 0;
    if (lastMonthCount === 0) {
      trendPercentage = currentMonthCount > 0 ? 100 : 0;
    } else {
      trendPercentage = ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100;
    }

    // ✅ Tambahan baru: data chart per bulan
    const chartData = await this.analyticRepository.getSessionsPerMonth();

    return {
      total,
      trend: `${Math.abs(trendPercentage).toFixed(1)}%`,
      isPositive: trendPercentage >= 0,
      chartData,
    };
  }
}