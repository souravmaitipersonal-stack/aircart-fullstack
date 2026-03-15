/**
 * Cart Store
 * Phase 3: Client-Side Cart State Management
 * Path: apps/web/src/store/cart.ts
 */

import { create } from 'zustand';
import { cartAPI } from '@/lib/api';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  discount?: number;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  items: CartItem[];
}

interface CartStore {
  // State
  items: CartItem[];
  summary: CartSummary | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchCart: () => Promise<void>;
  addItem: (productId: string, name: string, price: number, image?: string, quantity?: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchSummary: () => Promise<void>;
  setError: (error: string | null) => void;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  summary: null,
  loading: false,
  error: null,

  // Fetch cart from API
  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const response = (await cartAPI.getCart()) as any;
      if (response.success && response.data) {
        set({ items: response.data.items || [], error: null });
      } else {
        set({ error: response.error || 'Failed to fetch cart' });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error fetching cart' });
    } finally {
      set({ loading: false });
    }
  },

  // Add item to cart
  addItem: async (productId, name, price, image, quantity = 1) => {
    set({ loading: true, error: null });
    try {
      const response = await cartAPI.addItem(productId, quantity);
      if (response.success) {
        // Add to local items
        const items = get().items;
        const existingItem = items.find((item) => item.productId === productId);

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          items.push({
            id: `${productId}-${Date.now()}`,
            productId,
            name,
            price,
            image,
            quantity,
          });
        }

        set({ items, error: null });
        await get().fetchSummary();
      } else {
        set({ error: response.error || 'Failed to add item' });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error adding item' });
    } finally {
      set({ loading: false });
    }
  },

  // Remove item from cart
  removeItem: async (productId) => {
    set({ loading: true, error: null });
    try {
      const response = await cartAPI.removeItem(productId);
      if (response.success) {
        const items = get().items.filter((item) => item.productId !== productId);
        set({ items, error: null });
        await get().fetchSummary();
      } else {
        set({ error: response.error || 'Failed to remove item' });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error removing item' });
    } finally {
      set({ loading: false });
    }
  },

  // Update item quantity
  updateQuantity: async (productId, quantity) => {
    set({ loading: true, error: null });
    try {
      if (quantity <= 0) {
        await get().removeItem(productId);
        return;
      }

      const response = await cartAPI.updateItem(productId, quantity);
      if (response.success) {
        const items = get().items.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        );
        set({ items, error: null });
        await get().fetchSummary();
      } else {
        set({ error: response.error || 'Failed to update item' });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error updating item' });
    } finally {
      set({ loading: false });
    }
  },

  // Clear cart
  clearCart: async () => {
    set({ loading: true, error: null });
    try {
      const response = await cartAPI.clear();
      if (response.success) {
        set({ items: [], summary: null, error: null });
      } else {
        set({ error: response.error || 'Failed to clear cart' });
      }
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Error clearing cart' });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch cart summary
  fetchSummary: async () => {
    try {
      const response = (await cartAPI.getSummary()) as any;
      if (response.success && response.data) {
        set({ summary: response.data as any });
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  },

  // Set error
  setError: (error) => set({ error }),
}));
