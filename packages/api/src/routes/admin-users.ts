/**
 * Admin User Management Routes
 * Allows admin to view, manage, and control all users
 */

import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { logInfo, logError, logSuccess } from '../config/logger';
import { User } from '../models/User';
import { userStore } from '../store/users';
import bcrypt from 'bcryptjs';

const router = Router();

/**
 * GET /api/admin/users
 * Get all users (admin only) - includes passwords
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    // Check if user is admin
    if (user.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Only admins can view all users',
      });
      return;
    }

    const users = Array.from(userStore.values()).map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone || '',
      password: u.password, // SHOW PASSWORD FOR ADMIN
      role: u.role,
      isActive: u.isActive,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
      lastLogin: u.lastLogin || null,
    }));

    logInfo(`Admin retrieved all users: ${user.email}`);

    res.json({
      success: true,
      data: users,
      count: users.length,
      message: 'Users retrieved successfully',
    });
  } catch (err) {
    logError('Error getting users', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve users',
      message: 'An error occurred while retrieving users',
    });
  }
});

/**
 * GET /api/admin/users/:email
 * Get single user by email (admin only)
 */
router.get('/:email', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { email } = req.params;

    if (user.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Only admins can view user details',
      });
      return;
    }

    const targetUser = userStore.get(email);

    if (!targetUser) {
      res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'User not found',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        phone: targetUser.phone || '',
        password: targetUser.password, // SHOW PASSWORD
        role: targetUser.role,
        isActive: targetUser.isActive,
        createdAt: targetUser.createdAt,
        updatedAt: targetUser.updatedAt,
        lastLogin: targetUser.lastLogin || null,
      },
      message: 'User retrieved successfully',
    });
  } catch (err) {
    logError('Error getting user', err);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user',
    });
  }
});

/**
 * PUT /api/admin/users/:email
 * Update user (admin only)
 */
router.put('/:email', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { email } = req.params;
    const { name, phone, role, isActive, password } = req.body;

    if (user.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Only admins can update users',
      });
      return;
    }

    const targetUser = userStore.get(email);

    if (!targetUser) {
      res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'User not found',
      });
      return;
    }

    // Update allowed fields
    if (name) targetUser.name = name;
    if (phone) targetUser.phone = phone;
    if (role) targetUser.role = role as 'admin' | 'customer';
    if (isActive !== undefined) targetUser.isActive = isActive;
    
    // Update password if provided
    if (password) {
      targetUser.password = await bcrypt.hash(password, 10);
    }

    targetUser.updatedAt = new Date();
    userStore.set(email, targetUser);

    logSuccess(`Admin updated user: ${email} by ${user.email}`);

    res.json({
      success: true,
      data: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        phone: targetUser.phone || '',
        role: targetUser.role,
        isActive: targetUser.isActive,
        updatedAt: targetUser.updatedAt,
      },
      message: 'User updated successfully',
    });
  } catch (err) {
    logError('Error updating user', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update user',
    });
  }
});

/**
 * DELETE /api/admin/users/:email
 * Delete user (admin only)
 */
router.delete('/:email', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { email } = req.params;

    if (user.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Only admins can delete users',
      });
      return;
    }

    // Prevent deleting own account
    if (email === user.email) {
      res.status(400).json({
        success: false,
        error: 'Cannot delete own account',
        message: 'Admins cannot delete their own account',
      });
      return;
    }

    if (!userStore.has(email)) {
      res.status(404).json({
        success: false,
        error: 'Not found',
        message: 'User not found',
      });
      return;
    }

    userStore.delete(email);
    logSuccess(`Admin deleted user: ${email} by ${user.email}`);

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (err) {
    logError('Error deleting user', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user',
    });
  }
});

/**
 * POST /api/admin/users
 * Create new user (admin only)
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { name, email, password, phone, role, isActive } = req.body;

    if (user.role !== 'admin') {
      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Only admins can create users',
      });
      return;
    }

    // Validate required fields
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: 'Name, email, and password are required',
      });
      return;
    }

    // Check if email already exists
    if (userStore.has(email)) {
      res.status(400).json({
        success: false,
        error: 'Email already exists',
        message: 'This email is already registered',
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser: User & { password: string } = {
      id: `user-${Date.now()}`,
      email,
      password: hashedPassword,
      name,
      phone: phone || undefined,
      role: (role || 'customer') as 'admin' | 'customer',
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userStore.set(email, newUser);
    logSuccess(`Admin created new user: ${email} by ${user.email}`);

    res.status(201).json({
      success: true,
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone || '',
        role: newUser.role,
        isActive: newUser.isActive,
        createdAt: newUser.createdAt,
      },
      message: 'User created successfully',
    });
  } catch (err) {
    logError('Error creating user', err);
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
    });
  }
});

export default router;
