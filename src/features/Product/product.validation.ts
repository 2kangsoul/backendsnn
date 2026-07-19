import { z } from "zod";
import { PRODUCT_SORT_BY, PRODUCT_SORT_ORDER } from "./constans";
export class ProductsValidation {
  static readonly createProdcuts = z.object({
    body: z.object({
      name: z.string().min(1, "Product name is required").max(250),
      brand: z.string().min(1, "Brand is required").max(250),
      type: z.string().min(1, "Product type is required").max(500),
      description: z.string().min(1, "Description is required").max(500),
      price: z.coerce.number().int().positive(),

      stock: z.coerce.number().int().min(0),
    }),
  });
  static readonly getProductByIdSchema = z.object({
    params: z.object({
      id: z.string().uuid("Invalid product id"),
    }),
  });
  static readonly updateProducts = z.object({
    params: z.object({
      id: z.string().uuid("Invalid product id"),
    }),
    body: z.object({
      name: z.string().min(1).max(250).optional(),
      brand: z.string().min(1).max(250).optional(),
      type: z.string().min(1).max(500).optional(),
      description: z.string().min(1).max(500).optional(),
      price: z.coerce.number().int().positive().optional(),
      stock: z.coerce.number().int().min(0).optional(),
    }),
  });
  static readonly deleteProducts = z.object({
    params: z.object({
      id: z.string().uuid("Invalid product id"),
    }),
  });
  static readonly getProdcuts = z.object({
    query: z.object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).default(10),
      search: z.preprocess(
        (val) => (val === "" ? undefined : val),
        z.string().trim().optional(),
      ),
      sortBy: z.enum(PRODUCT_SORT_BY).default("createdAt"),
      order: z.enum(PRODUCT_SORT_ORDER).default("desc"),
      brand: z.preprocess(
        (val) => (val === "" ? undefined : val),
        z.string().trim().optional(),
      ),
      type: z.preprocess(
        (val) => (val === "" ? undefined : val),
        z.string().trim().optional(),
      ),
      minPrice: z.coerce.number().int().optional(),
      maxPrice: z.coerce.number().int().optional(),
    }),
  });
}
export type getProductsInput = z.infer<typeof ProductsValidation.getProdcuts>;
export type createProductsInput = z.infer<
  typeof ProductsValidation.createProdcuts
> & { file: Express.Multer.File };
export type getProductByIdInput = z.infer<
  typeof ProductsValidation.getProductByIdSchema
>;
export type updateProductsInput = z.infer<
  typeof ProductsValidation.updateProducts
> & { file?: Express.Multer.File | undefined };
export type deleteProductsInput = z.infer<
  typeof ProductsValidation.deleteProducts
>;
