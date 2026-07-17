import { Request, Response } from "express";
import { ProductsService } from "./product.services";
import { validate } from "../../validate/validate";
import { ProductsValidation } from "./product.validation";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../../error/bad.request";

export default class ProductsController {
  static async createProducts(req: Request, res: Response) {
    const { body } = validate(ProductsValidation.createProdcuts, {
      body: req.body,
    });
    const file = req.file
    if(!file) throw new BadRequestError("File is required")
    const product = await ProductsService.CreateProducts({ body , file});
    return res.status(StatusCodes.CREATED).json({
      message:  "Product created successfully",
      data: product,
    });
  }
  static async getProducts(req: Request, res: Response) {
    const {query} = validate(ProductsValidation.getProdcuts,{
      query: req.query
    })
    const getProducts = await ProductsService.getProducts({query});
    return res.status(StatusCodes.OK).json({
      message: "Products data successfully retrieved",
      data: getProducts,
    });
  }
  static async getProductById(req: Request, res: Response) {
    const { params } = validate(ProductsValidation.getProductByIdSchema, {
      params: req.params,
    });
    const getProductById = await ProductsService.getProductById({ params });
    return res.status(StatusCodes.OK).json({
      message: "Product data successfully retrieved",
      data: getProductById,
    });
  }
  static async updateProducts(req: Request, res: Response) {
    const { params, body } = validate(ProductsValidation.updateProducts, {
      params: req.params,
      body: req.body,
    });
    const file = req.file
    const updateProduct = await ProductsService.updateProducts({
      params,
      body,
      file
    });
    return res.status(StatusCodes.OK).json({
      message: "Product updated successfully",
      data: updateProduct,
    });
  }
  static async deleteProducts(req: Request, res: Response) {
    const { params } = validate(ProductsValidation.deleteProducts, {
      params: req.params,
    });
    const deleteProduct = await ProductsService.deleteProducts({ params });
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Deleted product successfuly",
      data: deleteProduct,
    });
  }
}
