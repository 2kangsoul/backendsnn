// @ts-nocheck
import prisma from "../../../prisma";
import { Router, Request, Response } from "express";
import { verifyToken } from "../../../Middleware/verifyToken";

const router = Router();

// ── GET /api/lectures/:lectureId/absensi ─────────────────────────────────────
// Dashboard absensi lengkap untuk lecture
router.get(
  "/:lectureId/absensi",
  verifyToken,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { lectureId } = req.params;

      // 1. Ambil program milik lecture
      const lecture = await prisma.lectureProfile.findUnique({
        where: { id: lectureId },
        include: {
          program: {
            include: {
              modules: {
                where: { deletedAt: null },
                orderBy: { order: "asc" },
                include: {
                  sessions: {
                    orderBy: { order: "asc" },
                    include: {
                      attendances: {
                        include: {
                          enrollment: {
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
                          },
                        },
                      },
                    },
                  },
                },
              },
              enrollments: {
                where: { status: "ACTIVE" },
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
                    include: {
                      session: {
                        select: {
                          id: true,
                          order: true,
                          sessionDate: true,
                          startTime: true,
                          moduleId: true,
                          isCancelled: true,
                        },
                      },
                    },
                    orderBy: { createdAt: "asc" },
                  },
                },
              },
            },
          },
        },
      });

      if (!lecture?.program) {
        return res
          .status(404)
          .json({ success: false, message: "Program tidak ditemukan" });
      }

      const program = lecture.program;
      const modules = program.modules;
      const enrollments = program.enrollments;

      // 2. Hitung stat cards
      const totalSessions = modules.reduce(
        (sum, m) => sum + m.sessions.filter((s) => !s.isCancelled).length,
        0,
      );
      const totalAttendanceRecords = modules.reduce(
        (sum, m) =>
          sum +
          m.sessions.reduce((s2, sess) => s2 + sess.attendances.length, 0),
        0,
      );
      const totalPresent = modules.reduce(
        (sum, m) =>
          sum +
          m.sessions.reduce(
            (s2, sess) =>
              s2 + sess.attendances.filter((a) => a.isPresent).length,
            0,
          ),
        0,
      );
      const avgAttendancePct =
        totalAttendanceRecords > 0
          ? Math.round((totalPresent / totalAttendanceRecords) * 100)
          : 0;

      // Today sessions
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const todaySessions = modules.reduce(
        (sum, m) =>
          sum +
          m.sessions.filter((s) => {
            const d = new Date(s.sessionDate);
            return d >= today && d < tomorrow && !s.isCancelled;
          }).length,
        0,
      );

      // 3. Rekap per murid
      const studentRecap = enrollments.map((enroll) => {
        const studentAttendances = enroll.sessionAttendances;
        const totalStudentSessions = studentAttendances.length;
        const presentCount = studentAttendances.filter(
          (a) => a.isPresent,
        ).length;
        const pct =
          totalStudentSessions > 0
            ? Math.round((presentCount / totalStudentSessions) * 100)
            : 0;

        // Rekap per modul
        const moduleRecap = modules.map((mod) => {
          const modSessions = mod.sessions.filter((s) => !s.isCancelled);
          const modAttendances = studentAttendances.filter(
            (a) => a.session.moduleId === mod.id,
          );
          const modPresent = modAttendances.filter((a) => a.isPresent).length;
          return {
            moduleId: mod.id,
            moduleTitle: mod.title,
            moduleOrder: mod.order,
            totalSessions: modSessions.length,
            presentCount: modPresent,
            pct:
              modSessions.length > 0
                ? Math.round((modPresent / modSessions.length) * 100)
                : 0,
          };
        });

        // Cek absen berturut-turut
        const sortedAtt = [...studentAttendances].sort(
          (a, b) =>
            new Date(a.session.sessionDate).getTime() -
            new Date(b.session.sessionDate).getTime(),
        );
        let consecutiveAbsent = 0;
        let maxConsecutive = 0;
        let consecutiveSessionIds: string[] = [];
        let tempIds: string[] = [];
        for (const att of sortedAtt) {
          if (!att.isPresent) {
            consecutiveAbsent++;
            tempIds.push(att.session.id);
            if (consecutiveAbsent > maxConsecutive) {
              maxConsecutive = consecutiveAbsent;
              consecutiveSessionIds = [...tempIds];
            }
          } else {
            consecutiveAbsent = 0;
            tempIds = [];
          }
        }

        return {
          enrollmentId: enroll.id,
          studentId: enroll.studentId,
          student: enroll.student.user,
          progress: enroll.progress,
          totalSessions: totalStudentSessions,
          presentCount,
          pct,
          moduleRecap,
          consecutiveAbsent: maxConsecutive,
          needsAttention: maxConsecutive >= 3,
        };
      });

      // 4. Timeline sesi terbaru (10 sesi terakhir yang sudah lewat)
      const now = new Date();
      const allSessions = modules
        .flatMap((m) =>
          m.sessions
            .filter((s) => new Date(s.sessionDate) <= now && !s.isCancelled)
            .map((s) => ({
              ...s,
              moduleTitle: m.title,
              moduleOrder: m.order,
              moduleId: m.id,
            })),
        )
        .sort(
          (a, b) =>
            new Date(b.sessionDate).getTime() -
            new Date(a.sessionDate).getTime(),
        )
        .slice(0, 10);

      // 5. Alert murid yang absen 3x berturut-turut
      const alerts = studentRecap
        .filter((s) => s.needsAttention)
        .map((s) => ({
          student: s.student,
          consecutiveAbsent: s.consecutiveAbsent,
        }));

      return res.status(200).json({
        success: true,
        data: {
          program: { id: program.id, title: program.title },
          stats: {
            totalSessions,
            totalPresent,
            totalAttendanceRecords,
            avgAttendancePct,
            activeStudents: enrollments.length,
            todaySessions,
          },
          studentRecap,
          recentSessions: allSessions,
          alerts,
        },
      });
    } catch (error) {
      console.error("Error getAbsensiDashboard:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
);

export default router;
