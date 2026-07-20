import { MonthlyUsersRepository } from "../../Repositories/MonthlyUsers/monthlyUsers.repository";
import {
  MonthlyUserData,
  MonthlyUsersSummary,
  UsersByCountry,
  RealtimeOverview,
} from "../../Models/MonthlyUsers/monthlyUsers.model";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export class MonthlyUsersService {
  private repo: MonthlyUsersRepository;

  constructor() {
    this.repo = new MonthlyUsersRepository();
  }

  async getMonthlyUsers(year: number): Promise<MonthlyUserData[]> {
    const rows = await this.repo.getMonthlyRegistrations(year);
    const monthMap = new Map(rows.map((r) => [r.month, r.totalUsers]));
    return MONTH_LABELS.map((label, idx) => ({
      month: label,
      year,
      totalUsers: monthMap.get(idx + 1) ?? 0,
    }));
  }

  async getMonthlySummary(): Promise<MonthlyUsersSummary> {
    const now = new Date();
    const currentYear  = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const lastMonth    = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const [totalUsers, newUsersThisMonth, newUsersLastMonth] = await Promise.all([
      this.repo.getTotalActiveUsers(),
      this.repo.getUsersInMonth(currentYear, currentMonth),
      this.repo.getUsersInMonth(lastMonthYear, lastMonth),
    ]);

    const growthPercentage =
      newUsersLastMonth === 0
        ? newUsersThisMonth > 0 ? 100 : 0
        : parseFloat((((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) * 100).toFixed(2));

    return { totalUsers, newUsersThisMonth, newUsersLastMonth, growthPercentage, activeUsers: totalUsers };
  }

  async getUsersByCountry(limit = 5): Promise<UsersByCountry[]> {
    const raw = await this.repo.getUsersByCountry(limit);
    const total = raw.reduce((s, r) => s + r.count, 0);
    return raw.map((r) => ({
      country: r.country,
      count: r.count,
      percentage: total === 0 ? 0 : parseFloat(((r.count / total) * 100).toFixed(1)),
    }));
  }

  async getRealtimeOverview(): Promise<RealtimeOverview> {
    const [totalUsers, byCountry] = await Promise.all([
      this.repo.getTotalActiveUsers(),
      this.getUsersByCountry(5),
    ]);
    return { totalUsers, byCountry, lastUpdated: new Date().toISOString() };
  }
}
