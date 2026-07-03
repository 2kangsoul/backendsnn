// @ts-nocheck
import { StudentRepository } from "../../Repositories/Student/Student.Repositories";

export class StudentService {
  private studentRepository = new StudentRepository();

  async getAllStudents() {
    return await this.studentRepository.getAllStudents();
  }

  async getStudentById(id: string) {
    return await this.studentRepository.getStudentById(id);
  }

  async getStudentByUserId(userId: string) {
    return await this.studentRepository.getStudentByUserId(userId);
  }

  async getStudentsNotEnrolled(programId: string) {
    return await this.studentRepository.getStudentsNotEnrolled(programId);
  }

  async createStudent(userId: string, data: any) {
    return await this.studentRepository.createStudent(userId, data);
  }

  async deleteStudent(id: string) {
    return await this.studentRepository.deleteStudent(id);
  }

  async getEnrollmentsByStudentId(studentId: string) {
    return await this.studentRepository.getEnrollmentsByStudentId(studentId);
  }
}
