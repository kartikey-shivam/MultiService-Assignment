import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import commentRoutes from './routes/commentRoutes.js';
import client from './config/database.js';

dotenv.config();

const app = express();
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    await client.query('SELECT 1');
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'connected',
      service: 'comment-service'
    });
  } catch (error) {
    res.status(503).json({
      status: 'Error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      service: 'comment-service'
    });
  }
});

app.use('/api/comments', commentRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Comment service running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/api/health`);
});

export default app;