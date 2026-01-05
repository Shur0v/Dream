/**
 * Users Express Routes
 * Handles user registration and retrieval
 */

import { Router, Request, Response } from 'express';
import { getUsers, saveUser, getUserById, getUserByEmail } from '../lib/db';

const router = Router();

const mockApiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * GET /api/users
 * Get all users
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(500);

    const users = await getUsers();

    res.json({
      success: true,
      data: users,
      message: 'Users retrieved successfully',
    });
  } catch (error) {
    console.error('[GET /api/users] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * GET /api/users/:id
 * Get user by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(500);

    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.json({
      success: true,
      data: user,
      message: 'User retrieved successfully',
    });
  } catch (error) {
    console.error('[GET /api/users/:id] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

/**
 * POST /api/users
 * Create or update user
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    await mockApiDelay(800);

    const { username, mobile, email, password, loginTime } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    // Check if user exists by email
    const existingUser = await getUserByEmail(email);

    let userData: any;

    if (existingUser) {
      // Update existing user
      userData = {
        email: email,
        firstName: username || existingUser.firstName || email.split('@')[0],
        lastName: existingUser.lastName || '',
        phone: mobile || existingUser.phone,
        role: existingUser.role || 'client',
      };
    } else {
      // Create new user
      userData = {
        email: email,
        firstName: username || email.split('@')[0],
        lastName: '',
        role: 'client',
        phone: mobile || undefined,
        isEmailVerified: false,
      };
    }

    // Save user to MongoDB
    const savedUser = await saveUser(userData);

    res.status(201).json({
      success: true,
      data: savedUser,
      message: existingUser ? 'User updated successfully' : 'User created successfully',
    });
  } catch (error) {
    console.error('[POST /api/users] Error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
    });
  }
});

export default router;

