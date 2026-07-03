import { OrderRepository } from "./../../Repositories/Order/Order.Repositories";

export class OrderService {
  private orderRepository = new OrderRepository();

  async getFinancialDashboardData() {
    // 1. Ambil Total Keseluruhan
    const total = await this.orderRepository.getTotalFinancials();
    const totalRevenue = total._sum.totalAmount || 0;
    const totalProfit = total._sum.profitAmount || 0;

    // 2. Hitung Tanggal (Bulan Ini vs Bulan Lalu)
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // 3. Data Bulan Ini & Bulan Lalu
    const currentMonthData = await this.orderRepository.getFinancialsByDateRange(startOfCurrentMonth, now);
    const lastMonthData = await this.orderRepository.getFinancialsByDateRange(startOfLastMonth, endOfLastMonth);

    const currentProfit = currentMonthData._sum.profitAmount || 0;
    const lastProfit = lastMonthData._sum.profitAmount || 0;

    // 4. Hitung Persentase Trend Profit
    let profitTrendPercentage = 0;
    if (lastProfit === 0) {
      profitTrendPercentage = currentProfit > 0 ? 100 : 0;
    } else {
      profitTrendPercentage = ((currentProfit - lastProfit) / lastProfit) * 100;
    }

    return {
      totalRevenue,
      totalProfit,
      profitTrend: `${Math.abs(profitTrendPercentage).toFixed(1)}%`,
      isProfitPositive: profitTrendPercentage >= 0
    };
  }

  
  async getRecentOrders() {
    return await this.orderRepository.getRecentOrders();
  }

  async createOrder(data: {
    orderNumber: string;
    totalAmount: number;
    profitAmount: number;
    status: string;
    userId: string;
    note?: string; // ✅ Tambahan baru
    items: {
      productId: string;
      quantity: number;
      price: number;
    }[];
  }) {
    return await this.orderRepository.createOrder(data);
  }
}