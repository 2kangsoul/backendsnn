"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Student_Controller_1 = require("../../Controller/Student/Student.Controller");
const verifyToken_1 = require("../../../Middleware/verifyToken");
const router = (0, express_1.Router)();
const studentController = new Student_Controller_1.StudentController();
// Get all students
router.get("/", verifyToken_1.verifyToken, studentController.getAllStudents);
// Get students not enrolled in a program
router.get("/not-enrolled/:programId", verifyToken_1.verifyToken, studentController.getStudentsNotEnrolled);
// Get student by userId
router.get("/user/:userId", verifyToken_1.verifyToken, studentController.getStudentByUserId);
// Get enrollments by student id
router.get("/:id/enrollments", verifyToken_1.verifyToken, studentController.getEnrollmentsByStudentId);
// Get student by id
router.get("/:id", verifyToken_1.verifyToken, studentController.getStudentById);
// Create student profile (admin only)
router.post("/", verifyToken_1.verifyToken, studentController.createStudent);
// Delete student profile (admin only)
router.delete("/:id", verifyToken_1.verifyToken, studentController.deleteStudent);
exports.default = router;
//# sourceMappingURL=student.routes.js.map