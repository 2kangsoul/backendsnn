import { Router } from "express";
import { LectureController } from "../../Controller/Lecture/Lecture.Controller";
import { verifyToken } from "../../../Middleware/verifyToken";

const router = Router();
const lectureController = new LectureController();

// ── Public / Admin routes ──────────────────────────────────────────────────
router.get("/", lectureController.getAllLectures);
router.get("/:id", lectureController.getLectureById);
router.get("/user/:userId", lectureController.getLectureByUserId);

// ── Admin only: create & delete ────────────────────────────────────────────
router.post("/", verifyToken, lectureController.createLecture);
router.delete("/:id", verifyToken, lectureController.deleteLecture);

// ── Admin: update any lecture ──────────────────────────────────────────────
router.put("/:id", verifyToken, lectureController.updateLecture);

// ── Lecture: manage own profile ────────────────────────────────────────────
router.get("/me/profile", verifyToken, lectureController.getMyProfile);
router.put("/me/profile", verifyToken, lectureController.updateMyProfile);

export default router;