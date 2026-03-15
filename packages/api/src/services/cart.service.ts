/**
 * Shopping Cart Service
 * Cart operations: add, remove, update, calculate totals
 * Phase 3: Shopping Cart Management
 */

import {
  Cart,
  CartItem,
  AddToCartRequest,
  UpdateCartItemRequest,
} from '../models/Product';
import { checkInventory } from './product.service';

// In-memory cart store (per user)
// Production: Redis or database
const cartStore = new Map<string, Cart>();

/**
 * Get user's cart
 */
export async function getCart(userId: string): Promise<Cart | null> {
  let cart = cartStore.get(userId);

  if (!cart) {
    // Create new cart if doesn't exist
    const cartId = `cart-${Date.now()}`;
    cart = {
      id: cartId,
      userId,
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      lastModified: new Date(),
    };
    cartStore.set(userId, cart);
  }

  return cart;
}

/**
 * Add item to cart
 */
export async function addToCart(
  userId: string,
  req: AddToCartRequest,
  productData: { name: string; price: number; image: string }
): Promise<Cart | null> {
  const cart = await getCart(userId);
  if (!cart) return null;

  // Check inventory
  const inventory = await checkInventory(req.productId, req.quantity);
  if (!inventory.available) {
    throw new Error(`Insufficient stock. Only ${inventory.stock} available.`);
  }

  // Find existing item
  const existingItem = cart.items.find(item => item.productId === req.productId);

  if (existingItem) {
    // Update quantity
    existingItem.quantity += req.quantity;
    existingItem.subtotal = existingItem.quantity * existingItem.price;
  } else {
    // Add new item
    const newItem: CartItem = {
      productId: req.productId,
      productName: productData.name,
      price: productData.price,
      quantity: req.quantity,
      image: productData.image,
      subtotal: req.quantity * productData.price,
    };
    cart.items.push(newItem);
  }

  // Recalculate totals
  calculateCartTotals(cart);
  cart.lastModified = new Date();
  cartStore.set(userId, cart);

  return cart;
}

/**
 * Remove item from cart
 */
export async function removeFromCart(userId: string, productId: string): Promise<Cart | null> {
  const cart = await getCart(userId);
  if (!cart) return null;

  cart.items = cart.items.filter(item => item.productId !== productId);

  // Recalculate totals
  calculateCartTotals(cart);
  cart.lastModified = new Date();
  cartStore.set(userId, cart);

  return cart;
}

/**
 * Update cart item quantity
 */
export async function updateCartItem(
  userId: string,
  req: UpdateCartItemRequest
): Promise<Cart | null> {
  const cart = await getCart(userId);
  if (!cart) return null;

  if (req.quantity <= 0) {
    return removeFromCart(userId, req.productId);
  }

  // Check inventory
  const inventory = await checkInventory(req.productId, req.quantity);
  if (!inventory.available) {
    throw new Error(`Insufficient stock. Only ${inventory.stock} available.`);
  }

  // Update item
  const item = cart.items.find(i => i.productId === req.productId);
  if (!item) {
    throw new Error('Item not found in cart');
  }

  item.quantity = req.quantity;
  item.subtotal = item.quantity * item.price;

  // Recalculate totals
  calculateCartTotals(cart);
  cart.lastModified = new Date();
  cartStore.set(userId, cart);

  return cart;
}

/**
 * Clear cart
 */
export async function clearCart(userId: string): Promise<Cart | null> {
  const cart = await getCart(userId);
  if (!cart) return null;

  cart.items = [];
  calculateCartTotals(cart);
  cart.lastModified = new Date();
  cartStore.set(userId, cart);

  return cart;
}

/**
 * Get cart item count
 */
export async function getCartItemCount(userId: string): Promise<number> {
  const cart = await getCart(userId);
  return cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
}

/**
 * Calculate cart totals
 */
function calculateCartTotals(cart: Cart): void {
  cart.subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);

  // 10% tax (configurable)
  const TAX_RATE = 0.1;
  cart.tax = Math.round(cart.subtotal * TAX_RATE * 100) / 100;

  cart.total = cart.subtotal + cart.tax;
}

/**
 * Apply coupon/discount (placeholder for Phase 4)
 */
export async function applyCoupon(userId: string, couponCode: string): Promise<Cart | null> {
  const cart = await getCart(userId);
  if (!cart) return null;

  // Phase 4: Implement actual coupon validation
  // For now, just return cart
  return cart;
}

/**
 * Get cart summary
 */
export async function getCartSummary(userId: string): Promise<{
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  isEmpty: boolean;
} | null> {
  const cart = await getCart(userId);
  if (!cart) return null;

  return {
    itemCount: cart.items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: cart.subtotal,
    tax: cart.tax,
    total: cart.total,
    isEmpty: cart.items.length === 0,
  };
}
