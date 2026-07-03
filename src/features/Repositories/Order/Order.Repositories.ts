import prisma from "../../../prisma";


export class OrderRepository {
  // 1. Ambil total keseluruhan dari awal sampai sekarang
  // Ubah OrderRepository.ts menjadi sementara seperti ini untuk testing:
  // Ubah OrderRepository.ts
  async getTotalFinancials() {
    return await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
        profitAmount: true,
      },
      where: {
        deletedAt: null,
      },
    });
  }

  // 2. Ambil total berdasarkan rentang waktu (untuk hitung Trend)
  async getFinancialsByDateRange(startDate: Date, endDate: Date) {
    return await prisma.order.aggregate({
      _sum: {
        totalAmount: true,
        profitAmount: true,
      },
      where: {
        deletedAt: null,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  // ✅ Tambahan baru
  async getRecentOrders() {
    return await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      where: {
        deletedAt: null,
      },
      select: {
        orderNumber: true,
        createdAt: true,
        status: true,
        totalAmount: true,
      },
    });
  }

  // ✅ Tambahan baru
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
    return await prisma.order.create({
      data: {
        orderNumber: data.orderNumber,
        totalAmount: data.totalAmount,
        profitAmount: data.profitAmount,
        status: data.status,
        userId: data.userId,
        note: data.note ?? null,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });
  }
}