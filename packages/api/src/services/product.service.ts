/**
 * Product Service
 * Business logic for product operations: CRUD, search, filtering, inventory
 * Phase 3: Product Management
 */

import { 
  Product, 
  CreateProductRequest, 
  UpdateProductRequest, 
  ProductFilter,
  PaginatedProducts,
  ProductResponse 
} from '../models/Product';

// In-memory product store for Phase 3 demo
// In Phase 3.5, will switch to database
const productStore = new Map<string, Product>();

/**
 * Generate demo products for testing
 */
export function seedDemoProducts(): void {
  const demoProducts: Product[] = [
    {
      id: 'prod-001',
      name: 'Wireless Bluetooth Headphones',
      description: 'Premium noise-canceling wireless headphones with 30-hour battery life',
      price: 149.99,
      originalPrice: 199.99,
      stock: 150,
      category: 'Electronics',
      subcategory: 'Audio',
      images: [
        'https://via.placeholder.com/300x300?text=Headphones+1',
        'https://via.placeholder.com/300x300?text=Headphones+2',
      ],
      rating: 4.7,
      reviewCount: 2145,
      tags: ['wireless', 'bluetooth', 'noise-canceling', 'premium'],
      sku: 'WBHP-001',
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin-001',
    },
    {
      id: 'prod-002',
      name: '4K Webcam',
      description: 'Crystal clear 4K resolution webcam perfect for streaming and video calls',
      price: 79.99,
      originalPrice: 99.99,
      stock: 200,
      category: 'Electronics',
      subcategory: 'Cameras',
      images: [
        'https://via.placeholder.com/300x300?text=Webcam+1',
      ],
      rating: 4.5,
      reviewCount: 856,
      tags: ['4k', 'webcam', 'streaming'],
      sku: 'CAM-4K-001',
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin-001',
    },
    {
      id: 'prod-003',
      name: 'USB-C Hub with Docking',
      description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and power delivery',
      price: 49.99,
      stock: 300,
      category: 'Electronics',
      subcategory: 'Accessories',
      images: [
        'https://via.placeholder.com/300x300?text=USB+Hub+1',
      ],
      rating: 4.3,
      reviewCount: 543,
      tags: ['usb-c', 'hub', 'docking'],
      sku: 'USB-HUB-7IN1',
      isActive: true,
      isFeatured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin-001',
    },
    {
      id: 'prod-004',
      name: 'Mechanical Keyboard RGB',
      description: 'Premium mechanical keyboard with RGB lighting and hot-swap switches',
      price: 129.99,
      originalPrice: 159.99,
      stock: 100,
      category: 'Electronics',
      subcategory: 'Peripherals',
      images: [
        'https://via.placeholder.com/300x300?text=Keyboard+1',
        'https://via.placeholder.com/300x300?text=Keyboard+2',
      ],
      rating: 4.8,
      reviewCount: 1200,
      tags: ['mechanical', 'rgb', 'gaming', 'keyboard'],
      sku: 'MECH-KBD-RGB',
      isActive: true,
      isFeatured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'admin-001',
    },
  ];

  demoProducts.forEach(product => {
    productStore.set(product.id, product);
  });
}

/**
 * Get all products with filtering and pagination
 */
