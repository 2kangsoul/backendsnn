import { Router } from "express";
import { ProgramController } from "../../Controller/Program/Program.Controller";
import { verifyToken } from "../../../Middleware/verifyToken";

const router = Router();
const programController = new ProgramController();

router.get("/", programController.getAllPrograms);
router.get("/level/:level", programController.getProgramsByLevel);
router.get("/slug/:slug", programController.getProgramBySlug);
router.get("/:id", programController.getProgramById);
router.get("/:id/modules", programController.getModulesByProgramId);
router.get("/:id/enrollments", verifyToken, programController.getEnrollmentsByProgramId);
router.post("/:id/enrollments", verifyToken, programController.enrollStudent);   // ← enroll
router.delete("/:id/enrollments", verifyToken, programController.dropStudent);   // ← drop
router.put("/:id", verifyToken, programController.updateProgram);

export default router;