import { PerfumeRepository } from "./../../Repositories/Perfume/Perfume.Repositories";

export class PerfumeService {
  private perfumeRepository = new PerfumeRepository();

  async getAllPerfumes() {
    return await this.perfumeRepository.getAllPerfumes();
  }

  async getTop10ByCategory(category: string) {
    return await this.perfumeRepository.getTop10ByCategory(category);
  }

  async getAllCategories() {
    return await this.perfumeRepository.getAllCategories();
  }

  async getPerfumeById(id: string) {
    return await this.perfumeRepository.getPerfumeById(id);
  }

  // ✅ FUNGSI BARU DITAMBAHKAN DI SINI
  async getPerfumesByNote(slug: string) {
    return await this.perfumeRepository.getPerfumesByNote(slug);
  }

  async createPerfume(data: {
    name: string;
    brand: string;
    category: string;
    description?: string;
    imageUrl?: string;
    gender?: string;
    year?: number;
  }) {
    return await this.perfumeRepository.createPerfume(data);
  }

  async likePerfume(perfumeId: string, userId: string) {
    return await this.perfumeRepository.likePerfume(perfumeId, userId);
  }

  async checkUserLike(perfumeId: string, userId: string) {
    return await this.perfumeRepository.checkUserLike(perfumeId, userId);
  }

  async deletePerfume(id: string) {
    return await this.perfumeRepository.deletePerfume(id);
  }
}