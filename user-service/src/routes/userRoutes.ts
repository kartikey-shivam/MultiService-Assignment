import { Router } from 'express';
import { 
    registerUser, 
    loginUser, 
    getUser, 
    updateUser, 
    deleteUser 
} from '../controllers/userController.js';

const router: Router = Router();

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;