import prisma from "../../../prisma";


export class UserRepository {
  async countUsersByDateRange(startDate: Date, endDate: Date) {
    return await prisma.user.count({
      where: {
        deletedAt: null,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }
}
