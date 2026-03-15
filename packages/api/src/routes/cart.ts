/**
 * Shopping Cart Routes
 * Cart management endpoints: get, add, remove, update, clear
 * Phase 3: Shopping Cart System
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  getCartItemCount,
  getCartSummary,
} from '../services/cart.service';
import { getProductById } from '../services/product.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { logError, logSuccess, logInfo } from '../config/logger';

const router = Router();

// Validation schemas
const addToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(100, 'Quantity too high'),
});

const updateCartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID required'),
  quantity: z.number().int().min(0, 'Quantity cannot be negative').max(100),
});

/**
 * GET /api/cart
 * Get user's shopping cart (protected)
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const cart = await getCart(userId);

    if (!cart || cart.items.length === 0) {
      res.status(200).json({
        success: true,
        data: {
          items: [],
          subtotal: 0,
          tax: 0,
          total: 0,
          isEmpty: true,
        },
        message: 'Cart is empty',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        id: cart.id,
        items: cart.items,
        subtotal: cart.subtotal,
        tax: cart.tax,
        total: cart.total,
        isEmpty: cart.items.length === 0,
      },
      message: `Cart contains ${cart.items.length} items`,
    });
  } catch (error) {
    logError('Get cart error', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cart',
    });
  }
});

/**
 * GET /api/cart/count
 * Get cart item count (protected)
 */
router.get('/count', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const count = await getCartItemCount(userId);

    res.status(200).json({
      success: true,
      data: { count },
    });
  } catch (error) {
    logError('Get cart count error', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cart count',
    });
  }
});

/**
 * GET /api/cart/summary
 * Get cart summary totals (protected)
 */
router.get('/summary', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const summary = await getCartSummary(userId);

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    logError('Get cart summary error', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cart summary',
    });
  }
});

/**
 * POST /api/cart/add
 * Add item to cart (protected)
 */
router.post('/add', authMiddleware, async (req: Request, res: Response) => {
  try {
    const validatedData = addToCartSchema.parse(req.body);
    const userId = req.user!.id;

    // Get product details
    const product = await getProductById(validatedData.productId);
    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Product not found',
      });
      return;
    }

    // Add to cart
    const cart = await addToCart(userId, validatedData as any, {
      name: product.name,
      price: product.price,
      image: product.images[0],
    });

    if (!cart) {
      res.status(500).json({
        success: false,
        error: 'Failed to add item to cart',
      });
      return;
    }

    logSuccess(`Item added to cart - User: ${userId}, Product: ${product.name}`);

    res.status(201).json({
      success: true,
      data: {
        id: cart.id,
        items: cart.items,
        subtotal: cart.subtotal,
        tax: cart.tax,
        total: cart.total,
      },
      message: `${product.name} added to cart`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logError('Validation error in add to cart', error);
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
      return;
    }

    const message = error instanceof Error ? error.message : 'Failed to add item to cart';
    logError('Add to cart error', error);
    res.status(400).json({
      success: false,
      error: message,
    });
  }
});

/**
 * PUT /api/cart/update
 * Update cart item quantity (protected)
 */
router.put('/update', authMiddleware, async (req: Request, res: Response) => {
  try {
    const validatedData = updateCartItemSchema.parse(req.body);
    const userId = req.user!.id;

    const cart = await updateCartItem(userId, validatedData as any);

    if (!cart) {
      res.status(500).json({
        success: false,
        error: 'Failed to update cart',
      });
      return;
    }

    logSuccess(`Cart updated - User: ${userId}`);

    res.status(200).json({
      success: true,
      data: {
        id: cart.id,
        items: cart.items,
        subtotal: cart.subtotal,
        tax: cart.tax,
        total: cart.total,
      },
      message: 'Cart updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      logError('Validation error in update cart', error);
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
      return;
    }

    const message = error instanceof Error ? error.message : 'Failed to update cart';
    logError('Update cart error', error);
    res.status(400).json({
      success: false,
      error: message,
    });
  }
});

/**
 * DELETE /api/cart/item/:productId
 * Remove item from cart (protected)
 */
router.delete('/item/:productId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = req.user!.id;

    const cart = await removeFromCart(userId, productId);

    if (!cart) {
      res.status(500).json({
        success: false,
        error: 'Failed to remove item',
      });
      return;
    }

    logSuccess(`Item removed from cart - User: ${userId}, Product: ${productId}`);

    res.status(200).json({
      success: true,
      data: {
        id: cart.id,
        items: cart.items,
        subtotal: cart.subtotal,
        tax: cart.tax,
        total: cart.total,
      },
      message: 'Item removed from cart',
    });
  } catch (error) {
    logError('Remove from cart error', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove item',
    });
  }
});

/**
 * DELETE /api/cart
 * Clear entire cart (protected)
 */
router.delete('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    const cart = await clearCart(userId);

    if (!cart) {
      res.status(500).json({
        success: false,
        error: 'Failed to clear cart',
      });
      return;
    }

    logSuccess(`Cart cleared - User: ${userId}`);

    res.status(200).json({
      success: true,
      data: {
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
      },
      message: 'Cart cleared successfully',
    });
  } catch (error) {
    logError('Clear cart error', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear cart',
    });
  }
});

export default router;
