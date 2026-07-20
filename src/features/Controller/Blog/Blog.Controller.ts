import { Request, Response } from "express";
import * as BlogService from "../../Services/Blog/Blog.Services";

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await BlogService.getAllBlogs();
    res.status(200).json({ success: true, data: blogs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await BlogService.getBlogById(req.params.id as string);
    res.status(200).json({ success: true, data: blog });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  try {
    const newBlog = await BlogService.createNewBlog(req.body);
    res
      .status(201)
      .json({ success: true, data: newBlog, message: "Blog berhasil dibuat" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedBlog = await BlogService.updateExistingBlog(
      req.params.id as string,
      req.body,
    );
    res.status(200).json({
      success: true,
      data: updatedBlog,
      message: "Blog berhasil diupdate",
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await BlogService.removeBlog(req.params.id as string);
    res.status(200).json({ success: true, message: "Blog berhasil dihapus" });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const generateBlog = async (req: Request, res: Response) => {
  try {
    const { title, category } = req.body;
    if (!title || !category)
      return res.status(400).json({ success: false, message: "Judul dan Kategori wajib diisi!" });
    const result = await BlogService.generateBlogContent(req.body);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
