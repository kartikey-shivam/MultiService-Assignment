import { Router } from 'express';
import { addComment, getComments } from '../controllers/commentController';

const router: Router = Router();

router.post('/', addComment);
router.get('/', getComments);

export default router;