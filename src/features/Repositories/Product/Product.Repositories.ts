import prisma from "../../../prisma";
// repositories/Product.Repositories.ts
import {
  CreateProductInput,
  UpdateProductInput,
} from "../../Models/Product/Product.models";


export const ProductRepository = {
  createProduct: async (data: CreateProductInput) => {
    return await prisma.product.create({
      data,
    });
  },

  getAllProducts: async () => {
    // Hanya mengambil product yang belum di-soft-delete
    return await prisma.product.findMany({
      where: { deletedAt: null },
    });
  },

  getProductById: async (id: string) => {
    return await prisma.product.findFirst({
      where: { id, deletedAt: null },
    });
  },

  updateProduct: async (id: string, data: UpdateProductInput) => {
    return await prisma.product.update({
      where: { id },
      data,
    });
  },

  deleteProduct: async (id: string) => {
    // Menggunakan Soft Delete (mengisi deletedAt dengan waktu sekarang)
    return await prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};
