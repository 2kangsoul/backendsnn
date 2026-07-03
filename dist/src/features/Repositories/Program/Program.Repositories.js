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
exports.ProgramRepository = void 0;
const prisma_1 = __importDefault(require("../../../prisma"));
class ProgramRepository {
    // 1. Get all published programs
    getAllPrograms() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.program.findMany({
                where: { deletedAt: null, isPublished: true },
                orderBy: { order: "asc" },
                include: {
                    lecture: {
                        include: { user: { select: { fullName: true, profilePic: true } } },
                    },
                    _count: { select: { modules: true, enrollments: true } },
                },
            });
        });
    }
    // 2. Get program by slug
    getProgramBySlug(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.program.findFirst({
                where: { slug, deletedAt: null },
                include: {
                    lecture: {
                        include: { user: { select: { fullName: true, profilePic: true } } },
                    },
                    modules: {
                        where: { deletedAt: null },
                        orderBy: { order: "asc" },
                    },
                    _count: { select: { modules: true, enrollments: true } },
                },
            });
        });
    }
    // 3. Get program by id
    getProgramById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.program.findUnique({
                where: { id },
                include: {
                    lecture: {
                        include: { user: { select: { fullName: true, profilePic: true } } },
                    },
                    modules: {
                        where: { deletedAt: null },
                        orderBy: { order: "asc" },
                    },
                    _count: { select: { modules: true, enrollments: true } },
                },
            });
        });
    }
    // 4. Get modules by program id — include sessions count (ganti attendances)
    getModulesByProgramId(programId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.module.findMany({
                where: { programId, deletedAt: null },
                orderBy: { scheduleDate: "asc" },
                include: {
                    _count: {
                        select: { sessions: true }, // ← ganti attendances → sessions
                    },
                },
            });
        });
    }
    // 5. Get programs by level
    getProgramsByLevel(level) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.program.findMany({
                where: { level, deletedAt: null, isPublished: true },
                orderBy: { order: "asc" },
                include: {
                    _count: { select: { modules: true, enrollments: true } },
                },
            });
        });
    }
    // 6. Update program (termasuk assign lectureId)
    updateProgram(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.program.update({
                where: { id },
                data,
                include: {
                    lecture: {
                        include: { user: { select: { fullName: true, profilePic: true } } },
                    },
                },
            });
        });
    }
    // 7. Get enrollments by program id — ganti attendances → sessionAttendances
    getEnrollmentsByProgramId(programId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.programEnrollment.findMany({
                where: { programId },
                orderBy: { enrolledAt: "desc" },
                include: {
                    student: {
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
                    },
                    sessionAttendances: {
                        // ← ganti attendances → sessionAttendances
                        include: {
                            session: {
                                select: {
                                    id: true,
                                    order: true,
                                    sessionDate: true,
                                    startTime: true,
                                    moduleId: true,
                                },
                            },
                        },
                    },
                },
            });
        });
    }
    // 8. Enroll student ke program
    enrollStudent(programId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield prisma_1.default.programEnrollment.findUnique({
                where: { studentId_programId: { studentId, programId } },
            });
            if (existing)
                throw new Error("Student sudah terdaftar di program ini");
            return yield prisma_1.default.programEnrollment.create({
                data: {
                    programId,
                    studentId,
                    status: "ACTIVE",
                    progress: 0,
                },
                include: {
                    student: {
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
                    },
                },
            });
        });
    }
    // 9. Drop student dari program
    dropStudent(programId, studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const enrollment = yield prisma_1.default.programEnrollment.findUnique({
                where: { studentId_programId: { studentId, programId } },
            });
            if (!enrollment)
                throw new Error("Enrollment tidak ditemukan");
            return yield prisma_1.default.programEnrollment.update({
                where: { studentId_programId: { studentId, programId } },
                data: { status: "DROPPED" },
            });
        });
    }
}
exports.ProgramRepository = ProgramRepository;
//# sourceMappingURL=Program.Repositories.js.map