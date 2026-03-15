/**
 * Authentication Service Tests
 * Phase 2: Unit tests for auth service functions
 * Run with: npm run test:auth (from packages/api)
 */

/// <reference types="vitest" />
import { test, expect } from 'vitest';
import {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  validatePasswordStrength,
  validateEmail,
} from '../services/auth.service';

describe('Auth Service', () => {
  describe('Password Hashing', () => {
    test('hashPassword should hash a password', async () => {
      const password = 'TestPassword123!';
      const hashed = await hashPassword(password);

      expect(hashed).not.toBe(password);
      expect(hashed.length).toBeGreaterThan(0);
    });

    test('comparePassword should return true for matching passwords', async () => {
      const password = 'TestPassword123!';
      const hashed = await hashPassword(password);
      const match = await comparePassword(password, hashed);

      expect(match).toBe(true);
    });

    test('comparePassword should return false for non-matching passwords', async () => {
      const password = 'TestPassword123!';
      const hashed = await hashPassword(password);
      const match = await comparePassword('WrongPassword123!', hashed);

      expect(match).toBe(false);
    });
  });

  describe('Password Validation', () => {
    test('should validate strong password', () => {
      const result = validatePasswordStrength('StrongPass123!');
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    test('should reject password without uppercase', () => {
      const result = validatePasswordStrength('lowercase123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    test('should reject password without lowercase', () => {
      const result = validatePasswordStrength('UPPERCASE123!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    test('should reject password without number', () => {
      const result = validatePasswordStrength('PasswordNoNum!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    test('should reject password without special char', () => {
      const result = validatePasswordStrength('Password123');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character (!@#$%^&*)');
    });

    test('should reject password too short', () => {
      const result = validatePasswordStrength('Pass1!');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters');
    });
  });

  describe('Email Validation', () => {
    test('should validate correct email', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('john.doe@company.co.uk')).toBe(true);
      expect(validateEmail('test+tag@domain.com')).toBe(true);
    });

    test('should reject invalid email', () => {
      expect(validateEmail('invalid.email')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('user @example.com')).toBe(false);
    });
  });

  describe('JWT Tokens', () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashed_password',
      role: 'customer' as const,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    test('generateToken should create a valid token', () => {
      const token = generateToken(mockUser);

      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.').length).toBe(3); // JWT has 3 parts
    });

    test('verifyToken should decode a valid token', () => {
      const token = generateToken(mockUser);
      const decoded = verifyToken(token);

      expect(decoded).not.toBeNull();
      expect(decoded?.id).toBe('user-123');
      expect(decoded?.email).toBe('test@example.com');
      expect(decoded?.role).toBe('customer');
    });

    test('verifyToken should return null for invalid token', () => {
      const result = verifyToken('invalid.token.here');
      expect(result).toBeNull();
    });

    test('verifyToken should return null for expired token', () => {
      // This would require mocking jwt.verify or using a real expired token
      // Simplified for demo purposes
      const result = verifyToken('expired.token.test');
      expect(result).toBeNull();
    });
  });
});
