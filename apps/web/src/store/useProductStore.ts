/**
 * Global Product Store (Zustand)
 * Shared across admin and customer UI
 */

import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  stock: number;
  category: string;
  tags: string[];
  image: string;
  sku: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductStore {
  products: Product[];
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  searchProducts: (query: string) => Product[];
  syncFromAdmin: () => Promise<void>;
}

// Demo products for initial state
const demoProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'Latest flagship Apple smartphone with advanced camera system',
    price: 119999,
    originalPrice: 134999,
    stock: 50,
    category: 'Mobiles',
    tags: ['latest', 'flagship', 'premium'],
    image: 'https://via.placeholder.com/300x300?text=iPhone+15+Pro',
    sku: 'IP15P-001',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'MacBook Air M3',
    description: 'Powerful and lightweight laptop for professionals',
    price: 114999,
    originalPrice: 124999,
    stock: 30,
    category: 'Laptops',
    tags: ['professional', 'lightweight', 'powerful'],
    image: 'https://via.placeholder.com/300x300?text=MacBook+Air+M3',
    sku: 'MBA-M3-001',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Sony WH-1000XM6',
    description: 'Premium noise-cancelling wireless headphones',
    price: 24999,
    originalPrice: 34999,
    stock: 100,
    category: 'Audio',
    tags: ['wireless', 'noise-cancelling', 'premium'],
    image: 'https://via.placeholder.com/300x300?text=Sony+WH-1000XM6',
    sku: 'SONY-WH-001',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'PS5 Slim',
    description: 'Next-gen gaming console with incredible performance',
    price: 44999,
    originalPrice: 54999,
    stock: 20,
    category: 'Gaming',
    tags: ['gaming', 'console', 'performance'],
    image: 'https://via.placeholder.com/300x300?text=PS5+Slim',
    sku: 'PS5-SLIM-001',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const useProductStore = create<ProductStore>((set, get) => ({
  products: demoProducts,

  setProducts: (products) => set({ products }),

  addProduct: (product) =>
    set((state) => ({ products: [...state.products, product] })),

  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      ),
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  getProductById: (id) => get().products.find((p) => p.id === id),

  getProductsByCategory: (category) =>
    get().products.filter((p) => p.category === category && p.isActive),

  searchProducts: (query) => {
    const lower = query.toLowerCase();
    return get().products.filter(
      (p) =>
        p.isActive &&
        (p.name.toLowerCase().includes(lower) ||
          p.description.toLowerCase().includes(lower) ||
          p.tags.some((t) => t.toLowerCase().includes(lower)))
    );
  },

  syncFromAdmin: async () => {
    // This would fetch from API in production
    // For now, products are synced automatically
  },
}));
