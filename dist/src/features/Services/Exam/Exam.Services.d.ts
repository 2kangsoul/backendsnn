export declare class ExamService {
    private repo;
    createExam(moduleId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ExamStatus;
        moduleId: string;
        duration: number;
        passingScore: number;
        maxAttempts: number;
        startAt: Date | null;
        endAt: Date | null;
        showResult: boolean;
    }>;
    getExamsByModuleId(moduleId: string): Promise<({
        _count: {
            questions: number;
            submissions: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ExamStatus;
        moduleId: string;
        duration: number;
        passingScore: number;
        maxAttempts: number;
        startAt: Date | null;
        endAt: Date | null;
        showResult: boolean;
    })[]>;
    getExamById(examId: string): Promise<({
        _count: {
            submissions: number;
        };
        questions: ({
            options: {
                id: string;
                order: number;
                text: string;
                isCorrect: boolean;
                questionId: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.QuestionType;
            order: number;
            text: string;
            points: number;
            explanation: string | null;
            examId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ExamStatus;
        moduleId: string;
        duration: number;
        passingScore: number;
        maxAttempts: number;
        startAt: Date | null;
        endAt: Date | null;
        showResult: boolean;
    }) | null>;
    getExamForStudent(examId: string, enrollmentId: string): Promise<{
        attemptCount: number;
        canAttempt: boolean;
        questions: ({
            options: {
                id: string;
                order: number;
                text: string;
            }[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.QuestionType;
            order: number;
            text: string;
            points: number;
            explanation: string | null;
            examId: string;
        })[];
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ExamStatus;
        moduleId: string;
        duration: number;
        passingScore: number;
        maxAttempts: number;
        startAt: Date | null;
        endAt: Date | null;
        showResult: boolean;
    } | null>;
    updateExam(examId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ExamStatus;
        moduleId: string;
        duration: number;
        passingScore: number;
        maxAttempts: number;
        startAt: Date | null;
        endAt: Date | null;
        showResult: boolean;
    }>;
    deleteExam(examId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        title: string;
        description: string | null;
        status: import(".prisma/client").$Enums.ExamStatus;
        moduleId: string;
        duration: number;
        passingScore: number;
        maxAttempts: number;
        startAt: Date | null;
        endAt: Date | null;
        showResult: boolean;
    }>;
    createQuestion(examId: string, data: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.QuestionType;
        order: number;
        text: string;
        points: number;
        explanation: string | null;
        examId: string;
    }>;
    updateQuestion(questionId: string, data: any): Promise<({
        options: {
            id: string;
            order: number;
            text: string;
            isCorrect: boolean;
            questionId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.QuestionType;
        order: number;
        text: string;
        points: number;
        explanation: string | null;
        examId: string;
    }) | null>;
    deleteQuestion(questionId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.QuestionType;
        order: number;
        text: string;
        points: number;
        explanation: string | null;
        examId: string;
    }>;
    startExam(examId: string, enrollmentId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        enrollmentId: string;
        examId: string;
        score: number | null;
        isPassed: boolean | null;
        startedAt: Date;
        submittedAt: Date | null;
        attemptNo: number;
        gradedAt: Date | null;
        feedback: string | null;
    }>;
    submitExam(submissionId: string, answers: any[]): Promise<{
        submission: {
            answers: ({
                question: {
                    type: import(".prisma/client").$Enums.QuestionType;
                    text: string;
                    points: number;
                    explanation: string | null;
                };
                selectedOption: {
                    text: string;
                    isCorrect: boolean;
                } | null;
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                isCorrect: boolean | null;
                questionId: string;
                answerText: string | null;
                pointsEarned: number | null;
                submissionId: string;
                selectedOptionId: string | null;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            enrollmentId: string;
            examId: string;
            score: number | null;
            isPassed: boolean | null;
            startedAt: Date;
            submittedAt: Date | null;
            attemptNo: number;
            gradedAt: Date | null;
            feedback: string | null;
        };
        score: number;
        isPassed: boolean | null;
        hasEssay: boolean;
    }>;
    getSubmissionsByEnrollment(enrollmentId: string, examId?: string): Promise<({
        exam: {
            id: string;
            title: string;
            passingScore: number;
            showResult: boolean;
        };
        answers: ({
            question: {
                type: import(".prisma/client").$Enums.QuestionType;
                text: string;
                points: number;
                explanation: string | null;
            };
            selectedOption: {
                text: string;
                isCorrect: boolean;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isCorrect: boolean | null;
            questionId: string;
            answerText: string | null;
            pointsEarned: number | null;
            submissionId: string;
            selectedOptionId: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        enrollmentId: string;
        examId: string;
        score: number | null;
        isPassed: boolean | null;
        startedAt: Date;
        submittedAt: Date | null;
        attemptNo: number;
        gradedAt: Date | null;
        feedback: string | null;
    })[]>;
    gradeEssay(submissionId: string, grades: any[]): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        enrollmentId: string;
        examId: string;
        score: number | null;
        isPassed: boolean | null;
        startedAt: Date;
        submittedAt: Date | null;
        attemptNo: number;
        gradedAt: Date | null;
        feedback: string | null;
    }>;
    getSubmissionsByExam(examId: string): Promise<({
        enrollment: {
            student: {
                user: {
                    id: string;
                    email: string;
                    fullName: string;
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
        enrollmentId: string;
        examId: string;
        score: number | null;
        isPassed: boolean | null;
        startedAt: Date;
        submittedAt: Date | null;
        attemptNo: number;
        gradedAt: Date | null;
        feedback: string | null;
    })[]>;
    getSubmissionById(submissionId: string): Promise<({
        exam: {
            id: string;
            title: string;
            passingScore: number;
            showResult: boolean;
        };
        answers: ({
            question: {
                type: import(".prisma/client").$Enums.QuestionType;
                text: string;
                points: number;
                explanation: string | null;
            };
            selectedOption: {
                text: string;
                isCorrect: boolean;
            } | null;
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            isCorrect: boolean | null;
            questionId: string;
            answerText: string | null;
            pointsEarned: number | null;
            submissionId: string;
            selectedOptionId: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        enrollmentId: string;
        examId: string;
        score: number | null;
        isPassed: boolean | null;
        startedAt: Date;
        submittedAt: Date | null;
        attemptNo: number;
        gradedAt: Date | null;
        feedback: string | null;
    }) | null>;
}
//# sourceMappingURL=Exam.Services.d.ts.map