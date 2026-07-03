import { Router } from "express";
import { StudentController } from "../../Controller/Student/Student.Controller";
import { verifyToken } from "../../../Middleware/verifyToken";

const router = Router();
const studentController = new StudentController();

// Get all students
router.get("/", verifyToken, studentController.getAllStudents);

// Get students not enrolled in a program
router.get("/not-enrolled/:programId", verifyToken, studentController.getStudentsNotEnrolled);

// Get student by userId
router.get("/user/:userId", verifyToken, studentController.getStudentByUserId);

// Get enrollments by student id
router.get("/:id/enrollments", verifyToken, studentController.getEnrollmentsByStudentId);

// Get student by id
router.get("/:id", verifyToken, studentController.getStudentById);

// Create student profile (admin only)
router.post("/", verifyToken, studentController.createStudent);

// Delete student profile (admin only)
router.delete("/:id", verifyToken, studentController.deleteStudent);

export default router;
