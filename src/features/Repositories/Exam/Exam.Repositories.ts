// @ts-nocheck
import prisma from "../../../prisma";


export class ExamRepository {

  // ── Lecture: CRUD Exam ────────────────────────────────────────────────────
  async createExam(moduleId: string, data: any) {
    return await prisma.exam.create({
      data: {
        moduleId,
        title:       data.title,
        description: data.description || null,
        duration:    data.duration    || 60,
        passingScore: data.passingScore || 70,
        maxAttempts: data.maxAttempts  || 1,
        startAt:     data.startAt     || null,
        endAt:       data.endAt       || null,
        showResult:  data.showResult  ?? true,
        status:      "DRAFT",
      },
    });
  }

  async getExamsByModuleId(moduleId: string) {
    return await prisma.exam.findMany({
      where: { moduleId, deletedAt: null },
      orderBy: { createdAt: "asc" },
      include: {
        _count: { select: { questions: true, submissions: true } },
      },
    });
  }

  async getExamById(examId: string) {
    return await prisma.exam.findUnique({
      where: { id: examId },
      include: {
        questions: {
          orderBy: { order: "asc" },
          include: { options: { orderBy: { order: "asc" } } },
        },
        _count: { select: { submissions: true } },
      },
    });
  }

  async getExamForStudent(examId: string, enrollmentId: string) {
    const exam = await prisma.exam.findUnique({
      where: { id: examId, status: "PUBLISHED" },
      include: {
        questions: {
          orderBy: { order: "asc" },
          include: {
            options: {
              orderBy: { order: "asc" },
              select: { id: true, text: true, order: true }, // hide isCorrect
            },
          },
        },
      },
    });

    if (!exam) return null;

    const attemptCount = await prisma.examSubmission.count({
      where: { examId, enrollmentId },
    });

    return { ...exam, attemptCount, canAttempt: attemptCount < exam.maxAttempts };
  }

  async updateExam(examId: string, data: any) {
    return await prisma.exam.update({
      where: { id: examId },
      data: {
        title:        data.title        ?? undefined,
        description:  data.description  ?? undefined,
        status:       data.status       ?? undefined,
        duration:     data.duration     ?? undefined,
        passingScore: data.passingScore ?? undefined,
        maxAttempts:  data.maxAttempts  ?? undefined,
        startAt:      data.startAt      ?? undefined,
        endAt:        data.endAt        ?? undefined,
        showResult:   data.showResult   ?? undefined,
      },
    });
  }

  async deleteExam(examId: string) {
    return await prisma.exam.update({
      where: { id: examId },
      data: { deletedAt: new Date() },
    });
  }

  // ── Lecture: CRUD Questions ───────────────────────────────────────────────
  async createQuestion(examId: string, data: any) {
    return await prisma.question.create({
      data: {
        examId,
        text:        data.text,
        type:        data.type        || "MULTIPLE_CHOICE",
        points:      data.points      || 10,
        order:       data.order       || 0,
        explanation: data.explanation || null,
        options: data.options?.length ? {
          create: data.options.map((opt: any, i: number) => ({
            text:      opt.text,
            isCorrect: opt.isCorrect || false,
            order:     i,
          })),
        } : undefined,
      },
      include: { options: { orderBy: { order: "asc" } } },
    });
  }

  async updateQuestion(questionId: string, data: any) {
    await prisma.question.update({
      where: { id: questionId },
      data: {
        text:        data.text        ?? undefined,
        points:      data.points      ?? undefined,
        order:       data.order       ?? undefined,
        explanation: data.explanation ?? undefined,
      },
    });

    if (data.options?.length) {
      await prisma.questionOption.deleteMany({ where: { questionId } });
      await prisma.questionOption.createMany({
        data: data.options.map((opt: any, i: number) => ({
          questionId,
          text:      opt.text,
          isCorrect: opt.isCorrect || false,
          order:     i,
        })),
      });
    }

    return await prisma.question.findUnique({
      where: { id: questionId },
      include: { options: { orderBy: { order: "asc" } } },
    });
  }

  async deleteQuestion(questionId: string) {
    await prisma.questionOption.deleteMany({ where: { questionId } });
    return await prisma.question.delete({ where: { id: questionId } });
  }

