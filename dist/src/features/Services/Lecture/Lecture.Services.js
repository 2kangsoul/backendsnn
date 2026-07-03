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
exports.LectureService = void 0;
const Lecture_Repositories_1 = require("../../Repositories/Lecture/Lecture.Repositories");
class LectureService {
    constructor() {
        this.lectureRepository = new Lecture_Repositories_1.LectureRepository();
    }
    getAllLectures() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.lectureRepository.getAllLectures();
        });
    }
    getLectureById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.lectureRepository.getLectureById(id);
        });
    }
    getLectureByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.lectureRepository.getLectureByUserId(userId);
        });
    }
    getLectureByUserIdIncludeDeleted(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.lectureRepository.getLectureByUserIdIncludeDeleted(userId);
        });
    }
    createLecture(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.lectureRepository.createLecture(data);
        });
    }
    updateLecture(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.lectureRepository.updateLecture(id, data);
        });
    }
    deleteLecture(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.lectureRepository.deleteLecture(id);
        });
    }
}
exports.LectureService = LectureService;
//# sourceMappingURL=Lecture.Services.js.map