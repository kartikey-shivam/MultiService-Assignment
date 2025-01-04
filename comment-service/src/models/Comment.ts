import { Client } from 'pg';

interface Comment {
  id: number;
  content: string;
  post_id: number;
  author_id: number;
  created_at: Date;
}

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

client.connect();

// Create comments table if it doesn't exist
const createTable = async (): Promise<void> => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL,
      post_id INT NOT NULL,
      author_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

createTable();

// Comment model methods
const CommentModel = {
  async create(content: string, postId: string, authorId: string): Promise<Comment> {
    const res = await client.query(
      'INSERT INTO comments (content, post_id, author_id) VALUES ($1, $2, $3) RETURNING *',
      [content, postId, authorId]
    );
    return res.rows[0];
  },

  async findByPostId(postId: string): Promise<Comment[]> {
    const res = await client.query(
      'SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC',
      [postId]
    );
    return res.rows;
  },

  async delete(id: string): Promise<void> {
    await client.query('DELETE FROM comments WHERE id = $1', [id]);
  }
};

export default CommentModel;