import { Request, Response } from "express";
export declare class ProgramController {
    private programService;
    getAllPrograms: (req: Request, res: Response) => Promise<void>;
    getProgramBySlug: (req: Request, res: Response) => Promise<void>;
    getProgramById: (req: Request, res: Response) => Promise<void>;
    getModulesByProgramId: (req: Request, res: Response) => Promise<void>;
    getProgramsByLevel: (req: Request, res: Response) => Promise<void>;
    updateProgram: (req: Request, res: Response) => Promise<void>;
    getEnrollmentsByProgramId: (req: Request, res: Response) => Promise<void>;
    enrollStudent: (req: Request, res: Response) => Promise<void>;
    dropStudent: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=Program.Controller.d.ts.map