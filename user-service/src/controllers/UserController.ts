import { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

interface UserRequestBody {
  username: string;
  email: string;
  password: string;
}

class UserController {
  // Register User
  public static async register(
    req: Request<{}, {}, UserRequestBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username, email, password } = req.body;
      const user = await User.create(username, email, password);
      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );
      
      res.status(201).json({
        status: 'success',
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Login User
  public static async login(
    req: Request<{}, {}, UserRequestBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await User.findByEmail(email);
      if (!user) throw new Error('User not found');

      const isMatch = await User.comparePassword(password, user.password);
      if (!isMatch) throw new Error('Invalid credentials');

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );

      res.json({
        status: 'success',
        data: {
          token,
          user: {
            email: user.email
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
  // Get User
  public static async getById(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await User.findById(req.params.id);
      if (!user) throw new Error('User not found');
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  // Update User
  public static async update(
    req: Request<{ id: string }, {}, UserRequestBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username, email } = req.body;
      const user = await User.update(req.params.id, username, email);
      if (!user) throw new Error('User not found');
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  // Delete User
  public static async delete(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await User.delete(req.params.id);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;