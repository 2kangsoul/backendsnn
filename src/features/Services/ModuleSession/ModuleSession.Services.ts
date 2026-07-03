// @ts-nocheck
import { ModuleSessionRepository } from "../../Repositories/ModuleSession/ModuleSession.Repositories";

export class ModuleSessionService {
  private repo = new ModuleSessionRepository();

  async generateSessions(moduleId: string) {
    return await this.repo.generateSessions(moduleId);
  }

  async getSessionsByModuleId(moduleId: string) {
    return await this.repo.getSessionsByModuleId(moduleId);
  }

  async getSessionById(sessionId: string) {
    return await this.repo.getSessionById(sessionId);
  }

  async cancelSession(sessionId: string) {
    return await this.repo.cancelSession(sessionId);
  }

  async restoreSession(sessionId: string) {
    return await this.repo.restoreSession(sessionId);
  }

  async upsertSessionAttendance(sessionId: string, enrollmentId: string, data: any) {
    return await this.repo.upsertSessionAttendance(sessionId, enrollmentId, data);
  }

  async markPresent(sessionId: string, enrollmentId: string) {
    return await this.repo.markPresent(sessionId, enrollmentId);
  }
}