"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentRepository = void 0;
// @ts-nocheck
const prisma_1 = __importDefault(require("../../../prisma"));
class StudentRepository {
    // 1. Get all students
    getAllStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.studentProfile.findMany({
                where: { deletedAt: null },
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            profilePic: true,
                            no_handphone: true,
                        },
                    },
                    enrollments: {
                        select: {
                            id: true,
                            status: true,
                            progress: true,
                            program: { select: { id: true, title: true } },
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            });
        });
    }
    // 2. Get student by id
    getStudentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.studentProfile.findUnique({
                where: { id },
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            profilePic: true,
                            no_handphone: true,
                        },
                    },
                    enrollments: {
                        include: {
                            program: { select: { id: true, title: true, level: true } },
                        },
                    },
                },
            });
        });
    }
    // 3. Get student by userId
    getStudentByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.studentProfile.findFirst({
                where: { userId, deletedAt: null },
                include: {
                    user: {
                        select: { id: true, fullName: true, email: true, profilePic: true },
                    },
                    enrollments: {
                        include: {
                            program: { select: { id: true, title: true, level: true } },
                        },
                    },
                },
            });
        });
    }
    // 4. Get students NOT enrolled in a program
    getStudentsNotEnrolled(programId) {
        return __awaiter(this, void 0, void 0, function* () {
            const enrolled = yield prisma_1.default.programEnrollment.findMany({
                where: { programId },
                select: { studentId: true },
            });
            const enrolledIds = enrolled.map((e) => e.studentId);
            return yield prisma_1.default.studentProfile.findMany({
                where: { deletedAt: null, id: { notIn: enrolledIds } },
                include: {
                    user: {
                        select: { id: true, fullName: true, email: true, profilePic: true },
                    },
                },
                orderBy: { createdAt: "desc" },
            });
        });
    }
    // 5. Create student profile
    createStudent(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Cek student profile aktif (belum dihapus)
            const existing = yield prisma_1.default.studentProfile.findFirst({
                where: { userId, deletedAt: null },
            });
            if (existing)
                throw new Error("User ini sudah memiliki student profile.");
            const user = yield prisma_1.default.user.findUnique({ where: { id: userId } });
            if (!user)
                throw new Error("User tidak ditemukan.");
            const [studentProfile] = yield prisma_1.default.$transaction([
                prisma_1.default.studentProfile.create({
                    data: {
                        userId,
                        bio: data.bio || null,
                        studentCode: data.studentCode || null,
                    },
                    include: {
                        user: {
                            select: { id: true, fullName: true, email: true, profilePic: true },
                        },
                    },
                }),
                prisma_1.default.user.update({
                    where: { id: userId },
                    data: { role: "student" },
                }),
            ]);
            return studentProfile;
        });
    }
    // 6. Delete student profile — hard delete beserta semua relasi
    deleteStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield prisma_1.default.studentProfile.findUnique({ where: { id } });
            if (!student)
                throw new Error("Student profile tidak ditemukan.");
            // Cari semua enrollment milik student ini
            const enrollments = yield prisma_1.default.programEnrollment.findMany({
                where: { studentId: id },
                select: { id: true },
            });
            const enrollmentIds = enrollments.map((e) => e.id);
            // Cari semua submission dari enrollment student ini
            const submissions = yield prisma_1.default.examSubmission.findMany({
                where: { enrollmentId: { in: enrollmentIds } },
                select: { id: true },
            });
            const submissionIds = submissions.map((s) => s.id);
            // Hapus semua relasi dalam transaction
            yield prisma_1.default.$transaction([
                // 1. Hapus student answers
                prisma_1.default.studentAnswer.deleteMany({
                    where: { submissionId: { in: submissionIds } },
                }),
                // 2. Hapus exam submissions
                prisma_1.default.examSubmission.deleteMany({
                    where: { enrollmentId: { in: enrollmentIds } },
                }),
                // 3. Hapus session attendances
                prisma_1.default.sessionAttendance.deleteMany({
                    where: { enrollmentId: { in: enrollmentIds } },
                }),
                // 4. Hapus enrollments
                prisma_1.default.programEnrollment.deleteMany({
                    where: { studentId: id },
                }),
                // 5. Hard delete student profile
                prisma_1.default.studentProfile.delete({ where: { id } }),
            ]);
            return {
                message: "Student profile dan semua data terkait berhasil dihapus",
            };
        });
    }
    // 7. Get enrollments by student id
    getEnrollmentsByStudentId(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.programEnrollment.findMany({
                where: { studentId },
                orderBy: { enrolledAt: "desc" },
                include: {
                    program: {
                        select: {
                            id: true,
                            title: true,
                            subtitle: true,
                            level: true,
                            imageUrl: true,
                            description: true,
                            lecture: {
                                include: {
                                    user: { select: { fullName: true, profilePic: true } },
                                },
                            },
                            _count: { select: { modules: true } },
                        },
                    },
                },
            });
        });
    }
}
exports.StudentRepository = StudentRepository;
//# sourceMappingURL=Student.Repositories.js.map