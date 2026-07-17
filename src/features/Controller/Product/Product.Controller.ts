// // controller/Product.Controller.ts
// import { Request, Response } from "express";
// import { ProductService } from "../../Services/Product/Product.Services";

// export const createProduct = async (
//   req: Request,
//   res: Response,
// ): Promise<any> => {
//   try {
//     const newProduct = await ProductService.createProduct(req.body);
//     return res.status(201).json({
//       success: true,
//       message: "Product berhasil dibuat",
//       data: newProduct,
//     });
//   } catch (error: any) {
//     return res.status(400).json({ success: false, message: error.message });
//   }
// };

// export const getProducts = async (
//   req: Request,
//   res: Response,
// ): Promise<any> => {
//   try {
//     const products = await ProductService.getAllProducts();
//     return res.status(200).json({
//       success: true,
//       data: products,
//     });
//   } catch (error: any) {
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const getProductById = async (
//   req: Request,
//   res: Response,
// ): Promise<any> => {
//   try {
//     const product = await ProductService.getProductById(
//       req.params.id as string,
//     );
//     return res.status(200).json({
//       success: true,
//       data: product,
//     });
//   } catch (error: any) {
//     return res.status(404).json({ success: false, message: error.message });
//   }
// };

// export const updateProduct = async (
//   req: Request,
//   res: Response,
// ): Promise<any> => {
//   try {
//     const updatedProduct = await ProductService.updateProduct(
//       req.params.id as string,
//       req.body,
//     );
//     return res.status(200).json({
//       success: true,
//       message: "Product berhasil diupdate",
//       data: updatedProduct,
//     });
//   } catch (error: any) {
//     return res.status(400).json({ success: false, message: error.message });
//   }
// };

// export const deleteProduct = async (
//   req: Request,
//   res: Response,
// ): Promise<any> => {
//   try {
//     await ProductService.deleteProduct(req.params.id as string);
//     return res.status(200).json({
//       success: true,
//       message: "Product berhasil dihapus",
//     });
//   } catch (error: any) {
//     return res.status(400).json({ success: false, message: error.message });
//   }
// };
