import { Router, Request, Response } from 'express';
import BlogController from '../controllers/blogController.js';

const router: Router = Router();

// Blog routes
router.post('/', BlogController.create);
router.get('/', BlogController.getAll);
router.get('/:id', BlogController.getById);
router.put('/:id', BlogController.update);
router.delete('/:id', BlogController.delete);

export default router;