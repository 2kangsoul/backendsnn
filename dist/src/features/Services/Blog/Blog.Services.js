"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.removeBlog = exports.updateExistingBlog = exports.createNewBlog = exports.getBlogById = exports.getAllBlogs = void 0;
const BlogRepository = __importStar(require("../../Repositories/Blog/Blog.Repositories"));
const getAllBlogs = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield BlogRepository.findAllBlogs();
});
exports.getAllBlogs = getAllBlogs;
const getBlogById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield BlogRepository.findBlogById(id);
    if (!blog)
        throw new Error("Blog tidak ditemukan");
    return blog;
});
exports.getBlogById = getBlogById;
const createNewBlog = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.title || !data.content || !data.excerpt) {
        throw new Error("Title, content, dan excerpt wajib diisi");
    }
    return yield BlogRepository.createBlog(data);
});
exports.createNewBlog = createNewBlog;
const updateExistingBlog = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.getBlogById)(id); // Pastikan blog ada sebelum diupdate
    return yield BlogRepository.updateBlog(id, data);
});
exports.updateExistingBlog = updateExistingBlog;
const removeBlog = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exports.getBlogById)(id); // Pastikan blog ada sebelum dihapus
    return yield BlogRepository.deleteBlog(id);
});
exports.removeBlog = removeBlog;
//# sourceMappingURL=Blog.Services.js.map