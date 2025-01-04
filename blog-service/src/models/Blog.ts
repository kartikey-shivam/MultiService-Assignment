import client from '../config/database.js';

interface Blog {
  id: number;
  title: string;
  content: string;
  author_id: string;
  created_at: Date;
}

const BlogModel = {
  async initialize(): Promise<void> {
    await client.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        content TEXT NOT NULL,
        author_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  },

  async create(title: string, content: string, authorId: string): Promise<Blog> {
    const res = await client.query(
      'INSERT INTO blogs (title, content, author_id) VALUES ($1, $2, $3) RETURNING *',
      [title, content, authorId]
    );
    return res.rows[0];
  },

  async findAll(page: number = 1, limit: number = 10): Promise<Blog[]> {
    const offset = (page - 1) * limit;
    const res = await client.query(
      'SELECT * FROM blogs ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return res.rows;
  },

  async findById(id: string): Promise<Blog | null> {
    const res = await client.query('SELECT * FROM blogs WHERE id = $1', [id]);
    return res.rows[0] || null;
  },

  async update(id: string, title: string, content: string): Promise<Blog | null> {
    const res = await client.query(
      'UPDATE blogs SET title = $1, content = $2 WHERE id = $3 RETURNING *',
      [title, content, id]
    );
    return res.rows[0] || null;
  },

  async delete(id: string): Promise<void> {
    await client.query('DELETE FROM blogs WHERE id = $1', [id]);
  }
};

// Initialize table when module is imported
BlogModel.initialize()
  .catch(err => {
    console.error('Failed to initialize blog table:', err);
    process.exit(1);
  });

export default BlogModel;