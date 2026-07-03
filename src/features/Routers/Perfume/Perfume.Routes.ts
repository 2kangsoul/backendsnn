import { Router } from "express";
import { PerfumeController } from "../../Controller/Perfume/Perfume.Controller";
import { verifyToken } from "../../../Middleware/verifyToken";

const router = Router();
const perfumeController = new PerfumeController();

router.get("/", perfumeController.getAllPerfumes);
router.get("/categories", perfumeController.getAllCategories);
router.get("/category/:category", perfumeController.getTop10ByCategory);

// ✅ RUTE BARU DITAMBAHKAN DI SINI (Harus di atas /:id)
router.get("/notes/:slug", perfumeController.getPerfumesByNote);

router.get("/:id", perfumeController.getPerfumeById);
router.post("/", perfumeController.createPerfume);
router.post("/:id/like", verifyToken, perfumeController.likePerfume);
router.get("/:id/liked", verifyToken, perfumeController.checkUserLike);
router.delete("/:id", perfumeController.deletePerfume);

export default router;
