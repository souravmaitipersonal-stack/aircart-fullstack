/**
 * User Model - Shared data structure for both PostgreSQL and MongoDB
 * Phase 2: User Authentication & Management
 */

export interface User {
  id: string;
  email: string;
  password: string; // hashed with bcrypt
  name: string;
  phone?: string;
  role: 'customer' | 'admin';
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  user: Omit<User, 'password'>;
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  email?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}
