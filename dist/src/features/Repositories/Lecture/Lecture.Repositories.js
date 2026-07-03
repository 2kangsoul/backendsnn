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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LectureRepository = void 0;
const prisma_1 = __importDefault(require("../../../prisma"));
class LectureRepository {
    // 1. Get all lecture profiles
    getAllLectures() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.lectureProfile.findMany({
                where: { deletedAt: null },
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            profilePic: true,
                        },
                    },
                    program: {
                        select: {
                            id: true,
                            title: true,
                            level: true,
                            slug: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
            });
        });
    }
    // 2. Get lecture profile by id
    getLectureById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.lectureProfile.findUnique({
                where: { id },
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            profilePic: true,
                        },
                    },
                    program: {
                        select: {
                            id: true,
                            title: true,
                            level: true,
                            slug: true,
                        },
                    },
                },
            });
        });
    }
    // 3. Get lecture profile by userId
    getLectureByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.lectureProfile.findFirst({
                where: { userId },
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            profilePic: true,
                        },
                    },
                    program: {
                        select: {
                            id: true,
                            title: true,
                            level: true,
                            slug: true,
                        },
                    },
                },
            });
        });
    }
    // 4. Create lecture profile
    createLecture(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const lectureCode = data.lectureCode ||
                `SNN-Olfactory-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            return yield prisma_1.default.lectureProfile.create({
                data: Object.assign(Object.assign({}, data), { lectureCode }),
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            profilePic: true,
                        },
                    },
                },
            });
        });
    }
    // 5. Update lecture profile
    updateLecture(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.lectureProfile.update({
                where: { id },
                data,
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                            profilePic: true,
                        },
                    },
                    program: {
                        select: {
                            id: true,
                            title: true,
                            level: true,
                            slug: true,
                        },
                    },
                },
            });
        });
    }
    // 6. Soft delete lecture profile
    deleteLecture(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.lectureProfile.update({
                where: { id },
                data: { deletedAt: new Date() },
            });
        });
    }
    // 7. Get lecture by userId termasuk yang sudah dihapus
    getLectureByUserIdIncludeDeleted(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.lectureProfile.findFirst({
                where: { userId },
            });
        });
    }
}
exports.LectureRepository = LectureRepository;
//# sourceMappingURL=Lecture.Repositories.js.map