import { Router } from "express";
import * as BlogController from "../../Controller/Blog/Blog.Controller";

const router = Router();

router.get("/", BlogController.getAllBlogs);
router.get("/:id", BlogController.getBlogById);
router.post("/", BlogController.createBlog);
router.post("/generate", BlogController.generateBlog);
router.put("/:id", BlogController.updateBlog);
router.delete("/:id", BlogController.deleteBlog);

export const blogRouter = router;
