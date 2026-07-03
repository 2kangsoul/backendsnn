import prisma from "../../../prisma";


export class SubscriptionRepository {
  // 1. Menghitung total semua subscription yang aktif
  async countActiveSubscriptions(): Promise<number> {
    return await prisma.subscription.count({
      where: { status: "Active" },
    });
  }

  // 2. Menghitung subscription aktif berdasarkan rentang tanggal (Untuk Trend)
  async countActiveSubscriptionsByDateRange(startDate: Date, endDate: Date): Promise<number> {
    return await prisma.subscription.count({
      where: {
        status: "Active",
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  // ✅ Tambahan baru
  async createSubscription(data: {
    plan: string;
    status: string;
    userId: string;
    expiredAt?: Date | null;
  }) {
    return await prisma.subscription.create({
      data: {
        plan: data.plan,
        status: data.status,
        userId: data.userId,
        expiredAt: data.expiredAt ?? null,
      },
    });
  }
}