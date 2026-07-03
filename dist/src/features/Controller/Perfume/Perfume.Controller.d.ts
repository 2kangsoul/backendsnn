import { Request, Response } from "express";
export declare class PerfumeController {
    private perfumeService;
    getAllPerfumes: (req: Request, res: Response) => Promise<void>;
    getTop10ByCategory: (req: Request, res: Response) => Promise<void>;
    getAllCategories: (req: Request, res: Response) => Promise<void>;
    getPerfumeById: (req: Request, res: Response) => Promise<void>;
    getPerfumesByNote: (req: Request, res: Response) => Promise<void>;
    createPerfume: (req: Request, res: Response) => Promise<void>;
    likePerfume: (req: Request, res: Response) => Promise<void>;
    checkUserLike: (req: Request, res: Response) => Promise<void>;
    deletePerfume: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=Perfume.Controller.d.ts.map