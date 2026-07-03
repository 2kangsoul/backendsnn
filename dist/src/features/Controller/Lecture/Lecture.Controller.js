"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LectureController = void 0;
const Lecture_Services_1 = require("../../Services/Lecture/Lecture.Services");
class LectureController {
    constructor() {
        this.lectureService = new Lecture_Services_1.LectureService();
        this.getAllLectures = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.lectureService.getAllLectures();
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error getAllLectures:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        this.getLectureById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const data = yield this.lectureService.getLectureById(id);
                if (!data) {
                    res.status(404).json({ success: false, message: "Lecture profile not found" });
                    return;
                }
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error getLectureById:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        this.getLectureByUserId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                const data = yield this.lectureService.getLectureByUserId(userId);
                if (!data) {
                    res.status(404).json({ success: false, message: "Lecture profile not found" });
                    return;
                }
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error getLectureByUserId:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        // Lecture bisa lihat profil sendiri
        this.getMyProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(401).json({ success: false, message: "Unauthorized" });
                    return;
                }
                const data = yield this.lectureService.getLectureByUserId(userId);
                if (!data) {
                    res.status(404).json({ success: false, message: "Lecture profile not found" });
                    return;
                }
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error getMyProfile:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        this.createLecture = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, lectureCode, bio, specialization } = req.body;
                if (!userId) {
                    res.status(400).json({ success: false, message: "userId wajib diisi" });
                    return;
                }
                // Cek apakah sudah ada (termasuk soft deleted)
                const existing = yield this.lectureService.getLectureByUserIdIncludeDeleted(userId);
                if (existing) {
                    // Restore + update
                    const data = yield this.lectureService.updateLecture(existing.id, {
                        lectureCode,
                        bio,
                        specialization,
                        deletedAt: null, // restore
                    });
                    res.status(200).json({ success: true, data });
                    return;
                }
                const data = yield this.lectureService.createLecture({ userId, lectureCode, bio, specialization });
                res.status(201).json({ success: true, data });
            }
            catch (error) {
                console.error("Error createLecture:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        this.updateLecture = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const { lectureCode, bio, specialization } = req.body;
                const data = yield this.lectureService.updateLecture(id, {
                    lectureCode,
                    bio,
                    specialization,
                });
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error updateLecture:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        // Lecture update profil sendiri
        this.updateMyProfile = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(401).json({ success: false, message: "Unauthorized" });
                    return;
                }
                const existing = yield this.lectureService.getLectureByUserId(userId);
                if (!existing) {
                    res.status(404).json({ success: false, message: "Lecture profile not found" });
                    return;
                }
                const { lectureCode, bio, specialization } = req.body;
                const data = yield this.lectureService.updateLecture(existing.id, {
                    lectureCode,
                    bio,
                    specialization,
                });
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error updateMyProfile:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        this.deleteLecture = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                yield this.lectureService.deleteLecture(id);
                res.status(200).json({ success: true, message: "Lecture profile deleted" });
            }
            catch (error) {
                console.error("Error deleteLecture:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
}
exports.LectureController = LectureController;
//# sourceMappingURL=Lecture.Controller.js.map