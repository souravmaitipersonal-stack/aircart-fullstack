// @ts-nocheck
/**
 * Product Routes
 * CRUD operations, search, filtering, featured products
 * Phase 3: Product Management Endpoints
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  checkInventory,
} from '../services/product.service';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';
import { logInfo, logError, logSuccess } from '../config/logger';

const router = Router();

// Validation schemas
const createProductSchema = z.object({
  name: z.string().min(1, 'Product name required'),
  description: z.string().min(10, 'Description too short'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  originalPrice: z.number().min(0).optional(),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  category: z.string().min(1, 'Category required'),
  subcategory: z.string().optional(),
  images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image required'),
  tags: z.array(z.string()).optional(),
  sku: z.string().min(1, 'SKU required'),
  weight: z.number().optional(),
  dimensions: z.object({
    length: z.number(),
    width: z.number(),
    height: z.number(),
  }).optional(),
});

const updateProductSchema = createProductSchema.partial();

const filterSchema = z.object({
  category: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  search: z.string().optional(),
  tags: z.string().optional(), // comma-separated
  inStock: z.coerce.boolean().optional(),
  isFeatured: z.coerce.boolean().optional(),
  sortBy: z.enum(['name', 'price', 'rating', 'newest']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

/**
 * GET /api/products
 * Get all products with filtering and pagination
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const validatedData = filterSchema.parse(req.query);
    const tags = validatedData.tags ? validatedData.tags.split(',') : undefined;

    const results = await getProducts({
      ...validatedData,
      tags,
    });

    res.status(200).json({
      success: true,
      data: results.data,
      pagination: {
        total: results.total,
        page: results.page,
        pages: results.pages,
        limit: results.limit,
      },
      message: `Retrieved ${results.data.length} products`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logError('Validation error in get products', error);
      res.status(400).json({
        success: false,
        error: 'Invalid filters',
        details: error.errors,
      });
      return;
    }

    logError('Get products error', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
    });
  }
});

/**
 * GET /api/products/featured
 * Get featured products
 */
router.get('/featured', async (req: Request, res: Response) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 6, 20);
    const products = await getFeaturedProducts(limit);

    res.status(200).json({
      success: true,
      data: products,
      message: `Retrieved ${products.length} featured products`,
    });
  } catch (error) {
    logError('Get featured products error', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured products',
    });
  }
});

/**
 * GET /api/products/category/:category
 * Get products by category
 */
router.get('/category/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const products = await getProductsByCategory(category, limit);

    if (products.length === 0) {
      res.status(404).json({
        success: false,
        error: 'No products found',
        message: `No products found in category: ${category}`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: products,
      message: `Retrieved ${products.length} products from ${category}`,
    });
  } catch (error) {
    logError('Get products by category error', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
    });
  }
});

/**
 * GET /api/products/:id
 * Get single product by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);

    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Product not found',
        message: `Product with ID ${id} not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    logError('Get product error', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
    });
  }
});

/**
 * POST /api/products
 * Create new product (admin only)
 */
router.post('/', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const validatedData = createProductSchema.parse(req.body);
    const product = await createProduct(validatedData, req.user!.id);

    logSuccess(`Product created: ${product.name}`);

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logError('Validation error in create product', error);
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
      return;
    }

    logError('Create product error', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create product',
    });
  }
});

/**
 * PUT /api/products/:id
 * Update product (admin only)
 */
router.put('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateProductSchema.parse(req.body);
    const product = await updateProduct(id, validatedData);

    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Product not found',
      });
      return;
    }

    logSuccess(`Product updated: ${product.name}`);

    res.status(200).json({
      success: true,
      data: product,
      message: 'Product updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logError('Validation error in update product', error);
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
      return;
    }

    logError('Update product error', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product',
    });
  }
});

/**
 * DELETE /api/products/:id
 * Delete product (admin only)
 */
router.delete('/:id', authMiddleware, adminMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = await deleteProduct(id);

    if (!success) {
      res.status(404).json({
        success: false,
        error: 'Product not found',
      });
      return;
    }

    logSuccess(`Product deleted: ${id}`);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    logError('Delete product error', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete product',
    });
  }
});

/**
 * GET /api/products/:id/inventory
 * Check product inventory
 */
router.get('/:id/inventory', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const quantity = parseInt(req.query.quantity as string) || 1;

    const inventory = await checkInventory(id, quantity);

    res.status(200).json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    logError('Check inventory error', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check inventory',
    });
  }
});

export default router;
