import { LectureRepository } from "../../Repositories/Lecture/Lecture.Repositories";

export class LectureService {
  private lectureRepository = new LectureRepository();

  async getAllLectures() {
    return await this.lectureRepository.getAllLectures();
  }

  async getLectureById(id: string) {
    return await this.lectureRepository.getLectureById(id);
  }

  async getLectureByUserId(userId: string) {
    return await this.lectureRepository.getLectureByUserId(userId);
  }

  async getLectureByUserIdIncludeDeleted(userId: string) {
    return await this.lectureRepository.getLectureByUserIdIncludeDeleted(userId);
  }

  async createLecture(data: {
    userId: string;
    lectureCode?: string;
    bio?: string;
    specialization?: string;
  }) {
    return await this.lectureRepository.createLecture(data);
  }

  async updateLecture(
    id: string,
    data: {
      lectureCode?: string;
      bio?: string;
      specialization?: string;
      deletedAt?: Date | null;
    },
  ) {
    return await this.lectureRepository.updateLecture(id, data);
  }

  async deleteLecture(id: string) {
    return await this.lectureRepository.deleteLecture(id);
  }
}