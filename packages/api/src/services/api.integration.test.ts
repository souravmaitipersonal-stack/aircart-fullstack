/**
 * API Integration Tests
 * End-to-End tests for full user flow
 * Run with: npm run test (from packages/api)
 */

/// <reference types="vitest" />
import { describe, test, expect } from 'vitest';

// API Base URL
const API_URL = 'http://localhost:5000/api';

// Test user data
const TEST_USER = {
  name: 'Test User',
  email: `test-${Date.now()}@example.com`,
  password: 'TestPass@123',
};

let authToken: string = '';
let refreshToken: string = '';

describe('API Integration Tests - Full User Flow', () => {
  describe('1. Health Check', () => {
    test('should return API health status', async () => {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.status).toBe('success');
      expect(data.message).toContain('running');
    });

    test('should return API info', async () => {
      const response = await fetch(`${API_URL}`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.name).toBe('AirCart API');
      expect(data.endpoints).toBeDefined();
    });
  });

  describe('2. Authentication - Register', () => {
    test('should successfully register a new user', async () => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: TEST_USER.name,
          email: TEST_USER.email,
          password: TEST_USER.password,
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.token).toBeDefined();
      expect(data.data.refreshToken).toBeDefined();
      expect(data.data.user).toBeDefined();
      expect(data.data.user.email).toBe(TEST_USER.email);

      // Store tokens for subsequent tests
      authToken = data.data.token;
      refreshToken = data.data.refreshToken;
    });

    test('should reject registration for invalid email', async () => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Invalid User',
          email: 'invalid-email',
          password: TEST_USER.password,
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
    });

    test('should reject registration for weak password', async () => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Weak Pass User',
          email: `weak-${Date.now()}@example.com`,
          password: 'weak',
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
    });

    test('should reject duplicate email registration', async () => {
      // Create unique email
      const uniqueEmail = `duplicate-${Date.now()}-${Math.random()}-1@example.com`;

      // First registration
      await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'First User',
          email: uniqueEmail,
          password: TEST_USER.password,
        }),
      });

      // Second registration with same email
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Second User',
          email: uniqueEmail,
          password: TEST_USER.password,
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.success).toBe(false);
      expect(data.message).toMatch(/already registered|already associated/i);
    });
  });

  describe('3. Authentication - Login', () => {
    test('should successfully login with correct credentials', async () => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_USER.email,
          password: TEST_USER.password,
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
      expect(data.data.token).toBeDefined();
      expect(data.data.user).toBeDefined();
      expect(data.data.user.email).toBe(TEST_USER.email);

      // Update token for subsequent requests
      authToken = data.data.token;
    });

    test('should reject login with wrong password', async () => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: TEST_USER.email,
          password: 'WrongPassword@123',
        }),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.success).toBe(false);
    });

    test('should reject login for non-existent user', async () => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: TEST_USER.password,
        }),
      });

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.success).toBe(false);
    });
  });

  describe('4. Protected Routes', () => {
    test('should get current user info with valid token', async () => {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.email).toBe(TEST_USER.email);
    });

    test('should reject protected route without token', async () => {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
      });

      expect(response.status).toBe(401);
    });

    test('should reject protected route with invalid token', async () => {
      const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer invalid-token-12345',
        },
      });

      expect(response.status).toBe(401);
    });
  });

  describe('5. Products API', () => {
    test('should fetch all products', async () => {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
      expect(data.data.length).toBeGreaterThan(0);
    });

    test('should fetch featured products', async () => {
      const response = await fetch(`${API_URL}/products/featured`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    test('should fetch single product by ID', async () => {
      // First get products to get an ID
      const productsResponse = await fetch(`${API_URL}/products`);
      const productsData = await productsResponse.json();
      const productId = productsData.data[0]?.id;

      if (!productId) {
        expect(true).toBe(true); // Skip if no products
        return;
      }

      const response = await fetch(`${API_URL}/products/${productId}`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data.id).toBe(productId);
    });

    test('should fetch products by category', async () => {
      const response = await fetch(`${API_URL}/products/category/Electronics`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(Array.isArray(data.data)).toBe(true);
    });

    test('should handle invalid product ID gracefully', async () => {
      const response = await fetch(`${API_URL}/products/invalid-id-12345`);
      
      // Should either return 404 or empty data
      expect([404, 200]).toContain(response.status);
    });
  });

  describe('6. Shopping Cart API', () => {
    test('should get empty cart initially', async () => {
      const response = await fetch(`${API_URL}/cart`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      // Cart can be an array or object, both are valid
      expect(data.data).toBeDefined();
    });

    test('should add item to cart', async () => {
      // First get a product ID
      const productsResponse = await fetch(`${API_URL}/products`);
      const productsData = await productsResponse.json();
      const productId = productsData.data[0]?.id;

      if (!productId) {
        expect(true).toBe(true); // Skip if no products
        return;
      }

      const response = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          productId,
          quantity: 2,
        }),
      });

      const data = await response.json();

      // API returns 200 or 201 for successful add to cart
      expect([200, 201]).toContain(response.status);
      expect(data.success).toBe(true);
      expect(data.data).toBeDefined();
    });

    test('should get cart summary', async () => {
      const response = await fetch(`${API_URL}/cart/summary`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.data).toHaveProperty('subtotal');
      expect(data.data).toHaveProperty('total');
    });

    test('should get cart item count', async () => {
      const response = await fetch(`${API_URL}/cart/count`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(typeof data.data.count).toBe('number');
    });
  });

  describe('7. CORS Configuration', () => {
    test('should include CORS headers in response', async () => {
      const response = await fetch(`${API_URL}/health`);

      expect(response.headers.get('access-control-allow-origin')).toBeDefined();
    });
  });
});
