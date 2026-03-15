/**
 * Order Service
 * Phase 4: Orders & Payments - Business Logic
 * Path: packages/api/src/services/order.service.ts
 */

import type { Order, CreateOrderRequest, OrderStatus, PaymentInfo, OrderSummary } from '../models/Order';

// In-memory order storage (demo)
const orders = new Map<string, Order>();
let orderCounter = 1000;

export const orderService = {
  /**
   * Create a new order from cart items
   */
  createOrder: async (userId: string, request: CreateOrderRequest): Promise<Order> => {
    const orderId = `order_${Date.now()}`;
    const orderNumber = `ORD-${orderCounter++}`;

    // Calculate order totals
    const subtotal = request.items.reduce((sum, item) => {
      const itemPrice = item.price * item.quantity;
      return sum + itemPrice;
    }, 0);

    const tax = subtotal * 0.1; // 10% tax
    const shippingCost = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
    const total = subtotal + tax + shippingCost;

    // Create order items with calculations
    const orderItems = request.items.map((item) => ({
      productId: item.productId,
      productName: item.productName || 'Product',
      price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    }));

    const order: Order = {
      id: orderId,
      userId,
      orderNumber,
      items: orderItems,
      shippingAddress: request.shippingAddress,
      payment: {
        method: request.paymentMethod,
        status: 'pending',
      },
      subtotal,
      tax,
      shippingCost,
      total,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    orders.set(orderId, order);
    return order;
  },

  /**
   * Get order by ID
   */
  getOrderById: async (orderId: string): Promise<Order | null> => {
    return orders.get(orderId) || null;
  },

  /**
   * Get all orders for a user
   */
  getUserOrders: async (userId: string): Promise<OrderSummary[]> => {
    const userOrders = Array.from(orders.values())
      .filter((order) => order.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map((order) => ({
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
        estimatedDelivery: order.estimatedDelivery,
      }));

    return userOrders;
  },

  /**
   * Update order status
   */
  updateOrderStatus: async (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string,
    notes?: string
  ): Promise<Order | null> => {
    const order = orders.get(orderId);
    if (!order) return null;

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (notes) order.notes = notes;
    order.updatedAt = new Date();

    if (status === 'shipped') {
      order.estimatedDelivery = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000); // 5 more days
    } else if (status === 'delivered') {
      order.estimatedDelivery = new Date();
    }

    orders.set(orderId, order);
    return order;
  },

  /**
   * Process payment (integrate with PayPal)
   */
  processPayment: async (
    orderId: string,
    paypalOrderId: string,
    transactionId: string
  ): Promise<Order | null> => {
    const order = orders.get(orderId);
    if (!order) return null;

    order.payment = {
      method: 'paypal',
      transactionId,
      paypalOrderId,
      status: 'completed',
      paidAt: new Date(),
    };

    // Update order status to confirmed after payment
    order.status = 'confirmed';
    order.updatedAt = new Date();

    orders.set(orderId, order);
    return order;
  },

  /**
   * Cancel payment
   */
  cancelPayment: async (orderId: string, reason: string): Promise<Order | null> => {
    const order = orders.get(orderId);
    if (!order) return null;

    order.payment.status = 'cancelled';
    order.payment.error = reason;
    order.status = 'cancelled';
    order.updatedAt = new Date();

    orders.set(orderId, order);
    return order;
  },

  /**
   * Get order for invoice generation
   */
  getOrderForInvoice: async (orderId: string): Promise<Order | null> => {
    return orders.get(orderId) || null;
  },

  /**
   * Get order statistics
   */
  getOrderStats: async (userId?: string): Promise<{ totalOrders: number; totalRevenue: number; averageOrderValue: number }> => {
    let filterOrders = Array.from(orders.values());
    if (userId) {
      filterOrders = filterOrders.filter((o) => o.userId === userId);
    }

    const totalOrders = filterOrders.length;
    const totalRevenue = filterOrders
      .filter((o) => o.payment.status === 'completed')
      .reduce((sum, o) => sum + o.total, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue,
    };
  },
};
