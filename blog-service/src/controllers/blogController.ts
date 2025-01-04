import { Request, Response } from 'express';
import Blog from '../models/Blog.js';

interface BlogRequestBody {
  title: string;
  content: string;
}

interface CustomRequest extends Request {
  userId?: string;
}

interface PaginationQuery {
  page?: string;
  limit?: string;
}

// Create a new blog post
 const createBlog = async (req: CustomRequest & { body: BlogRequestBody }, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;
    if (!req.userId) {
      throw new Error('User ID is required');
    }
    const blog = await Blog.create(title, content, req.userId);
    res.status(201).json(blog);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// List all blog posts with pagination
 const getBlogs = async (req: Request<{}, {}, {}, PaginationQuery>, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const blogs = await Blog.findAll(page, limit);
    res.json(blogs);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Fetch a specific blog post
 const getBlog = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) throw new Error('Blog not found');
    res.json(blog);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

// Update a blog post
 const updateBlog = async (req: Request<{ id: string }, {}, BlogRequestBody>, res: Response): Promise<void> => {
  try {
    const { title, content } = req.body;
    const blog = await Blog.update(req.params.id, title, content);
    if (!blog) throw new Error('Blog not found');
    res.json(blog);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Delete a blog post
 const deleteBlog = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    await Blog.delete(req.params.id);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export { createBlog, getBlogs, getBlog, updateBlog, deleteBlog };