import { Request, Response } from 'express';
import Comment from '../models/Comment';

interface CommentRequestBody {
  content: string;
  postId: string;
}

interface CustomRequest extends Request {
  userId?: string;
}

// Add a comment to a blog post
export const addComment = async (
  req: CustomRequest & { body: CommentRequestBody }, 
  res: Response
): Promise<void> => {
  try {
    const { content, postId } = req.body;
    if (!req.userId) {
      throw new Error('User ID is required');
    }
    const comment = await Comment.create(content, postId, req.userId);
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// List comments for a specific blog post
export const getComments = async (
  req: Request<{}, {}, {}, { postId: string }>, 
  res: Response
): Promise<void> => {
  try {
    const comments = await Comment.findByPostId(req.query.postId);
    res.json(comments);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};