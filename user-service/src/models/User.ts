import { Client } from 'pg';
import bcrypt from 'bcrypt';

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

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

client.connect();

// Create users table if it doesn't exist
const createTable = async (): Promise<void> => {
  await client.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL
    );
  `);
};

createTable();

// User model methods
const UserModel = {
  async create(username: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const res = await client.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );
    return res.rows[0];
  },

  async findByEmail(email: string): Promise<User | null> {
    const res = await client.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0] || null;
  },

  async findById(id: number): Promise<UserWithoutPassword | null> {
    const res = await client.query('SELECT id, username, email FROM users WHERE id = $1', [id]);
    return res.rows[0] || null;
  },

  async update(id: number, username: string, email: string): Promise<User | null> {
    const res = await client.query(
      'UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *',
      [username, email, id]
    );
    return res.rows[0] || null;
  },

  async delete(id: number): Promise<void> {
    await client.query('DELETE FROM users WHERE id = $1', [id]);
  },

  async comparePassword(candidatePassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  },
};

export default UserModel;