import prisma from "../../../prisma";


export class SignUpRepository {
  async countNewSignUpsByDateRange(startDate: Date, endDate: Date) {
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