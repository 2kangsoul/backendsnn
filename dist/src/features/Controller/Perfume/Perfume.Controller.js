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
exports.PerfumeController = void 0;
const Perfume_Services_1 = require("../../Services/Perfume/Perfume.Services");
class PerfumeController {
    constructor() {
        this.perfumeService = new Perfume_Services_1.PerfumeService();
        this.getAllPerfumes = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.perfumeService.getAllPerfumes();
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error getAllPerfumes:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        this.getTop10ByCategory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const category = req.params.category;
                const data = yield this.perfumeService.getTop10ByCategory(category);
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error getTop10ByCategory:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        this.getAllCategories = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.perfumeService.getAllCategories();
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error getAllCategories:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        this.getPerfumeById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const data = yield this.perfumeService.getPerfumeById(id);
                if (!data) {
                    res.status(404).json({ success: false, message: "Perfume not found" });
                    return;
                }
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error getPerfumeById:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        // ✅ FUNGSI BARU DITAMBAHKAN DI SINI
        this.getPerfumesByNote = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const slug = req.params.slug;
                const data = yield this.perfumeService.getPerfumesByNote(slug);
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error getPerfumesByNote:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        this.createPerfume = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.perfumeService.createPerfume(req.body);
                res.status(201).json({ success: true, data });
            }
            catch (error) {
                console.error("Error createPerfume:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        this.likePerfume = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const id = req.params.id;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(401).json({ success: false, message: "Unauthorized" });
                    return;
                }
                const data = yield this.perfumeService.likePerfume(id, userId);
                res.status(200).json({ success: true, data });
            }
            catch (error) {
                console.error("Error likePerfume:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        this.checkUserLike = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const id = req.params.id;
                const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    res.status(401).json({ success: false, message: "Unauthorized" });
                    return;
                }
                const liked = yield this.perfumeService.checkUserLike(id, userId);
                res.status(200).json({ success: true, data: { liked } });
            }
            catch (error) {
                console.error("Error checkUserLike:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
        this.deletePerfume = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                yield this.perfumeService.deletePerfume(id);
                res.status(200).json({ success: true, message: "Perfume deleted" });
            }
            catch (error) {
                console.error("Error deletePerfume:", error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
}
exports.PerfumeController = PerfumeController;
//# sourceMappingURL=Perfume.Controller.js.map