// services/Product.Services.ts
import { ProductRepository } from "../../Repositories/Product/Product.Repositories";
import {
  CreateProductInput,
  UpdateProductInput,
} from "../../Models/Product/Product.models";

export const ProductService = {
  createProduct: async (data: CreateProductInput) => {
    if (!data.name) {
      throw new Error("Nama produk wajib diisi!");
    }
    return await ProductRepository.createProduct(data);
  },

  getAllProducts: async () => {
    return await ProductRepository.getAllProducts();
  },

  getProductById: async (id: string) => {
    const product = await ProductRepository.getProductById(id);
    if (!product) {
      throw new Error("Product tidak ditemukan!");
    }
    return product;
  },

  updateProduct: async (id: string, data: UpdateProductInput) => {
    // Cek apakah produk ada
    await ProductService.getProductById(id);
    return await ProductRepository.updateProduct(id, data);
  },

  deleteProduct: async (id: string) => {
    // Cek apakah produk ada
    await ProductService.getProductById(id);
    return await ProductRepository.deleteProduct(id);
  },
};
