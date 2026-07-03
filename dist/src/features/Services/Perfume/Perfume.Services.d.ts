export declare class PerfumeService {
    private perfumeRepository;
    getAllPerfumes(): Promise<({
        _count: {
            likes: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        category: string;
        imageUrl: string | null;
        brand: string;
        description: string | null;
        notes: string | null;
        year: number | null;
        gender: string | null;
        totalLikes: number;
    })[]>;
    getTop10ByCategory(category: string): Promise<({
        _count: {
            likes: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        category: string;
        imageUrl: string | null;
        brand: string;
        description: string | null;
        notes: string | null;
        year: number | null;
        gender: string | null;
        totalLikes: number;
    })[]>;
    getAllCategories(): Promise<(import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.PerfumeGroupByOutputType, "category"[]> & {
        _count: {
            category: number;
        };
    })[]>;
    getPerfumeById(id: string): Promise<({
        _count: {
            likes: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        category: string;
        imageUrl: string | null;
        brand: string;
        description: string | null;
        notes: string | null;
        year: number | null;
        gender: string | null;
        totalLikes: number;
    }) | null>;
    getPerfumesByNote(slug: string): Promise<({
        _count: {
            likes: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        category: string;
        imageUrl: string | null;
        brand: string;
        description: string | null;
        notes: string | null;
        year: number | null;
        gender: string | null;
        totalLikes: number;
    })[]>;
    createPerfume(data: {
        name: string;
        brand: string;
        category: string;
        description?: string;
        imageUrl?: string;
        gender?: string;
        year?: number;
    }): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        category: string;
        imageUrl: string | null;
        brand: string;
        description: string | null;
        notes: string | null;
        year: number | null;
        gender: string | null;
        totalLikes: number;
    }>;
    likePerfume(perfumeId: string, userId: string): Promise<{
        liked: boolean;
    }>;
    checkUserLike(perfumeId: string, userId: string): Promise<boolean>;
    deletePerfume(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        category: string;
        imageUrl: string | null;
        brand: string;
        description: string | null;
        notes: string | null;
        year: number | null;
        gender: string | null;
        totalLikes: number;
    }>;
}
//# sourceMappingURL=Perfume.Services.d.ts.map