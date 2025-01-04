import { Request, Response, NextFunction } from 'express';
import Comment from '../models/Comment.js';

interface CommentRequestBody {
  content: string;
  postId: string;
}

interface CustomRequest extends Request {
  userId?: string;
}

class CommentController {
  // Add a comment to a blog post
  public static async create(
    req: CustomRequest & { body: CommentRequestBody },
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { content, postId } = req.body;
      if (!req.userId) {
        throw new Error('User ID is required');
      }
      const comment = await Comment.create(content, postId, req.userId);
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  }

  // List comments for a specific blog post
  public static async getByPostId(
    req: Request<{ postId: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const comments = await Comment.findByPostId(req.params.postId);
      res.json(comments);
    } catch (error) {
      next(error);
    }
  }

  // Delete a comment
  public static async delete(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await Comment.delete(req.params.id);
      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  // Update a comment
  public static async update(
    req: Request<{ id: string }, {}, { content: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const comment = await Comment.update(req.params.id, req.body.content);
      if (!comment) throw new Error('Comment not found');
      res.json(comment);
    } catch (error) {
      next(error);
    }
  }
}

export default CommentController;