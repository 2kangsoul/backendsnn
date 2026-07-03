import * as BlogRepository from "../../Repositories/Blog/Blog.Repositories";
import {
  BlogCreateInput,
  BlogUpdateInput,
} from "../../Models/Blog/Blog.Models";

export const getAllBlogs = async () => {
  return await BlogRepository.findAllBlogs();
};

export const getBlogById = async (id: string) => {
  const blog = await BlogRepository.findBlogById(id);
  if (!blog) throw new Error("Blog tidak ditemukan");
  return blog;
};

export const createNewBlog = async (data: BlogCreateInput) => {
  if (!data.title || !data.content || !data.excerpt) {
    throw new Error("Title, content, dan excerpt wajib diisi");
  }
  return await BlogRepository.createBlog(data);
};

export const updateExistingBlog = async (id: string, data: BlogUpdateInput) => {
  await getBlogById(id); // Pastikan blog ada sebelum diupdate
  return await BlogRepository.updateBlog(id, data);
};

export const removeBlog = async (id: string) => {
  await getBlogById(id); // Pastikan blog ada sebelum dihapus
  return await BlogRepository.deleteBlog(id);
};
