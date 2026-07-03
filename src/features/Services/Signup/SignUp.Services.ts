import { SignUpRepository } from "../../Repositories/Signup/SignUp.Repositories";

export class SignUpService {
  private signUpRepository = new SignUpRepository();

  async getNewSignUpsData() {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const currentMonth = await this.signUpRepository.countNewSignUpsByDateRange(startOfCurrentMonth, now);
    const lastMonth = await this.signUpRepository.countNewSignUpsByDateRange(startOfLastMonth, endOfLastMonth);

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