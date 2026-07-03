import { Request, Response } from "express";
export declare class ModuleSessionController {
    private service;
    generateSessions: (req: Request, res: Response) => Promise<void>;
    getSessionsByModuleId: (req: Request, res: Response) => Promise<void>;
    getSessionById: (req: Request, res: Response) => Promise<void>;
    cancelSession: (req: Request, res: Response) => Promise<void>;
    restoreSession: (req: Request, res: Response) => Promise<void>;
    markPresent: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=ModuleSession.Controller.d.ts.map