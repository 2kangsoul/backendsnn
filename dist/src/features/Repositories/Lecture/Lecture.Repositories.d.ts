export declare class LectureRepository {
    getAllLectures(): Promise<({
        user: {
            id: string;
            email: string;
            fullName: string;
            profilePic: string | null;
        };
        program: {
            id: string;
            title: string;
            slug: string | null;
            level: import(".prisma/client").$Enums.ProgramLevel;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        lectureCode: string | null;
        bio: string | null;
        specialization: string | null;
    })[]>;
    getLectureById(id: string): Promise<({
        user: {
            id: string;
            email: string;
            fullName: string;
            profilePic: string | null;
        };
        program: {
            id: string;
            title: string;
            slug: string | null;
            level: import(".prisma/client").$Enums.ProgramLevel;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        lectureCode: string | null;
        bio: string | null;
        specialization: string | null;
    }) | null>;
    getLectureByUserId(userId: string): Promise<({
        user: {
            id: string;
            email: string;
            fullName: string;
            profilePic: string | null;
        };
        program: {
            id: string;
            title: string;
            slug: string | null;
            level: import(".prisma/client").$Enums.ProgramLevel;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        lectureCode: string | null;
        bio: string | null;
        specialization: string | null;
    }) | null>;
    createLecture(data: {
        userId: string;
        lectureCode?: string;
        bio?: string;
        specialization?: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
            profilePic: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        lectureCode: string | null;
        bio: string | null;
        specialization: string | null;
    }>;
    updateLecture(id: string, data: {
        lectureCode?: string;
        bio?: string;
        specialization?: string;
        deletedAt?: Date | null;
    }): Promise<{
        user: {
            id: string;
            email: string;
            fullName: string;
            profilePic: string | null;
        };
        program: {
            id: string;
            title: string;
            slug: string | null;
            level: import(".prisma/client").$Enums.ProgramLevel;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        lectureCode: string | null;
        bio: string | null;
        specialization: string | null;
    }>;
    deleteLecture(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        lectureCode: string | null;
        bio: string | null;
        specialization: string | null;
    }>;
    getLectureByUserIdIncludeDeleted(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        lectureCode: string | null;
        bio: string | null;
        specialization: string | null;
    } | null>;
}
//# sourceMappingURL=Lecture.Repositories.d.ts.map