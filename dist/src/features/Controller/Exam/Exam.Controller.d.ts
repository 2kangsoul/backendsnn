import { Request, Response } from "express";
export declare class ExamController {
    private service;
    createExam: (req: Request, res: Response) => Promise<void>;
    getExamsByModule: (req: Request, res: Response) => Promise<void>;
    getExamById: (req: Request, res: Response) => Promise<void>;
    updateExam: (req: Request, res: Response) => Promise<void>;
    deleteExam: (req: Request, res: Response) => Promise<void>;
    createQuestion: (req: Request, res: Response) => Promise<void>;
    updateQuestion: (req: Request, res: Response) => Promise<void>;
    deleteQuestion: (req: Request, res: Response) => Promise<void>;
    getSubmissionsByExam: (req: Request, res: Response) => Promise<void>;
    gradeEssay: (req: Request, res: Response) => Promise<void>;
    getExamForStudent: (req: Request, res: Response) => Promise<void>;
    startExam: (req: Request, res: Response) => Promise<void>;
    submitExam: (req: Request, res: Response) => Promise<void>;
    getMySubmissions: (req: Request, res: Response) => Promise<void>;
    getSubmissionById: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=Exam.Controller.d.ts.map