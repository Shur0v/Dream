/**
 * Auth Express Routes
 */

import { Router, Request, Response } from 'express';
import {
  getUsers,
  saveUser,
  getUserById,
} from '../express-lib/db';

const router = Router();

const mockApiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * POST /api/auth/login
 * User login
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(800);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
    }

    const users = await getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // In a real app, you would hash and compare passwords
    // For now, we'll just check if user exists

    res.json({
      success: true,
      data: {
        user,
        token: `mock-token-${user.id}`,
        refreshToken: `mock-refresh-${user.id}`,
      },
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * POST /api/auth/register
 * User registration
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(1200);

    const { email, password, firstName, lastName, role, phone } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, first name, and last name are required',
      });
    }

    const users = await getUsers();
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists',
      });
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email: String(email).trim(),
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      role: (role || 'client') as 'client' | 'seller' | 'reseller' | 'super-admin',
      phone: phone ? String(phone).trim() : undefined,
      isEmailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveUser(newUser);

    res.status(201).json({
      success: true,
      data: {
        user: newUser,
        token: `mock-token-${newUser.id}`,
        refreshToken: `mock-refresh-${newUser.id}`,
      },
      message: 'Registration successful',
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

export default router;


