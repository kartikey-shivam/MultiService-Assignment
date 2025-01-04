import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import blogRoutes from './routes/blogRoutes.js';
import client from './config/database.js';
import { authenticate } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Health check endpoint - must be before other routes
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    await client.query('SELECT 1');
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'connected',
      service: 'blog-service'
    });
  } catch (error) {
    res.status(503).json({
      status: 'Error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      service: 'blog-service'
    });
  }
});

// Protected blog routes
app.use('/api/blogs', authenticate, blogRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Blog service running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/api/health`);
});

export default app;