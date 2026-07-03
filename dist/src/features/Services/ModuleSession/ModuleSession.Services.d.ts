export declare class ModuleSessionService {
    private repo;
    generateSessions(moduleId: string): Promise<{
        created: number;
        sessions: {
            moduleId: string;
            sessionDate: Date;
            startTime: string;
            order: number;
            isHoliday: boolean;
            isCancelled: boolean;
        }[];
    }>;
    getSessionsByModuleId(moduleId: string): Promise<({
        _count: {
            attendances: number;
        };
        attendances: ({
            enrollment: {
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
        createdAt: Date;
        updatedAt: Date;
        order: number;
        sessionDate: Date;
        startTime: string;
        isHoliday: boolean;
        isCancelled: boolean;
        moduleId: string;
    })[]>;
    getSessionById(sessionId: string): Promise<({
        module: {
            id: string;
            title: string;
            maxParticipant: number | null;
            latitude: number | null;
            longitude: number | null;
        };
        attendances: ({
            enrollment: {
                student: {
                    user: {
                        id: string;
                        email: string;
                        fullName: string;
                        no_handphone: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        order: number;
        sessionDate: Date;
        startTime: string;
        isHoliday: boolean;
        isCancelled: boolean;
        moduleId: string;
    }) | null>;
    cancelSession(sessionId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        sessionDate: Date;
        startTime: string;
        isHoliday: boolean;
        isCancelled: boolean;
        moduleId: string;
    }>;
    restoreSession(sessionId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        order: number;
        sessionDate: Date;
        startTime: string;
        isHoliday: boolean;
        isCancelled: boolean;
        moduleId: string;
    }>;
    upsertSessionAttendance(sessionId: string, enrollmentId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        note: string | null;
        sessionId: string;
        isPresent: boolean;
        checkedInAt: Date | null;
        checkedOutAt: Date | null;
        enrollmentId: string;
    }>;
    markPresent(sessionId: string, enrollmentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        note: string | null;
        sessionId: string;
        isPresent: boolean;
        checkedInAt: Date | null;
        checkedOutAt: Date | null;
        enrollmentId: string;
    }>;
}
//# sourceMappingURL=ModuleSession.Services.d.ts.map