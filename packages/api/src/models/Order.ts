/**
 * Order Model & Interfaces
 * Phase 4: Orders & Payments
 * Path: packages/api/src/models/Order.ts
 */

import type { CartItem } from './Product';

// Order status types
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Payment method types
export type PaymentMethod = 'paypal' | 'credit_card' | 'debit_card';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentInfo {
  method: PaymentMethod;
  transactionId?: string;
  paypalOrderId?: string;
  last4Digits?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paidAt?: Date;
  error?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  discount?: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  payment: PaymentInfo;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
  trackingNumber?: string;
}

export interface CreateOrderRequest {
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  trackingNumber?: string;
  notes?: string;
}

export interface OrderSummary {
  orderId: string;
  orderNumber: string;
  status: OrderStatus;
  total: number;
  createdAt: Date;
  estimatedDelivery?: Date;
}

export interface OrderHistory {
  orders: OrderSummary[];
  count: number;
  total: number;
}
