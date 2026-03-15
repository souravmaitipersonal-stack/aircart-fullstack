/**
 * Order Routes
 * Phase 4: Orders & Payments - API Endpoints
 * Path: packages/api/src/routes/orders.ts
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth.middleware';
import { orderService } from '../services/order.service';
import { paypalService } from '../services/paypal.service';
import type { CreateOrderRequest } from '../models/Order';

const router = Router();

// ===============================================
// Order Schemas (Validation)
// ===============================================

const ShippingAddressSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^\d{10}$/, 'Invalid phone number'),
  street: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/),
  country: z.string().min(2),
});

const CreateOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      price: z.number().positive(),
      quantity: z.number().int().positive(),
      discount: z.number().optional(),
    })
  ),
  shippingAddress: ShippingAddressSchema,
  paymentMethod: z.enum(['paypal', 'credit_card', 'debit_card']),
});

// ===============================================
// POST /api/orders - Create new order
// ===============================================
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = CreateOrderSchema.parse(req.body);

    // Create order
    const order = await orderService.createOrder(req.user!.id, validatedData as CreateOrderRequest);

    // If PayPal payment, create PayPal order
    if (validatedData.paymentMethod === 'paypal') {
      const paypalItems = validatedData.items.map((item) => ({
        name: item.name,
        quantity: String(item.quantity),
        unit_amount: {
          currency_code: 'USD',
          value: item.price.toFixed(2),
        },
      }));

      try {
        const paypalOrder = await paypalService.createOrder(
          order.total,
          'USD',
          order.orderNumber,
          paypalItems
        );

        // Find PayPal approval link
        const approvalLink = paypalOrder.links.find((link) => link.rel === 'approve');

        return res.status(201).json({
          success: true,
          data: {
            orderId: order.id,
            orderNumber: order.orderNumber,
            total: order.total,
            paypalLink: approvalLink?.href,
            paypalOrderId: paypalOrder.id,
          },
          message: 'Order created. Proceed to PayPal for payment.',
        });
      } catch (paypalError) {
        // Fall back to basic order without PayPal
        console.error('PayPal error:', paypalError);
        return res.status(201).json({
          success: true,
          data: {
            orderId: order.id,
            orderNumber: order.orderNumber,
            total: order.total,
            note: 'PayPal unavailable, order created in pending state',
          },
          message: 'Order created (PayPal temporarily unavailable)',
        });
      }
    }

    return res.status(201).json({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
      },
      message: 'Order created successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors,
      });
    }

    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order',
    });
  }
});

// ===============================================
// GET /api/orders - Get user's orders
// ===============================================
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const orders = await orderService.getUserOrders(req.user!.id);

    res.status(200).json({
      success: true,
      data: {
        orders,
        count: orders.length,
      },
      message: 'Orders retrieved successfully',
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve orders',
    });
  }
});

// ===============================================
// GET /api/orders/:orderId - Get specific order
// ===============================================
router.get('/:orderId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const order = await orderService.getOrderById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    // Verify user owns this order
    if (order.userId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
      message: 'Order retrieved successfully',
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve order',
    });
  }
});

// ===============================================
// POST /api/orders/:orderId/payment/paypal - Complete PayPal payment
// ===============================================
router.post('/:orderId/payment/paypal', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { paypalOrderId } = req.body;

    if (!paypalOrderId) {
      return res.status(400).json({
        success: false,
        error: 'PayPal order ID required',
      });
    }

    // Get order
    const order = await orderService.getOrderById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    // Verify user owns order
    if (order.userId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    // Capture PayPal payment
    try {
      const captureResponse = await paypalService.captureOrder(paypalOrderId);

      if (captureResponse.status === 'COMPLETED') {
        // Get transaction ID
        const transactionId =
          captureResponse.purchase_units[0]?.payments?.captures[0]?.id || paypalOrderId;

        // Update order with payment info
        const updatedOrder = await orderService.processPayment(req.params.orderId, paypalOrderId, transactionId);

        return res.status(200).json({
          success: true,
          data: {
            orderId: updatedOrder!.id,
            orderNumber: updatedOrder!.orderNumber,
            status: updatedOrder!.status,
            total: updatedOrder!.total,
            message: 'Payment completed successfully',
          },
          message: 'Payment processed successfully',
        });
      } else {
        // Payment not completed
        await orderService.cancelPayment(req.params.orderId, `PayPal status: ${captureResponse.status}`);

        return res.status(400).json({
          success: false,
          error: `Payment failed: ${captureResponse.status}`,
        });
      }
    } catch (paypalError) {
      console.error('PayPal capture error:', paypalError);

      // Cancel order
      await orderService.cancelPayment(req.params.orderId, paypalError instanceof Error ? paypalError.message : 'PayPal error');

      return res.status(400).json({
        success: false,
        error: paypalError instanceof Error ? paypalError.message : 'Payment processing failed',
      });
    }
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process payment',
    });
  }
});

// ===============================================
// POST /api/orders/:orderId/cancel - Cancel order
// ===============================================
router.post('/:orderId/cancel', authMiddleware, async (req: Request, res: Response) => {
  try {
    const order = await orderService.getOrderById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    // Verify user owns order
    if (order.userId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    // Can only cancel pending or processing orders
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        error: `Cannot cancel order with status: ${order.status}`,
      });
    }

    // Cancel order
    await orderService.cancelPayment(req.params.orderId, 'User requested cancellation');

    res.status(200).json({
      success: true,
      data: {
        orderId: req.params.orderId,
        status: 'cancelled',
      },
      message: 'Order cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel order',
    });
  }
});

// ===============================================
// GET /api/orders/:orderId/invoice - Generate invoice
// ===============================================
router.get('/:orderId/invoice', authMiddleware, async (req: Request, res: Response) => {
  try {
    const order = await orderService.getOrderForInvoice(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
      });
    }

    // Verify user owns order
    if (order.userId !== req.user!.id) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    // Generate simple invoice data
    const invoiceData = {
      orderNumber: order.orderNumber,
      date: order.createdAt,
      items: order.items,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shippingCost,
      total: order.total,
      shippingAddress: order.shippingAddress,
      status: order.status,
    };

    res.status(200).json({
      success: true,
      data: invoiceData,
      message: 'Invoice retrieved successfully',
    });
  } catch (error) {
    console.error('Invoice error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate invoice',
    });
  }
});

export default router;
