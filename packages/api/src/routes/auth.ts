/**
 * Authentication Routes
 * Handles user registration, login, logout, token refresh
 * Phase 2: User Authentication Endpoints
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import {
  hashPassword,
  comparePassword,
  generateToken,
  generateRefreshToken,
  validatePasswordStrength,
  validateEmail,
} from '../services/auth.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { logInfo, logError, logSuccess } from '../config/logger';
import { User, CreateUserRequest, LoginRequest, AuthResponse } from '../models/User';

const router = Router();

// Validation schemas using Zod
const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password required'),
});

// In-memory user store for Phase 2 demo (replace with database in Phase 3)
// Key: email, Value: User object with hashed password
const userStore = new Map<string, User & { password: string }>();

// Demo admin user
userStore.set('admin@aircart.com', {
  id: 'admin-001',
  email: 'admin@aircart.com',
  password: '$2a$10$sealed_demo_hash', // Demo hash, replace in production
  name: 'Admin User',
  phone: '+1-800-555-0100',
  role: 'admin',
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);
    const { email, password, name, phone } = validatedData;

    // Check if user already exists
    if (userStore.has(email)) {
      logInfo(`Registration failed: Email already registered - ${email}`);
      res.status(400).json({
        success: false,
        error: 'Email already registered',
        message: 'This email address is already associated with an account',
      });
      return;
    }

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      res.status(400).json({
        success: false,
        error: 'Weak password',
        message: 'Password does not meet strength requirements',
        details: passwordValidation.errors,
      });
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user object (in Phase 3, save to database)
    const newUser: User & { password: string } = {
      id: `user-${Date.now()}`,
      email,
      password: hashedPassword,
      name,
      phone: phone || undefined,
      role: 'customer',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to store (replace with database save)
    userStore.set(email, newUser);

    // Generate tokens
    const token = generateToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    logSuccess(`User registered successfully: ${email}`);

    // Return response (excluding password)
    const { password: _, ...userWithoutPassword } = newUser;
    const response: AuthResponse = {
      token,
      refreshToken,
      user: userWithoutPassword,
    };

    res.status(201).json({
      success: true,
      data: response,
      message: 'User registered successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logError('Validation error in register', error);
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
      return;
    }

    logError('Registration error', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      message: 'An error occurred during registration',
    });
  }
});

/**
 * POST /api/auth/login
 * Login user and return JWT token
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    // Find user in store
    const user = userStore.get(email);

    if (!user) {
      logInfo(`Login failed: User not found - ${email}`);
      res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Email or password is incorrect',
      });
      return;
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      logInfo(`Login failed: Invalid password - ${email}`);
      res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Email or password is incorrect',
      });
      return;
    }

    // Update last login
    user.lastLogin = new Date();

    // Generate tokens
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    logSuccess(`User logged in: ${email}`);

    // Return response (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    const response: AuthResponse = {
      token,
      refreshToken,
      user: userWithoutPassword,
    };

    res.status(200).json({
      success: true,
      data: response,
      message: 'Login successful',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logError('Validation error in login', error);
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
      return;
    }

    logError('Login error', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
      message: 'An error occurred during login',
    });
  }
});

/**
 * POST /api/auth/refresh
 * Refresh JWT token using refresh token
 */
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        success: false,
        error: 'Missing refresh token',
      });
      return;
    }

    // In production, verify refresh token and issue new access token
    // For now, just acknowledge the endpoint exists
    logInfo('Token refresh requested');

    res.status(200).json({
      success: true,
      message: 'Token refresh endpoint ready for Phase 3 implementation',
    });
  } catch (error) {
    logError('Token refresh error', error);
    res.status(500).json({
      success: false,
      error: 'Token refresh failed',
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user (protected route)
 */
router.post('/logout', authMiddleware, async (req: Request, res: Response) => {
  try {
    logInfo(`User logged out: ${req.user?.email}`);

    // In production, blacklist the token or revoke it
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    logError('Logout error', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed',
    });
  }
});

/**
 * GET /api/auth/me
 * Get current user info (protected route)
 */
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = userStore.get(req.user!.email);

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: userWithoutPassword,
      message: 'User info retrieved',
    });
  } catch (error) {
    logError('Get user error', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user info',
    });
  }
});

export default router;
