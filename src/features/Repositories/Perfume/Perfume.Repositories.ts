import prisma from "../../../prisma";


export class PerfumeRepository {
  // 1. Get all perfumes
  async getAllPerfumes() {
    return await prisma.perfume.findMany({
      where: { deletedAt: null },
      orderBy: { totalLikes: "desc" },
      include: { _count: { select: { likes: true } } },
    });
  }

  // 2. Get top 10 per category
  async getTop10ByCategory(category: string) {
    return await prisma.perfume.findMany({
      where: { deletedAt: null, category },
      orderBy: { totalLikes: "desc" },
      take: 10,
      include: { _count: { select: { likes: true } } },
    });
  }

  // 3. Get all categories
  async getAllCategories() {
    return await prisma.perfume.groupBy({
      by: ["category"],
      where: { deletedAt: null },
      _count: { category: true },
      orderBy: { category: "asc" },
    });
  }

  // 4. Get perfume by id
  async getPerfumeById(id: string) {
    return await prisma.perfume.findUnique({
      where: { id },
      include: { _count: { select: { likes: true } } },
    });
  }

  // 5. Create perfume (admin)
  async createPerfume(data: {
    name: string;
    brand: string;
    category: string;
    description?: string;
    imageUrl?: string;
    gender?: string;
    year?: number;
  }) {
    return await prisma.perfume.create({ data });
  }

  // 6. Like perfume
  async likePerfume(perfumeId: string, userId: string) {
    const existing = await prisma.perfumeLike.findUnique({
      where: { perfumeId_userId: { perfumeId, userId } },
    });

    if (existing) {
      // Unlike
      await prisma.perfumeLike.delete({
        where: { perfumeId_userId: { perfumeId, userId } },
      });
      await prisma.perfume.update({
        where: { id: perfumeId },
        data: { totalLikes: { decrement: 1 } },
      });
      return { liked: false };
    } else {
      // Like
      await prisma.perfumeLike.create({
        data: { perfumeId, userId },
      });
      await prisma.perfume.update({
        where: { id: perfumeId },
        data: { totalLikes: { increment: 1 } },
      });
      return { liked: true };
    }
  }

  // 7. Check if user already liked
  async checkUserLike(perfumeId: string, userId: string) {
    const existing = await prisma.perfumeLike.findUnique({
      where: { perfumeId_userId: { perfumeId, userId } },
    });
    return !!existing;
  }

  // 8. Delete perfume (admin)
  async deletePerfume(id: string) {
    return await prisma.perfume.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // 9. Get perfumes by note (slug)
  async getPerfumesByNote(slug: string) {
    const searchKeyword = slug.replace(/-/g, ' ');
    return await prisma.perfume.findMany({
      where: { 
        deletedAt: null,
        description: { contains: searchKeyword, mode: 'insensitive' }
      },
      orderBy: { totalLikes: "desc" },
      include: { _count: { select: { likes: true } } },
    });
  }
}