  // ── Student: Submission ───────────────────────────────────────────────────
  async startExam(examId: string, enrollmentId: string) {
    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      select: { maxAttempts: true, status: true, startAt: true, endAt: true },
    });

    if (!exam) throw new Error("Ujian tidak ditemukan");
    if (exam.status !== "PUBLISHED") throw new Error("Ujian belum tersedia");

    const now = new Date();
    if (exam.startAt && now < new Date(exam.startAt)) throw new Error("Ujian belum dimulai");
    if (exam.endAt && now > new Date(exam.endAt)) throw new Error("Ujian sudah ditutup");

    const attemptCount = await prisma.examSubmission.count({ where: { examId, enrollmentId } });
    if (attemptCount >= exam.maxAttempts) throw new Error(`Kamu sudah mencapai batas maksimum ${exam.maxAttempts}x percobaan`);

    return await prisma.examSubmission.create({
      data: { examId, enrollmentId, attemptNo: attemptCount + 1, startedAt: now },
    });
  }

  async submitExam(submissionId: string, answers: any[]) {
    const submission = await prisma.examSubmission.findUnique({
      where: { id: submissionId },
      include: {
        exam: {
          include: { questions: { include: { options: true } } },
        },
      },
    });

    if (!submission) throw new Error("Submission tidak ditemukan");
    if (submission.submittedAt) throw new Error("Ujian sudah di-submit");

    let totalPoints = 0;
    let earnedPoints = 0;
    const studentAnswers = [];

    for (const q of submission.exam.questions) {
      totalPoints += q.points;
      const userAnswer = answers.find((a: any) => a.questionId === q.id);

      if (q.type === "MULTIPLE_CHOICE" || q.type === "TRUE_FALSE") {
        const selectedOption = q.options.find((o: any) => o.id === userAnswer?.selectedOptionId);
        const isCorrect = selectedOption?.isCorrect || false;
        const pointsEarned = isCorrect ? q.points : 0;
        earnedPoints += pointsEarned;

        studentAnswers.push({
          submissionId,
          questionId:       q.id,
          selectedOptionId: userAnswer?.selectedOptionId || null,
          answerText:       null,
          isCorrect,
          pointsEarned,
        });
      } else if (q.type === "ESSAY") {
        studentAnswers.push({
          submissionId,
          questionId:       q.id,
          selectedOptionId: null,
          answerText:       userAnswer?.answerText || null,
          isCorrect:        null,
          pointsEarned:     null,
        });
      }
    }

    await prisma.studentAnswer.createMany({ data: studentAnswers });

    const hasEssay = submission.exam.questions.some((q: any) => q.type === "ESSAY");
    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const isPassed = hasEssay ? null : score >= submission.exam.passingScore;

    const updated = await prisma.examSubmission.update({
      where: { id: submissionId },
      data: {
        submittedAt: new Date(),
        score:       hasEssay ? null : score,
        isPassed,
        gradedAt:    hasEssay ? null : new Date(),
      },
      include: {
        answers: {
          include: {
            question: { select: { text: true, type: true, points: true, explanation: true } },
            selectedOption: { select: { text: true, isCorrect: true } },
          },
        },
      },
    });

    return { submission: updated, score, isPassed, hasEssay };
  }

  async getSubmissionsByEnrollment(enrollmentId: string, examId?: string) {
    return await prisma.examSubmission.findMany({
      where: { enrollmentId, ...(examId ? { examId } : {}) },
      orderBy: { createdAt: "desc" },
      include: {
        exam: { select: { id: true, title: true, passingScore: true, showResult: true } },
        answers: {
          include: {
            question: { select: { text: true, type: true, points: true, explanation: true } },
            selectedOption: { select: { text: true, isCorrect: true } },
          },
        },
      },
    });
  }

  async gradeEssay(submissionId: string, grades: Array<{ answerId: string; pointsEarned: number; isCorrect: boolean }>) {
    for (const grade of grades) {
      await prisma.studentAnswer.update({
        where: { id: grade.answerId },
        data: { pointsEarned: grade.pointsEarned, isCorrect: grade.isCorrect },
      });
    }

    const answers = await prisma.studentAnswer.findMany({ where: { submissionId } });
    const submission = await prisma.examSubmission.findUnique({
      where: { id: submissionId },
      include: { exam: { select: { passingScore: true, questions: { select: { points: true } } } } },
    });

    const totalPoints = submission.exam.questions.reduce((s: number, q: any) => s + q.points, 0);
    const earnedPoints = answers.reduce((s: number, a: any) => s + (a.pointsEarned || 0), 0);
    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const isPassed = score >= submission.exam.passingScore;

    return await prisma.examSubmission.update({
      where: { id: submissionId },
      data: { score, isPassed, gradedAt: new Date() },
    });
  }

  async getSubmissionsByExam(examId: string) {
    return await prisma.examSubmission.findMany({
      where: { examId },
      orderBy: { createdAt: "desc" },
      include: {
        enrollment: {
          include: {
            student: {
              include: { user: { select: { id: true, fullName: true, email: true } } },
            },
          },
        },
      },
    });
  }

  // ── BARU: Get submission by id ────────────────────────────────────────────
  async getSubmissionById(submissionId: string) {
    return await prisma.examSubmission.findUnique({
      where: { id: submissionId },
      include: {
        exam: { select: { id: true, title: true, passingScore: true, showResult: true } },
        answers: {
          include: {
            question: { select: { text: true, type: true, points: true, explanation: true } },
            selectedOption: { select: { text: true, isCorrect: true } },
          },
        },
      },
    });
  }
}
