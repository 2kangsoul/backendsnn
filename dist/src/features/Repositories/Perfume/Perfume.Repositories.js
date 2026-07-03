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
exports.PerfumeRepository = void 0;
const prisma_1 = __importDefault(require("../../../prisma"));
class PerfumeRepository {
    // 1. Get all perfumes
    getAllPerfumes() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.perfume.findMany({
                where: { deletedAt: null },
                orderBy: { totalLikes: "desc" },
                include: { _count: { select: { likes: true } } },
            });
        });
    }
    // 2. Get top 10 per category
    getTop10ByCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.perfume.findMany({
                where: { deletedAt: null, category },
                orderBy: { totalLikes: "desc" },
                take: 10,
                include: { _count: { select: { likes: true } } },
            });
        });
    }
    // 3. Get all categories
    getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.perfume.groupBy({
                by: ["category"],
                where: { deletedAt: null },
                _count: { category: true },
                orderBy: { category: "asc" },
            });
        });
    }
    // 4. Get perfume by id
    getPerfumeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.perfume.findUnique({
                where: { id },
                include: { _count: { select: { likes: true } } },
            });
        });
    }
    // 5. Create perfume (admin)
    createPerfume(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.perfume.create({ data });
        });
    }
    // 6. Like perfume
    likePerfume(perfumeId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield prisma_1.default.perfumeLike.findUnique({
                where: { perfumeId_userId: { perfumeId, userId } },
            });
            if (existing) {
                // Unlike
                yield prisma_1.default.perfumeLike.delete({
                    where: { perfumeId_userId: { perfumeId, userId } },
                });
                yield prisma_1.default.perfume.update({
                    where: { id: perfumeId },
                    data: { totalLikes: { decrement: 1 } },
                });
                return { liked: false };
            }
            else {
                // Like
                yield prisma_1.default.perfumeLike.create({
                    data: { perfumeId, userId },
                });
                yield prisma_1.default.perfume.update({
                    where: { id: perfumeId },
                    data: { totalLikes: { increment: 1 } },
                });
                return { liked: true };
            }
        });
    }
    // 7. Check if user already liked
    checkUserLike(perfumeId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield prisma_1.default.perfumeLike.findUnique({
                where: { perfumeId_userId: { perfumeId, userId } },
            });
            return !!existing;
        });
    }
    // 8. Delete perfume (admin)
    deletePerfume(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.perfume.update({
                where: { id },
                data: { deletedAt: new Date() },
            });
        });
    }
    // 9. Get perfumes by note (slug)
    getPerfumesByNote(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchKeyword = slug.replace(/-/g, ' ');
            return yield prisma_1.default.perfume.findMany({
                where: {
                    deletedAt: null,
                    description: { contains: searchKeyword, mode: 'insensitive' }
                },
                orderBy: { totalLikes: "desc" },
                include: { _count: { select: { likes: true } } },
            });
        });
    }
}
exports.PerfumeRepository = PerfumeRepository;
//# sourceMappingURL=Perfume.Repositories.js.map