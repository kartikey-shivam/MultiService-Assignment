import { Router } from 'express';
import UserController from '../controllers/UserController.js';

const router: Router = Router();

// User routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.get('/:id', UserController.getById);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);

export default router;