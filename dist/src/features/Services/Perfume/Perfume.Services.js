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
exports.PerfumeService = void 0;
const Perfume_Repositories_1 = require("./../../Repositories/Perfume/Perfume.Repositories");
class PerfumeService {
    constructor() {
        this.perfumeRepository = new Perfume_Repositories_1.PerfumeRepository();
    }
    getAllPerfumes() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.perfumeRepository.getAllPerfumes();
        });
    }
    getTop10ByCategory(category) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.perfumeRepository.getTop10ByCategory(category);
        });
    }
    getAllCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.perfumeRepository.getAllCategories();
        });
    }
    getPerfumeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.perfumeRepository.getPerfumeById(id);
        });
    }
    // ✅ FUNGSI BARU DITAMBAHKAN DI SINI
    getPerfumesByNote(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.perfumeRepository.getPerfumesByNote(slug);
        });
    }
    createPerfume(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.perfumeRepository.createPerfume(data);
        });
    }
    likePerfume(perfumeId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.perfumeRepository.likePerfume(perfumeId, userId);
        });
    }
    checkUserLike(perfumeId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.perfumeRepository.checkUserLike(perfumeId, userId);
        });
    }
    deletePerfume(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.perfumeRepository.deletePerfume(id);
        });
    }
}
exports.PerfumeService = PerfumeService;
//# sourceMappingURL=Perfume.Services.js.map