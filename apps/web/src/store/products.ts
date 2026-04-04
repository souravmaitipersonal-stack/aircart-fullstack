/**
 * Global Product Store
 * Manages products across admin and customer pages
 */

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  description?: string;
  image?: string;
  stock: number;
  sku?: string;
  tags?: string[];
  rating?: number;
  reviews?: number;
  dateAdded: string;
}

// In-memory product store (replace with database in production)
export const productStore: Product[] = [
  {
    id: 'prod-1',
    name: 'Wireless Earbuds Pro',
    price: 129.99,
    originalPrice: 199.99,
    category: 'Electronics',
    description: 'High-quality wireless earbuds with noise cancellation',
    stock: 45,
    sku: 'WEB-001',
    tags: ['electronics', 'audio', 'wireless'],
    rating: 4.5,
    reviews: 234,
    dateAdded: '2026-03-28',
  },
  {
    id: 'prod-2',
    name: 'USB-C Cable (2m)',
    price: 19.99,
    originalPrice: 29.99,
    category: 'Accessories',
    description: 'Durable USB-C charging and data transfer cable',
    stock: 150,
    sku: 'ACC-001',
    tags: ['accessories', 'cable', 'usb'],
    rating: 4.8,
    reviews: 567,
    dateAdded: '2026-03-25',
  },
  {
    id: 'prod-3',
    name: 'Phone Screen Protector',
    price: 9.99,
    originalPrice: 14.99,
    category: 'Accessories',
    description: 'Tempered glass screen protector for all phones',
    stock: 200,
    sku: 'ACC-002',
    tags: ['accessories', 'protection', 'screen'],
    rating: 4.6,
    reviews: 890,
    dateAdded: '2026-03-20',
  },
  {
    id: 'prod-4',
    name: 'Portable Power Bank',
    price: 49.99,
    originalPrice: 79.99,
    category: 'Electronics',
    description: '20000mAh portable battery with fast charging',
    stock: 78,
    sku: 'POW-001',
    tags: ['electronics', 'power', 'portable'],
    rating: 4.7,
    reviews: 432,
    dateAdded: '2026-03-18',
  },
  {
    id: 'prod-5',
    name: 'Wireless Mouse',
    price: 39.99,
    originalPrice: 59.99,
    category: 'Electronics',
    description: 'Ergonomic wireless mouse with precision tracking',
    stock: 95,
    sku: 'MOUSE-001',
    tags: ['electronics', 'computer', 'mouse'],
    rating: 4.4,
    reviews: 321,
    dateAdded: '2026-03-15',
  },
  {
    id: 'prod-6',
    name: 'Phone Case (Black)',
    price: 24.99,
    originalPrice: 39.99,
    category: 'Accessories',
    description: 'Premium protective phone case in black',
    stock: 120,
    sku: 'CASE-001',
    tags: ['accessories', 'protection', 'case'],
    rating: 4.5,
    reviews: 654,
    dateAdded: '2026-03-10',
  },
];

// Get all products
export function getAllProducts(): Product[] {
  return productStore;
}

// Get featured products
export function getFeaturedProducts(limit: number = 6): Product[] {
  return productStore.slice(0, limit);
}

// Get by category
export function getProductsByCategory(category: string): Product[] {
  return productStore.filter(p => p.category.toLowerCase() === category.toLowerCase());
}

// Search products
export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return productStore.filter(
    p => p.name.toLowerCase().includes(q) || 
         p.description?.toLowerCase().includes(q) ||
         p.tags?.some(tag => tag.toLowerCase().includes(q))
  );
}

// Get single product
export function getProductById(id: string): Product | undefined {
  return productStore.find(p => p.id === id);
}

// Add product (admin)
export function addProduct(product: Omit<Product, 'id' | 'dateAdded'>): Product {
  const newProduct: Product = {
    ...product,
    id: `prod-${Date.now()}`,
    dateAdded: new Date().toISOString().split('T')[0],
  };
  productStore.push(newProduct);
  return newProduct;
}

// Update product (admin)
export function updateProduct(id: string, updates: Partial<Product>): Product | undefined {
  const index = productStore.findIndex(p => p.id === id);
  if (index !== -1) {
    productStore[index] = { ...productStore[index], ...updates };
    return productStore[index];
  }
  return undefined;
}

// Delete product (admin)
export function deleteProduct(id: string): boolean {
  const index = productStore.findIndex(p => p.id === id);
  if (index !== -1) {
    productStore.splice(index, 1);
    return true;
  }
  return false;
}
