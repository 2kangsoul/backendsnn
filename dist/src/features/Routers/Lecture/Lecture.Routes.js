"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Lecture_Controller_1 = require("../../Controller/Lecture/Lecture.Controller");
const verifyToken_1 = require("../../../Middleware/verifyToken");
const router = (0, express_1.Router)();
const lectureController = new Lecture_Controller_1.LectureController();
// ── Public / Admin routes ──────────────────────────────────────────────────
router.get("/", lectureController.getAllLectures);
router.get("/:id", lectureController.getLectureById);
router.get("/user/:userId", lectureController.getLectureByUserId);
// ── Admin only: create & delete ────────────────────────────────────────────
router.post("/", verifyToken_1.verifyToken, lectureController.createLecture);
router.delete("/:id", verifyToken_1.verifyToken, lectureController.deleteLecture);
// ── Admin: update any lecture ──────────────────────────────────────────────
router.put("/:id", verifyToken_1.verifyToken, lectureController.updateLecture);
// ── Lecture: manage own profile ────────────────────────────────────────────
router.get("/me/profile", verifyToken_1.verifyToken, lectureController.getMyProfile);
router.put("/me/profile", verifyToken_1.verifyToken, lectureController.updateMyProfile);
exports.default = router;
//# sourceMappingURL=Lecture.Routes.js.map