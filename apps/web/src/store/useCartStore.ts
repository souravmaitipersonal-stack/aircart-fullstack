/**
 * Shopping Cart Store (Zustand)
 */

import { create } from 'zustand';
import { Product } from './useProductStore';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface CartStore {
  items: CartItem[];
  shippingAddress: ShippingAddress | null;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setShippingAddress: (address: ShippingAddress) => void;
  getTotal: () => number;
  getItemCount: () => number;
  getCartItems: () => CartItem[];
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  shippingAddress: null,

  addItem: (product, quantity = 1) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.product.id === product.id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }
      return { items: [...state.items, { product, quantity }] };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    })),

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    })),

  clearCart: () => set({ items: [], shippingAddress: null }),

  setShippingAddress: (address) => set({ shippingAddress: address }),

  getTotal: () =>
    get().items.reduce((total, item) => total + item.product.price * item.quantity, 0),

  getItemCount: () =>
    get().items.reduce((count, item) => count + item.quantity, 0),

  getCartItems: () => get().items,
}));
