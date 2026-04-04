/**
 * Shared User Store
 * Single source of truth for all users across the application
 */

import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { logSuccess, logError } from '../config/logger';

// In-memory user store
// Key: email, Value: User object with hashed password
export const userStore = new Map<string, User & { password: string }>();

/**
 * Initialize the user store with demo admin
 */
export async function initializeUserStore() {
  try {
    // Create proper bcrypt hash for demo password
    const demoPasswordHash = await bcrypt.hash('Demo@123!Pass', 10);
    
    userStore.set('admin@aircart.com', {
      id: 'admin-001',
      email: 'admin@aircart.com',
      password: demoPasswordHash,
      name: 'Admin User',
      phone: '+1-800-555-0100',
      role: 'admin',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    logSuccess('User store initialized with demo admin user');
  } catch (err) {
    logError('Failed to initialize user store', err);
  }
}

/**
 * Get all users from store
 */
export function getAllUsers() {
  return Array.from(userStore.values());
}

/**
 * Get user by email
 */
export function getUserByEmail(email: string) {
  return userStore.get(email);
}

/**
 * Add user to store
 */
export function addUser(user: User & { password: string }) {
  userStore.set(user.email, user);
}

/**
 * Update user in store
 */
export function updateUser(email: string, user: User & { password: string }) {
  userStore.set(email, user);
}

/**
 * Delete user from store
 */
export function deleteUser(email: string) {
  return userStore.delete(email);
}
