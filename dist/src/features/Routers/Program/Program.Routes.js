"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Program_Controller_1 = require("../../Controller/Program/Program.Controller");
const verifyToken_1 = require("../../../Middleware/verifyToken");
const router = (0, express_1.Router)();
const programController = new Program_Controller_1.ProgramController();
router.get("/", programController.getAllPrograms);
router.get("/level/:level", programController.getProgramsByLevel);
router.get("/slug/:slug", programController.getProgramBySlug);
router.get("/:id", programController.getProgramById);
router.get("/:id/modules", programController.getModulesByProgramId);
router.get("/:id/enrollments", verifyToken_1.verifyToken, programController.getEnrollmentsByProgramId);
router.post("/:id/enrollments", verifyToken_1.verifyToken, programController.enrollStudent); // ← enroll
router.delete("/:id/enrollments", verifyToken_1.verifyToken, programController.dropStudent); // ← drop
router.put("/:id", verifyToken_1.verifyToken, programController.updateProgram);
exports.default = router;
//# sourceMappingURL=Program.Routes.js.map