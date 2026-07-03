// @ts-nocheck
import prisma from "../../../prisma";


export class StudentRepository {
  // 1. Get all students
  async getAllStudents() {
    return await prisma.studentProfile.findMany({
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
  }

  // 2. Get student by id
  async getStudentById(id: string) {
    return await prisma.studentProfile.findUnique({
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
  }

  // 3. Get student by userId
  async getStudentByUserId(userId: string) {
    return await prisma.studentProfile.findFirst({
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
  }

  // 4. Get students NOT enrolled in a program
  async getStudentsNotEnrolled(programId: string) {
    const enrolled = await prisma.programEnrollment.findMany({
      where: { programId },
      select: { studentId: true },
    });
    const enrolledIds = enrolled.map((e) => e.studentId);
    return await prisma.studentProfile.findMany({
      where: { deletedAt: null, id: { notIn: enrolledIds } },
      include: {
        user: {
          select: { id: true, fullName: true, email: true, profilePic: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // 5. Create student profile
  async createStudent(
    userId: string,
    data: { bio?: string; studentCode?: string },
  ) {
    // Cek student profile aktif (belum dihapus)
    const existing = await prisma.studentProfile.findFirst({
      where: { userId, deletedAt: null },
    });
    if (existing) throw new Error("User ini sudah memiliki student profile.");

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User tidak ditemukan.");

    const [studentProfile] = await prisma.$transaction([
      prisma.studentProfile.create({
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
      prisma.user.update({
        where: { id: userId },
        data: { role: "student" },
      }),
    ]);

    return studentProfile;
  }

  // 6. Delete student profile — hard delete beserta semua relasi
  async deleteStudent(id: string) {
    const student = await prisma.studentProfile.findUnique({ where: { id } });
    if (!student) throw new Error("Student profile tidak ditemukan.");

    // Cari semua enrollment milik student ini
    const enrollments = await prisma.programEnrollment.findMany({
      where: { studentId: id },
      select: { id: true },
    });
    const enrollmentIds = enrollments.map((e) => e.id);

    // Cari semua submission dari enrollment student ini
    const submissions = await prisma.examSubmission.findMany({
      where: { enrollmentId: { in: enrollmentIds } },
      select: { id: true },
    });
    const submissionIds = submissions.map((s) => s.id);

    // Hapus semua relasi dalam transaction
    await prisma.$transaction([
      // 1. Hapus student answers
      prisma.studentAnswer.deleteMany({
        where: { submissionId: { in: submissionIds } },
      }),
      // 2. Hapus exam submissions
      prisma.examSubmission.deleteMany({
        where: { enrollmentId: { in: enrollmentIds } },
      }),
      // 3. Hapus session attendances
      prisma.sessionAttendance.deleteMany({
        where: { enrollmentId: { in: enrollmentIds } },
      }),
      // 4. Hapus enrollments
      prisma.programEnrollment.deleteMany({
        where: { studentId: id },
      }),
      // 5. Hard delete student profile
      prisma.studentProfile.delete({ where: { id } }),
    ]);

    return {
      message: "Student profile dan semua data terkait berhasil dihapus",
    };
  }

  // 7. Get enrollments by student id
  async getEnrollmentsByStudentId(studentId: string) {
    return await prisma.programEnrollment.findMany({
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
  }
}