export async function getProducts(
  filter: ProductFilter = {}
): Promise<PaginatedProducts> {
  let products = Array.from(productStore.values());

  // Filter by search
  if (filter.search) {
    const searchLower = filter.search.toLowerCase();
    products = products.filter(
      p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  // Filter by category
  if (filter.category) {
    products = products.filter(p => p.category.toLowerCase() === filter.category!.toLowerCase());
  }

  // Filter by price range
  if (filter.minPrice !== undefined) {
    products = products.filter(p => p.price >= filter.minPrice!);
  }
  if (filter.maxPrice !== undefined) {
    products = products.filter(p => p.price <= filter.maxPrice!);
  }

  // Filter by tags
  if (filter.tags && filter.tags.length > 0) {
    products = products.filter(p =>
      filter.tags!.some(tag => p.tags.includes(tag))
    );
  }

  // Filter by stock
  if (filter.inStock) {
    products = products.filter(p => p.stock > 0);
  }

  // Filter by featured
  if (filter.isFeatured) {
    products = products.filter(p => p.isFeatured);
  }

  // Sort
  const sortBy = filter.sortBy || 'name';
  const sortOrder = filter.sortOrder === 'desc' ? -1 : 1;

  products.sort((a, b) => {
    let aVal: any, bVal: any;

    switch (sortBy) {
      case 'price':
        aVal = a.price;
        bVal = b.price;
        break;
      case 'rating':
        aVal = a.rating;
        bVal = b.rating;
        break;
      case 'newest':
        aVal = a.createdAt;
        bVal = b.createdAt;
        break;
      case 'name':
      default:
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
    }

    if (aVal < bVal) return -sortOrder;
    if (aVal > bVal) return sortOrder;
    return 0;
  });

  // Pagination
  const page = filter.page || 1;
  const limit = filter.limit || 20;
  const start = (page - 1) * limit;
  const paginatedProducts = products.slice(start, start + limit);

  return {
    data: paginatedProducts.map(formatProductResponse),
    total: products.length,
    page,
    pages: Math.ceil(products.length / limit),
    limit,
  };
}

/**
 * Get single product by ID
 */
export async function getProductById(productId: string): Promise<ProductResponse | null> {
  const product = productStore.get(productId);
  return product ? formatProductResponse(product) : null;
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit: number = 6): Promise<ProductResponse[]> {
  return Array.from(productStore.values())
    .filter(p => p.isFeatured && p.isActive)
    .slice(0, limit)
    .map(formatProductResponse);
}

/**
 * Get products by category
 */
export async function getProductsByCategory(
  category: string,
  limit: number = 10
): Promise<ProductResponse[]> {
  return Array.from(productStore.values())
    .filter(p => p.category.toLowerCase() === category.toLowerCase() && p.isActive)
    .slice(0, limit)
    .map(formatProductResponse);
}

/**
 * Create product (admin only)
 */
export async function createProduct(
  req: CreateProductRequest,
  adminId: string
): Promise<Product> {
  const id = `prod-${Date.now()}`;
  const product: Product = {
    id,
    ...req,
    tags: req.tags || [],
    rating: 0,
    reviewCount: 0,
    isActive: true,
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: adminId,
  };

  productStore.set(id, product);
  return product;
}

/**
 * Update product (admin only)
 */
export async function updateProduct(
  productId: string,
  updates: UpdateProductRequest
): Promise<Product | null> {
  const product = productStore.get(productId);
  if (!product) return null;

  const updated = {
    ...product,
    ...updates,
    id: product.id,
    createdAt: product.createdAt,
    updatedAt: new Date(),
  };

  productStore.set(productId, updated);
  return updated;
}

/**
 * Delete product (admin only)
 */
export async function deleteProduct(productId: string): Promise<boolean> {
  return productStore.delete(productId);
}

/**
 * Check product availability
 */
export async function checkInventory(
  productId: string,
  quantity: number
): Promise<{ available: boolean; stock: number }> {
  const product = productStore.get(productId);
  if (!product) {
    return { available: false, stock: 0 };
  }

  return {
    available: product.stock >= quantity,
    stock: product.stock,
  };
}

/**
 * Update inventory after order
 */
export async function updateInventory(
  productId: string,
  quantityChange: number
): Promise<boolean> {
  const product = productStore.get(productId);
  if (!product) return false;

  product.stock += quantityChange;
  productStore.set(productId, product);
  return true;
}

/**
 * Format product for API response
 */
export function formatProductResponse(product: Product): ProductResponse {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : undefined;

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice,
    discount,
    stock: product.stock,
    category: product.category,
    images: product.images,
    rating: product.rating,
    reviewCount: product.reviewCount,
    tags: product.tags,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
  };
}

// Initialize with demo products
seedDemoProducts();
