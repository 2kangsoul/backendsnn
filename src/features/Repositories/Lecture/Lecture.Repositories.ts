import prisma from "../../../prisma";


export class LectureRepository {
  // 1. Get all lecture profiles
  async getAllLectures() {
    return await prisma.lectureProfile.findMany({
      where: { deletedAt: null },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profilePic: true,
          },
        },
        program: {
          select: {
            id: true,
            title: true,
            level: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // 2. Get lecture profile by id
  async getLectureById(id: string) {
    return await prisma.lectureProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profilePic: true,
          },
        },
        program: {
          select: {
            id: true,
            title: true,
            level: true,
            slug: true,
          },
        },
      },
    });
  }

  // 3. Get lecture profile by userId
  async getLectureByUserId(userId: string) {
    return await prisma.lectureProfile.findFirst({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profilePic: true,
          },
        },
        program: {
          select: {
            id: true,
            title: true,
            level: true,
            slug: true,
          },
        },
      },
    });
  }

  // 4. Create lecture profile
  async createLecture(data: {
    userId: string;
    lectureCode?: string;
    bio?: string;
    specialization?: string;
  }) {
    const lectureCode =
      data.lectureCode ||
      `SNN-Olfactory-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    return await prisma.lectureProfile.create({
      data: {
        ...data,
        lectureCode,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profilePic: true,
          },
        },
      },
    });
  }

  // 5. Update lecture profile
  async updateLecture(
    id: string,
    data: {
      lectureCode?: string;
      bio?: string;
      specialization?: string;
      deletedAt?: Date | null;
    },
  ) {
    return await prisma.lectureProfile.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            profilePic: true,
          },
        },
        program: {
          select: {
            id: true,
            title: true,
            level: true,
            slug: true,
          },
        },
      },
    });
  }

  // 6. Soft delete lecture profile
  async deleteLecture(id: string) {
    return await prisma.lectureProfile.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // 7. Get lecture by userId termasuk yang sudah dihapus
  async getLectureByUserIdIncludeDeleted(userId: string) {
    return await prisma.lectureProfile.findFirst({
      where: { userId },
    });
  }
}
