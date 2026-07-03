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
exports.ProductService = void 0;
// services/Product.Services.ts
const Product_Repositories_1 = require("../../Repositories/Product/Product.Repositories");
exports.ProductService = {
    createProduct: (data) => __awaiter(void 0, void 0, void 0, function* () {
        if (!data.name) {
            throw new Error("Nama produk wajib diisi!");
        }
        return yield Product_Repositories_1.ProductRepository.createProduct(data);
    }),
    getAllProducts: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield Product_Repositories_1.ProductRepository.getAllProducts();
    }),
    getProductById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield Product_Repositories_1.ProductRepository.getProductById(id);
        if (!product) {
            throw new Error("Product tidak ditemukan!");
        }
        return product;
    }),
    updateProduct: (id, data) => __awaiter(void 0, void 0, void 0, function* () {
        // Cek apakah produk ada
        yield exports.ProductService.getProductById(id);
        return yield Product_Repositories_1.ProductRepository.updateProduct(id, data);
    }),
    deleteProduct: (id) => __awaiter(void 0, void 0, void 0, function* () {
        // Cek apakah produk ada
        yield exports.ProductService.getProductById(id);
        return yield Product_Repositories_1.ProductRepository.deleteProduct(id);
    }),
};
//# sourceMappingURL=Product.Services.js.map