import { Router } from 'express';
import CommentController from '../controllers/commentController.js';

const router: Router = Router();

// Comment routes
router.post('/', CommentController.create);
router.get('/post/:postId', CommentController.getByPostId);
router.put('/:id', CommentController.update);
router.delete('/:id', CommentController.delete);

export default router;