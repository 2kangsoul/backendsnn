"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const Product_Services_1 = require("../../Services/Product/Product.Services");
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newProduct = yield Product_Services_1.ProductService.createProduct(req.body);
        return res.status(201).json({
            success: true,
            message: "Product berhasil dibuat",
            data: newProduct,
        });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
});
exports.createProduct = createProduct;
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield Product_Services_1.ProductService.getAllProducts();
        return res.status(200).json({
            success: true,
            data: products,
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield Product_Services_1.ProductService.getProductById(req.params.id);
        return res.status(200).json({
            success: true,
            data: product,
        });
    }
    catch (error) {
        return res.status(404).json({ success: false, message: error.message });
    }
});
exports.getProductById = getProductById;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedProduct = yield Product_Services_1.ProductService.updateProduct(req.params.id, req.body);
        return res.status(200).json({
            success: true,
            message: "Product berhasil diupdate",
            data: updatedProduct,
        });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield Product_Services_1.ProductService.deleteProduct(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Product berhasil dihapus",
        });
    }
    catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
});
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=Product.Controller.js.map