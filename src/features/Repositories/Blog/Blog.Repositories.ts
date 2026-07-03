import prisma from "../../../prisma";
import {
  BlogCreateInput,
  BlogUpdateInput,
} from "../../Models/Blog/Blog.Models";


export const findAllBlogs = async () => {
  return await prisma.blog.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });
};

export const findBlogById = async (id: string) => {
  return await prisma.blog.findFirst({
    where: { id, deletedAt: null },
  });
};

export const createBlog = async (data: BlogCreateInput) => {
  return await prisma.blog.create({
    data,
  });
};

export const updateBlog = async (id: string, data: BlogUpdateInput) => {
  return await prisma.blog.update({
    where: { id },
    data,
  });
};

export const deleteBlog = async (id: string) => {
  // Soft delete: hanya mengisi kolom deletedAt agar data tidak hilang permanen
  return await prisma.blog.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};
