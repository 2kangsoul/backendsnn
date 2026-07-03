export declare class StudentService {
    private studentRepository;
    getAllStudents(): Promise<({
        user: {
            id: string;
            email: string;
            fullName: string;
            no_handphone: string | null;
            profilePic: string | null;
        };
        enrollments: {
            id: string;
            status: import(".prisma/client").$Enums.EnrollmentStatus;
            program: {
                id: string;
                title: string;
            };
            progress: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        bio: string | null;
        studentCode: string | null;
    })[]>;
    getStudentById(id: string): Promise<({
        user: {
            id: string;
            email: string;
            fullName: string;
            no_handphone: string | null;
            profilePic: string | null;
        };
        enrollments: ({
            program: {
                id: string;
                title: string;
                level: import(".prisma/client").$Enums.ProgramLevel;
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
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        bio: string | null;
        studentCode: string | null;
    }) | null>;
    getStudentByUserId(userId: string): Promise<({
        user: {
            id: string;
            email: string;
            fullName: string;
            profilePic: string | null;
        };
        enrollments: ({
            program: {
                id: string;
                title: string;
                level: import(".prisma/client").$Enums.ProgramLevel;
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
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        userId: string;
        bio: string | null;
        studentCode: string | null;
    }) | null>;
    getStudentsNotEnrolled(programId: string): Promise<({
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
    })[]>;
    createStudent(userId: string, data: any): Promise<{
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
    }>;
    deleteStudent(id: string): Promise<{
        message: string;
    }>;
    getEnrollmentsByStudentId(studentId: string): Promise<({
        program: {
            id: string;
            title: string;
            imageUrl: string | null;
            description: string | null;
            _count: {
                modules: number;
            };
            subtitle: string | null;
            level: import(".prisma/client").$Enums.ProgramLevel;
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
    })[]>;
}
//# sourceMappingURL=Student.Services.d.ts.map