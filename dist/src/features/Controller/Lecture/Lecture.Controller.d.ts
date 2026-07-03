import { Request, Response } from "express";
export declare class LectureController {
    private lectureService;
    getAllLectures: (req: Request, res: Response) => Promise<void>;
    getLectureById: (req: Request, res: Response) => Promise<void>;
    getLectureByUserId: (req: Request, res: Response) => Promise<void>;
    getMyProfile: (req: any, res: Response) => Promise<void>;
    createLecture: (req: Request, res: Response) => Promise<void>;
    updateLecture: (req: Request, res: Response) => Promise<void>;
    updateMyProfile: (req: any, res: Response) => Promise<void>;
    deleteLecture: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=Lecture.Controller.d.ts.map