import client from '../config/database.js';
import bcrypt from 'bcryptjs';

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

interface UserWithoutPassword {
  id: number;
  username: string;
  email: string;
}

const UserModel = {
  async initialize(): Promise<void> {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  },

  async create(username: string, email: string, password: string): Promise<UserWithoutPassword> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const res = await client.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );
    return res.rows[0];
  },

  async findByEmail(email: string): Promise<User | null> {
    const res = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0] || null;
  },

  async findById(id: string): Promise<UserWithoutPassword | null> {
    const res = await client.query(
      'SELECT id, username, email FROM users WHERE id = $1',
      [id]
    );
    return res.rows[0] || null;
  },

  async update(id: string, username: string, email: string): Promise<UserWithoutPassword | null> {
    const res = await client.query(
      'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING id, username, email',
      [username, email, id]
    );
    return res.rows[0] || null;
  },

  async delete(id: string): Promise<void> {
    await client.query('DELETE FROM users WHERE id = $1', [id]);
  },

  async comparePassword(candidatePassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }
};

// Initialize table when module is imported
UserModel.initialize()
  .catch(err => {
    console.error('Failed to initialize users table:', err);
    process.exit(1);
  });

export default UserModel;