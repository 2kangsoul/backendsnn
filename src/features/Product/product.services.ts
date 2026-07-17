import { NotFoundError } from "../../error/not-found-error";
import prisma from "../../prisma";
import {
  createProductsInput,
  deleteProductsInput,
  getProductByIdInput,
  getProductsInput,
  updateProductsInput,
} from "./product.validation";
import { removeUndefined } from "../../helper/removeUndefined/removeUndefined";
import { uploadCloudinary } from "../../helper/cloudinary/cloudinary";
import { Prisma } from "@prisma/client";
export class ProductsService {
  static async CreateProducts({ body, file }: createProductsInput) {
    const cloudinaryFile = await uploadCloudinary(file.buffer);
    const product = await prisma.product.create({
      data: {
        ...body,
        imageUrl: cloudinaryFile.secure_url,
      },
    });
    return product;
  }
  static async getProducts({ query }: getProductsInput) {
    const skip = (query.page - 1) * query.limit;
    const limit = query.limit;
    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
    };
    if (query.search) {
      where.OR = [
        {
          name: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          brand: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          type: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.search,
            mode: "insensitive",
          },
        },
      ];
    }
    if (query.brand) {
      where.brand = {
        equals: query.brand,
        mode: "insensitive",
      };
    }
    if (query.type) {
      where.type = {
        equals: query.type,
        mode: "insensitive",
      };
    }
    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {
        ...(query.minPrice !== undefined && { gte: query.minPrice }),
        ...(query.maxPrice !== undefined && { lte: query.maxPrice }),
      };
    }
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [query.sortBy]: query.order,
        },
      }),
      prisma.product.count({ where }),
    ]);
    return {
      data: products,
      meta: {
        page: query.page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  static async getProductById({ params }: getProductByIdInput) {
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: params.id,
        deletedAt: null,
      },
    });
    if (!existingProduct) throw new NotFoundError("Product is not available");
    return existingProduct;
  }
  static async updateProducts({ params, body, file }: updateProductsInput) {
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: params.id,
        deletedAt: null,
      },
    });
    if (!existingProduct) throw new NotFoundError("Products is not available");
    let imageUrl: string | undefined;
    if (file) {
      const cloudinaryUpdate = await uploadCloudinary(file.buffer);
      imageUrl = cloudinaryUpdate.secure_url;
    }
    const updateProduct = await prisma.product.update({
      where: {
        id: params.id,
      },
      data: {
        ...(removeUndefined(body) as Prisma.ProductUpdateInput),
        ...(imageUrl && { imageUrl }),
      },
    });
    return updateProduct;
  }
  static async deleteProducts({ params }: deleteProductsInput) {
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: params.id,
        deletedAt: null,
      },
    });
    if (!existingProduct) throw new NotFoundError("Product is not available");
    const deleteProduct = await prisma.product.update({
      where: {
        id: existingProduct.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    return deleteProduct;
  }
}
