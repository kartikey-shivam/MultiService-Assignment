import { Router, Request, Response } from 'express';
import { 
  createBlog, 
  getBlogs, 
  getBlog, 
  updateBlog, 
  deleteBlog 
} from '../controllers/blogController.js';

interface RequestParams {
  id: string;
}

const router: Router = Router();

router.post('/', (req: Request, res: Response) => createBlog(req, res));
router.get('/', (req: Request, res: Response) => getBlogs(req, res));
router.get('/:id', (req: Request<RequestParams>, res: Response) => getBlog(req, res));
router.put('/:id', (req: Request<RequestParams>, res: Response) => updateBlog(req, res));
router.delete('/:id', (req: Request<RequestParams>, res: Response) => deleteBlog(req, res));

export default router;