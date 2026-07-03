import { UserRepository } from "../../Repositories/user/User.Repositories";

export class UserService {
  private userRepository = new UserRepository();

  async getMonthlyUsersData() {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const currentMonth = await this.userRepository.countUsersByDateRange(startOfCurrentMonth, now);
    const lastMonth = await this.userRepository.countUsersByDateRange(startOfLastMonth, endOfLastMonth);

    let trendPercentage = 0;
    if (lastMonth === 0) {
      trendPercentage = currentMonth > 0 ? 100 : 0;
    } else {
      trendPercentage = ((currentMonth - lastMonth) / lastMonth) * 100;
    }

    return {
      total: currentMonth,
      trend: `${Math.abs(trendPercentage).toFixed(1)}%`,
      isPositive: trendPercentage >= 0,
    };
  }
}