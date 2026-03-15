/**
 * API Client
 * Phase 3: Frontend API Integration
 * Path: apps/web/src/lib/api.ts
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Generic API request handler
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_URL}${endpoint}`;
  const headers: any = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'An error occurred',
      };
    }

    return {
      success: true,
      data: data.data,
      message: data.message,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Product API Endpoints
 */
export const productAPI = {
  // Get all products with filters
  getProducts: async (filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    tags?: string[];
    featured?: boolean;
    inStock?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.minPrice) params.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('maxPrice', filters.maxPrice.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.tags?.length) params.append('tags', filters.tags.join(','));
    if (filters?.featured) params.append('featured', 'true');
    if (filters?.inStock) params.append('inStock', 'true');
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    return apiRequest(`/products?${params.toString()}`);
  },

  // Get featured products
  getFeatured: () => apiRequest('/products/featured'),

  // Get single product
  getById: (id: string) => apiRequest(`/products/${id}`),

  // Get products by category
  getByCategory: (category: string) => apiRequest(`/products/category/${category}`),

  // Create product (admin only)
  create: (product: any) =>
    apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }),

  // Update product (admin only)
  update: (id: string, product: any) =>
    apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    }),

  // Delete product (admin only)
  delete: (id: string) =>
    apiRequest(`/products/${id}`, {
      method: 'DELETE',
    }),

  // Check inventory
  checkInventory: (id: string, quantity: number) =>
    apiRequest(`/products/${id}/inventory?quantity=${quantity}`),
};

/**
 * Cart API Endpoints
 */
export const cartAPI = {
  // Get cart
  getCart: () => apiRequest('/cart'),

  // Add to cart
  addItem: (productId: string, quantity: number = 1) =>
    apiRequest('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),

  // Update cart item
  updateItem: (productId: string, quantity: number) =>
    apiRequest('/cart/update', {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    }),

  // Remove from cart
  removeItem: (productId: string) =>
    apiRequest(`/cart/item/${productId}`, {
      method: 'DELETE',
    }),

  // Clear cart
  clear: () =>
    apiRequest('/cart', {
      method: 'DELETE',
    }),

  // Get cart item count
  getCount: () => apiRequest('/cart/count'),

  // Get cart summary
  getSummary: () => apiRequest('/cart/summary'),
};

/**
 * Auth API Endpoints
 */
export const authAPI = {
  // Register
  register: (data: any) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Login
  login: (email: string, password: string) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Get current user
  me: () => apiRequest('/auth/me'),

  // Refresh token
  refreshToken: () =>
    apiRequest('/auth/refresh', {
      method: 'POST',
    }),

  // Logout
  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),
};
