// @ts-nocheck
import prisma from "../../../prisma";


// ── Helper: fetch tanggal merah Indonesia via API ─────────────────────────────
async function getHolidays(year: number): Promise<string[]> {
  try {
    const res = await fetch(
      `https://api-harilibur.vercel.app/api?year=${year}`
    );
    const data = await res.json();
    // Return array of "YYYY-MM-DD" strings
    return data
      .filter((h: any) => h.is_national_holiday)
      .map((h: any) => h.holiday_date); // format: "YYYY-MM-DD"
  } catch (e) {
    console.error("Gagal fetch tanggal merah:", e);
    return [];
  }
}

// ── Helper: cek weekend ───────────────────────────────────────────────────────
function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // 0=Minggu, 6=Sabtu
}

// ── Helper: cek apakah tanggal adalah hari yang diminta ──────────────────────
const DAY_MAP: { [key: string]: number } = {
  SUNDAY: 0, MONDAY: 1, TUESDAY: 2, WEDNESDAY: 3,
  THURSDAY: 4, FRIDAY: 5, SATURDAY: 6,
};

function isTargetDay(date: Date, recurringDay: string): boolean {
  return date.getDay() === (DAY_MAP[recurringDay] ?? -1);
}

// ── Helper: format date ke YYYY-MM-DD ────────────────────────────────────────
function toDateStr(date: Date): string {
  return date.toISOString().split("T")[0];
}

export class ModuleSessionRepository {

  // 1. Generate sesi otomatis berdasarkan recurringDay + totalSessions
  async generateSessions(moduleId: string) {
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!module) throw new Error("Modul tidak ditemukan");
    if (!module.recurringDay) throw new Error("recurringDay belum diset");
    if (!module.recurringTime) throw new Error("recurringTime belum diset");
    if (!module.totalSessions) throw new Error("totalSessions belum diset");

    // Hapus sesi lama kalau ada
    await prisma.moduleSession.deleteMany({ where: { moduleId } });

    const totalSessions = module.totalSessions;
    const recurringDay = module.recurringDay.toUpperCase();
    const startTime = module.recurringTime;

    // Fetch tanggal merah untuk tahun ini dan tahun depan
    const currentYear = new Date().getFullYear();
    const [holidays1, holidays2] = await Promise.all([
      getHolidays(currentYear),
      getHolidays(currentYear + 1),
    ]);
    const holidays = new Set([...holidays1, ...holidays2]);

    // Mulai dari scheduleDate modul, atau hari ini kalau tidak ada
    let cursor = module.scheduleDate
      ? new Date(module.scheduleDate)
      : new Date();

    // Set jam ke 00:00:00 untuk perbandingan tanggal
    cursor.setHours(0, 0, 0, 0);

    const sessions = [];
    let sessionOrder = 1;
    let attempts = 0;
    const MAX_ATTEMPTS = totalSessions * 10; // safety limit

    while (sessions.length < totalSessions && attempts < MAX_ATTEMPTS) {
      attempts++;

      const dateStr = toDateStr(cursor);
      const isOnTargetDay = isTargetDay(cursor, recurringDay);
      const isWknd = isWeekend(cursor);
      const isHoliday = holidays.has(dateStr);

      if (isOnTargetDay && !isWknd && !isHoliday) {
        // ✅ Tanggal valid — buat sesi
        const sessionDate = new Date(cursor);
        const [hour, minute] = startTime.split(":").map(Number);
        sessionDate.setHours(hour, minute, 0, 0);

        sessions.push({
          moduleId,
          sessionDate,
          startTime,
          order: sessionOrder++,
          isHoliday: false,
          isCancelled: false,
        });
      } else if (isOnTargetDay && (isWknd || isHoliday)) {
        // ⚠️ Hari target tapi libur — skip, catat sebagai info
        console.log(`⏭️ Skip tanggal merah/weekend: ${dateStr}`);
      }

      // Maju 1 hari
      cursor.setDate(cursor.getDate() + 1);
    }

    // Simpan semua sesi ke DB
    const created = await prisma.moduleSession.createMany({
      data: sessions,
    });

    return { created: created.count, sessions };
  }

  // 2. Get semua sesi per modul
  async getSessionsByModuleId(moduleId: string) {
    return await prisma.moduleSession.findMany({
      where: { moduleId },
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
        _count: { select: { attendances: true } },
      },
    });
  }

  // 3. Get sesi by id
  async getSessionById(sessionId: string) {
    return await prisma.moduleSession.findUnique({
      where: { id: sessionId },
      include: {
        module: { select: { id: true, title: true, latitude: true, longitude: true, maxParticipant: true } },
        attendances: {
          include: {
            enrollment: {
              include: {
                student: {
                  include: {
                    user: { select: { id: true, fullName: true, email: true, no_handphone: true } },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  // 4. Cancel sesi
  async cancelSession(sessionId: string) {
    return await prisma.moduleSession.update({
      where: { id: sessionId },
      data: { isCancelled: true },
    });
  }

  // 5. Restore sesi yang dibatalkan
  async restoreSession(sessionId: string) {
    return await prisma.moduleSession.update({
      where: { id: sessionId },
      data: { isCancelled: false },
    });
  }

  // 6. Get sesi yang akan datang (untuk cron bot)
  // Window: sesi yang dimulai antara 5 menit lalu dan 5 menit ke depan
  // Toleransi ini memastikan notifikasi tetap terkirim jika cron sedikit terlambat
  async getUpcomingSessions() {
    const now = new Date();
    const windowStart = new Date(now.getTime() - 5 * 60 * 1000);
    const windowEnd   = new Date(now.getTime() + 5 * 60 * 1000);

    return await prisma.moduleSession.findMany({
      where: {
        isCancelled: false,
        isHoliday: false,
        sessionDate: { gte: windowStart, lte: windowEnd },
      },
      include: {
        module: {
          select: {
            id: true,
            title: true,
            latitude: true,
            longitude: true,
            maxParticipant: true,
            status: true,
            program: {
              include: {
                enrollments: {
                  where: { status: "ACTIVE" },
                  include: {
                    student: {
                      include: {
                        user: { select: { fullName: true, no_handphone: true } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  // 7. Upsert session attendance
  async upsertSessionAttendance(sessionId: string, enrollmentId: string, data: any) {
    return await prisma.sessionAttendance.upsert({
      where: { sessionId_enrollmentId: { sessionId, enrollmentId } },
      create: { sessionId, enrollmentId, ...data },
      update: data,
    });
  }

  // 8. Update session attendance (mark hadir)
  async markPresent(sessionId: string, enrollmentId: string) {
    return await prisma.sessionAttendance.update({
      where: { sessionId_enrollmentId: { sessionId, enrollmentId } },
      data: { isPresent: true, checkedInAt: new Date() },
    });
  }
}