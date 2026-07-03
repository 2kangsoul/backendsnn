export declare class ProgramRepository {
    getAllPrograms(): Promise<({
        _count: {
            modules: number;
            enrollments: number;
        };
        lecture: ({
            user: {
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
        }) | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        title: string;
        imageUrl: string | null;
        description: string | null;
        price: number | null;
        order: number;
        slug: string | null;
        subtitle: string | null;
        level: import(".prisma/client").$Enums.ProgramLevel;
        isPublished: boolean;
        lectureId: string | null;
    })[]>;
    getProgramBySlug(slug: string): Promise<({
        _count: {
            modules: number;
            enrollments: number;
        };
        lecture: ({
            user: {
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
        }) | null;
        modules: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            title: string;
            description: string | null;
            notes: string | null;
            order: number;
            status: import(".prisma/client").$Enums.ModuleStatus;
            location: string | null;
            scheduleDate: Date | null;
            durationHour: number | null;
            maxParticipant: number | null;
            materialUrl: string | null;
            latitude: number | null;
            longitude: number | null;
            recurringDay: string | null;
            recurringTime: string | null;
            totalSessions: number | null;
            programId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        title: string;
        imageUrl: string | null;
        description: string | null;
        price: number | null;
        order: number;
        slug: string | null;
        subtitle: string | null;
        level: import(".prisma/client").$Enums.ProgramLevel;
        isPublished: boolean;
        lectureId: string | null;
    }) | null>;
    getProgramById(id: string): Promise<({
        _count: {
            modules: number;
            enrollments: number;
        };
        lecture: ({
            user: {
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
        }) | null;
        modules: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            title: string;
            description: string | null;
            notes: string | null;
            order: number;
            status: import(".prisma/client").$Enums.ModuleStatus;
            location: string | null;
            scheduleDate: Date | null;
            durationHour: number | null;
            maxParticipant: number | null;
            materialUrl: string | null;
            latitude: number | null;
            longitude: number | null;
            recurringDay: string | null;
            recurringTime: string | null;
            totalSessions: number | null;
            programId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        title: string;
        imageUrl: string | null;
        description: string | null;
        price: number | null;
        order: number;
        slug: string | null;
        subtitle: string | null;
        level: import(".prisma/client").$Enums.ProgramLevel;
        isPublished: boolean;
        lectureId: string | null;
    }) | null>;
    getModulesByProgramId(programId: string): Promise<({
        _count: {
            sessions: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        title: string;
        description: string | null;
        notes: string | null;
        order: number;
        status: import(".prisma/client").$Enums.ModuleStatus;
        location: string | null;
        scheduleDate: Date | null;
        durationHour: number | null;
        maxParticipant: number | null;
        materialUrl: string | null;
        latitude: number | null;
        longitude: number | null;
        recurringDay: string | null;
        recurringTime: string | null;
        totalSessions: number | null;
        programId: string;
    })[]>;
    getProgramsByLevel(level: "BEGINNER" | "ADVANCED" | "EXPERT"): Promise<({
        _count: {
            modules: number;
            enrollments: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        title: string;
        imageUrl: string | null;
        description: string | null;
        price: number | null;
        order: number;
        slug: string | null;
        subtitle: string | null;
        level: import(".prisma/client").$Enums.ProgramLevel;
        isPublished: boolean;
        lectureId: string | null;
    })[]>;
    updateProgram(id: string, data: any): Promise<{
        lecture: ({
            user: {
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
        }) | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        title: string;
        imageUrl: string | null;
        description: string | null;
        price: number | null;
        order: number;
        slug: string | null;
        subtitle: string | null;
        level: import(".prisma/client").$Enums.ProgramLevel;
        isPublished: boolean;
        lectureId: string | null;
    }>;
    getEnrollmentsByProgramId(programId: string): Promise<({
        student: {
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
            bio: string | null;
            studentCode: string | null;
        };
        sessionAttendances: ({
            session: {
                id: string;
                order: number;
                sessionDate: Date;
                startTime: string;
                moduleId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            note: string | null;
            sessionId: string;
            isPresent: boolean;
            checkedInAt: Date | null;
            checkedOutAt: Date | null;
            enrollmentId: string;
        })[];
    } & {
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        note: string | null;
        programId: string;
        progress: number;
        completedAt: Date | null;
        studentId: string;
        enrolledAt: Date;
    })[]>;
    enrollStudent(programId: string, studentId: string): Promise<{
        student: {
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
            bio: string | null;
            studentCode: string | null;
        };
    } & {
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        note: string | null;
        programId: string;
        progress: number;
        completedAt: Date | null;
        studentId: string;
        enrolledAt: Date;
    }>;
    dropStudent(programId: string, studentId: string): Promise<{
        id: string;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.EnrollmentStatus;
        note: string | null;
        programId: string;
        progress: number;
        completedAt: Date | null;
        studentId: string;
        enrolledAt: Date;
    }>;
}
//# sourceMappingURL=Program.Repositories.d.ts.map