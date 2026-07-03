import { MonthlyUsersRepository } from "../../Repositories/MonthlyUsers/monthlyUsers.repository";
import {
  MonthlyUserData,
  MonthlyUsersSummary,
  UsersByDevice,
  UsersByCountry,
  RealtimeOverview,
} from "../../Models/MonthlyUsers/monthlyUsers.model";

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Map raw device strings to the dashboard display labels
const DEVICE_LABEL_MAP: Record<string, string> = {
  desktop:  "Desktop",
  phone:    "Phone app",
  mobile:   "Phone app",
  laptop:   "Laptop",
  tablet:   "Laptop",
};

export class MonthlyUsersService {
  private repo: MonthlyUsersRepository;

  constructor() {
    this.repo = new MonthlyUsersRepository();
  }

  /**
   * Returns a 12-month array with user registration counts.
   * Months with zero registrations are filled with 0.
   */
  async getMonthlyUsers(year: number): Promise<MonthlyUserData[]> {
    const rows = await this.repo.getMonthlyRegistrations(year);

    // Build a full 12-month array, filling gaps with 0
    const monthMap = new Map(rows.map((r) => [r.month, r.totalUsers]));

    return MONTH_LABELS.map((label, idx) => ({
      month: label,
      year,
      totalUsers: monthMap.get(idx + 1) ?? 0,
    }));
  }

  /**
   * Summary KPIs for the dashboard header cards.
   */
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
        ? newUsersThisMonth > 0
          ? 100
          : 0
        : parseFloat(
            (
              ((newUsersThisMonth - newUsersLastMonth) / newUsersLastMonth) *
              100
            ).toFixed(2)
          );

    return {
      totalUsers,
      newUsersThisMonth,
      newUsersLastMonth,
      growthPercentage,
      activeUsers: totalUsers,
    };
  }

  /**
   * Device breakdown with percentages — matches the dashboard donut chart data.
   */
  async getUsersByDevice(): Promise<UsersByDevice[]> {
    const raw = await this.repo.getUsersByDevice();

    // Normalize device labels to match dashboard display names
    const normalized = raw.map((r) => ({
      ...r,
      deviceType:
        DEVICE_LABEL_MAP[r.deviceType.toLowerCase()] ?? r.deviceType,
    }));

    // Merge duplicates that map to the same label
    const merged = normalized.reduce<Record<string, number>>((acc, r) => {
      acc[r.deviceType] = (acc[r.deviceType] ?? 0) + r.count;
      return acc;
    }, {});

    const total = Object.values(merged).reduce((s, c) => s + c, 0);

    return Object.entries(merged)
      .sort(([, a], [, b]) => b - a)
      .map(([deviceType, count]) => ({
        deviceType,
        count,
        percentage:
          total === 0 ? 0 : parseFloat(((count / total) * 100).toFixed(1)),
      }));
  }

  /**
   * Country breakdown with percentages — matches the "Users by country" bar chart.
   */
  async getUsersByCountry(limit: number = 5): Promise<UsersByCountry[]> {
    const raw = await this.repo.getUsersByCountry(limit);
    const total = raw.reduce((s, r) => s + r.count, 0);

    return raw.map((r) => ({
      country: r.country,
      count: r.count,
      percentage:
        total === 0 ? 0 : parseFloat(((r.count / total) * 100).toFixed(1)),
    }));
  }

  /**
   * Single endpoint that returns everything needed for the
   * "Reports overview" dashboard card (total users, device donut, country bars).
   */
  async getRealtimeOverview(): Promise<RealtimeOverview> {
    const [totalUsers, byDevice, byCountry] = await Promise.all([
      this.repo.getTotalActiveUsers(),
      this.getUsersByDevice(),
      this.getUsersByCountry(5),
    ]);

    return {
      totalUsers,
      byDevice,
      byCountry,
      lastUpdated: new Date().toISOString(),
    };
  }
}
