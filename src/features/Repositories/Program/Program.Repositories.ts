import prisma from "../../../prisma";


export class ProgramRepository {
  // 1. Get all published programs
  async getAllPrograms() {
    return await prisma.program.findMany({
      where: { deletedAt: null, isPublished: true },
      orderBy: { order: "asc" },
      include: {
        lecture: {
          include: { user: { select: { fullName: true, profilePic: true } } },
        },
        _count: { select: { modules: true, enrollments: true } },
      },
    });
  }

  // 2. Get program by slug
  async getProgramBySlug(slug: string) {
    return await prisma.program.findFirst({
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
  }

  // 3. Get program by id
  async getProgramById(id: string) {
    return await prisma.program.findUnique({
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
  }

  // 4. Get modules by program id — include sessions count (ganti attendances)
  async getModulesByProgramId(programId: string) {
    return await prisma.module.findMany({
      where: { programId, deletedAt: null },
      orderBy: { scheduleDate: "asc" },
      include: {
        _count: {
          select: { sessions: true }, // ← ganti attendances → sessions
        },
      },
    });
  }

  // 5. Get programs by level
  async getProgramsByLevel(level: "BEGINNER" | "ADVANCED" | "EXPERT") {
    return await prisma.program.findMany({
      where: { level, deletedAt: null, isPublished: true },
      orderBy: { order: "asc" },
      include: {
        _count: { select: { modules: true, enrollments: true } },
      },
    });
  }

  // 6. Update program (termasuk assign lectureId)
  async updateProgram(id: string, data: any) {
    return await prisma.program.update({
      where: { id },
      data,
      include: {
        lecture: {
          include: { user: { select: { fullName: true, profilePic: true } } },
        },
      },
    });
  }

  // 7. Get enrollments by program id — ganti attendances → sessionAttendances
  async getEnrollmentsByProgramId(programId: string) {
    return await prisma.programEnrollment.findMany({
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
  }

  // 8. Enroll student ke program
  async enrollStudent(programId: string, studentId: string) {
    const existing = await prisma.programEnrollment.findUnique({
      where: { studentId_programId: { studentId, programId } },
    });
    if (existing) throw new Error("Student sudah terdaftar di program ini");

    return await prisma.programEnrollment.create({
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
  }

  // 9. Drop student dari program
  async dropStudent(programId: string, studentId: string) {
    const enrollment = await prisma.programEnrollment.findUnique({
      where: { studentId_programId: { studentId, programId } },
    });
    if (!enrollment) throw new Error("Enrollment tidak ditemukan");

    return await prisma.programEnrollment.update({
      where: { studentId_programId: { studentId, programId } },
      data: { status: "DROPPED" },
    });
  }
}
