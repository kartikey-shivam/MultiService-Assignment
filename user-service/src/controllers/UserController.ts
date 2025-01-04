import { Request, Response } from 'express';
import User from '../models/User.js';

interface UserRequestBody {
  username: string;
  email: string;
  password: string;
}

// Register User
 const registerUser = async (req: Request<{}, {}, UserRequestBody>, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create(username, email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Login User
 const loginUser = async (req: Request<{}, {}, UserRequestBody>, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) throw new Error('User not found');
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');
    res.json({ id: user.id, email: user.email });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Get User
 const getUser = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new Error('User not found');
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

// Update User
 const updateUser = async (req: Request<{ id: string }, {}, UserRequestBody>, res: Response): Promise<void> => {
  try {
    const { username, email } = req.body;
    const user = await User.update(req.params.id, username, email);
    if (!user) throw new Error('User not found');
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// Delete User
 const deleteUser = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    await User.delete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export { registerUser, loginUser, getUser, updateUser, deleteUser };