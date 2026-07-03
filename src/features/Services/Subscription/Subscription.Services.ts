import { SubscriptionRepository } from "../../Repositories/Subscription/Subscription.Repositories";

export class SubscriptionService {
  private subscriptionRepository = new SubscriptionRepository();

  async getSubscriptionDashboardData() {
    // Ambil total keseluruhan
    const total = await this.subscriptionRepository.countActiveSubscriptions();

    // Hitung tanggal untuk Bulan Ini dan Bulan Lalu
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      0,
      23,
      59,
      59,
      999,
    );

    // Ambil data bulan ini dan bulan lalu
    const currentMonthCount =
      await this.subscriptionRepository.countActiveSubscriptionsByDateRange(
        startOfCurrentMonth,
        now,
      );
    const lastMonthCount =
      await this.subscriptionRepository.countActiveSubscriptionsByDateRange(
        startOfLastMonth,
        endOfLastMonth,
      );

    // Hitung persentase trend
    let trendPercentage = 0;
    if (lastMonthCount === 0) {
      trendPercentage = currentMonthCount > 0 ? 100 : 0;
    } else {
      trendPercentage =
        ((currentMonthCount - lastMonthCount) / lastMonthCount) * 100;
    }

    return {
      total,
      trend: `${Math.abs(trendPercentage).toFixed(1)}%`,
      isPositive: trendPercentage >= 0,
    };
  }

  // ✅ Tambahan baru
  async createSubscription(data: {
    plan: string;
    status: string;
    userId: string;
    expiredAt?: Date | null;
  }) {
    return await this.subscriptionRepository.createSubscription(data);
  }
}