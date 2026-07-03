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
exports.StudentService = void 0;
// @ts-nocheck
const Student_Repositories_1 = require("../../Repositories/Student/Student.Repositories");
class StudentService {
    constructor() {
        this.studentRepository = new Student_Repositories_1.StudentRepository();
    }
    getAllStudents() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.studentRepository.getAllStudents();
        });
    }
    getStudentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.studentRepository.getStudentById(id);
        });
    }
    getStudentByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.studentRepository.getStudentByUserId(userId);
        });
    }
    getStudentsNotEnrolled(programId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.studentRepository.getStudentsNotEnrolled(programId);
        });
    }
    createStudent(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.studentRepository.createStudent(userId, data);
        });
    }
    deleteStudent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.studentRepository.deleteStudent(id);
        });
    }
    getEnrollmentsByStudentId(studentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.studentRepository.getEnrollmentsByStudentId(studentId);
        });
    }
}
exports.StudentService = StudentService;
//# sourceMappingURL=Student.Services.js.map