import { ProgramRepository } from "./../../Repositories/Program/Program.Repositories";

export class ProgramService {
  private programRepository = new ProgramRepository();

  async getAllPrograms() {
    return await this.programRepository.getAllPrograms();
  }

  async getProgramBySlug(slug: string) {
    return await this.programRepository.getProgramBySlug(slug);
  }

  async getProgramById(id: string) {
    return await this.programRepository.getProgramById(id);
  }

  async getModulesByProgramId(programId: string) {
    return await this.programRepository.getModulesByProgramId(programId);
  }

  async getProgramsByLevel(level: "BEGINNER" | "ADVANCED" | "EXPERT") {
    return await this.programRepository.getProgramsByLevel(level);
  }

  async updateProgram(id: string, data: any) {
    return await this.programRepository.updateProgram(id, data);
  }

  async getEnrollmentsByProgramId(programId: string) {
    return await this.programRepository.getEnrollmentsByProgramId(programId);
  }

  // ← tambah ini
  async enrollStudent(programId: string, studentId: string) {
    return await this.programRepository.enrollStudent(programId, studentId);
  }

  async dropStudent(programId: string, studentId: string) {
    return await this.programRepository.dropStudent(programId, studentId);
  }
}
