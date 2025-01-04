import client from '../config/database.js';

interface Comment {
  id: number;
  content: string;
  post_id: number;
  author_id: number;
  created_at: Date;
}

const CommentModel = {
  async initialize(): Promise<void> {
    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        post_id INT NOT NULL,
        author_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  },

  async create(content: string, postId: string, authorId: string): Promise<Comment> {
    const res = await client.query(
      'INSERT INTO comments (content, post_id, author_id) VALUES ($1, $2, $3) RETURNING *',
      [content, postId, authorId]
    );
    return res.rows[0];
  },

  async findByPostId(postId: string, page: number = 1, limit: number = 10): Promise<Comment[]> {
    const offset = (page - 1) * limit;
    const res = await client.query(
      'SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [postId, limit, offset]
    );
    return res.rows;
  },

  async findById(id: string): Promise<Comment | null> {
    const res = await client.query('SELECT * FROM comments WHERE id = $1', [id]);
    return res.rows[0] || null;
  },

  async update(id: string, content: string): Promise<Comment | null> {
    const res = await client.query(
      'UPDATE comments SET content = $1 WHERE id = $2 RETURNING *',
      [content, id]
    );
    return res.rows[0] || null;
  },

  async delete(id: string): Promise<void> {
    await client.query('DELETE FROM comments WHERE id = $1', [id]);
  }
};

// Initialize table when module is imported
CommentModel.initialize()
  .catch(err => {
    console.error('Failed to initialize comments table:', err);
    process.exit(1);
  });

export default CommentModel;