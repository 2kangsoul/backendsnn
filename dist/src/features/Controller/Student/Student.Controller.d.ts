import { Request, Response } from "express";
export declare class StudentController {
    private studentService;
    getAllStudents: (req: Request, res: Response) => Promise<void>;
    getStudentById: (req: Request, res: Response) => Promise<void>;
    getStudentByUserId: (req: Request, res: Response) => Promise<void>;
    getStudentsNotEnrolled: (req: Request, res: Response) => Promise<void>;
    createStudent: (req: Request, res: Response) => Promise<void>;
    deleteStudent: (req: Request, res: Response) => Promise<void>;
    getEnrollmentsByStudentId: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=Student.Controller.d.ts.map