"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Perfume_Controller_1 = require("../../Controller/Perfume/Perfume.Controller");
const verifyToken_1 = require("../../../Middleware/verifyToken");
const router = (0, express_1.Router)();
const perfumeController = new Perfume_Controller_1.PerfumeController();
router.get("/", perfumeController.getAllPerfumes);
router.get("/categories", perfumeController.getAllCategories);
router.get("/category/:category", perfumeController.getTop10ByCategory);
// ✅ RUTE BARU DITAMBAHKAN DI SINI (Harus di atas /:id)
router.get("/notes/:slug", perfumeController.getPerfumesByNote);
router.get("/:id", perfumeController.getPerfumeById);
router.post("/", perfumeController.createPerfume);
router.post("/:id/like", verifyToken_1.verifyToken, perfumeController.likePerfume);
router.get("/:id/liked", verifyToken_1.verifyToken, perfumeController.checkUserLike);
router.delete("/:id", perfumeController.deletePerfume);
exports.default = router;
//# sourceMappingURL=Perfume.Routes.js.map