// @ts-nocheck
/**
 * PayPal Webhook Handler
 * Phase 4: Orders & Payments
 * Path: packages/api/src/routes/webhooks.ts
 */

import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { orderService } from '../services/order.service';
import { paypalService } from '../services/paypal.service';

const router = Router();

// PayPal webhook signature verification
const verifyPayPalSignature = async (
  event: any,
  transmissionId: string,
  transmissionTime: string,
  certUrl: string,
  signature: string
): Promise<boolean> => {
  try {
    // In production, verify the signature using PayPal's certificate
    // For demo, we'll skip this verification
    console.log('✓ Webhook signature validation (demo mode - skipped)');
    return true;
  } catch (error) {
    console.error('Signature verification failed:', error);
    return false;
  }
};

// ===============================================
// POST /api/webhooks/paypal - PayPal webhook
// ===============================================
router.post('/paypal', async (req: Request, res: Response) => {
  try {
    const event = req.body;

    // Extract PayPal headers
    const transmissionId = req.headers['paypal-transmission-id'] as string;
    const transmissionTime = req.headers['paypal-transmission-time'] as string;
    const certUrl = req.headers['paypal-cert-url'] as string;
    const signature = req.headers['paypal-auth-algo'] as string;

    // Verify webhook authenticity
    const isValid = await verifyPayPalSignature(
      event,
      transmissionId,
      transmissionTime,
      certUrl,
      signature
    );

    if (!isValid) {
      console.warn('Invalid PayPal webhook signature');
      return res.status(403).json({
        success: false,
        error: 'Invalid signature',
      });
    }

    console.log('📬 PayPal Webhook Received:', event.event_type);

    // Handle different webhook events
    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        return handlePaymentCaptureCompleted(event, res);

      case 'PAYMENT.CAPTURE.DENIED':
        return handlePaymentCaptureDenied(event, res);

      case 'PAYMENT.CAPTURE.REFUNDED':
        return handlePaymentCaptureRefunded(event, res);

      case 'CHECKOUT.ORDER.COMPLETED':
        return handleCheckoutOrderCompleted(event, res);

      default:
        // Acknowledge unhandled events
        console.log(`⚠️  Unhandled webhook event: ${event.event_type}`);
        return res.status(200).json({
          success: true,
          message: 'Webhook received',
        });
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    // Always return 200 to acknowledge receipt
    res.status(200).json({
      success: false,
      error: error instanceof Error ? error.message : 'Webhook processing failed',
    });
  }
});

// ===============================================
// Handle Payment Capture Completed
// ===============================================
async function handlePaymentCaptureCompleted(event: any, res: Response) {
  const { resource } = event;
  const paypalOrderId = resource.supplementary_data?.related_ids?.order_id;

  if (!paypalOrderId) {
    return res.status(200).json({
      success: true,
      message: 'Webhook processed (no order ID)',
    });
  }

  try {
    // Find order by PayPal order ID
    // In a real system, you'd query the database
    // For demo, we'll log this
    console.log(`✅ Payment captured for PayPal Order: ${paypalOrderId}`);
    console.log(`   Amount: ${resource.amount?.value} ${resource.amount?.currency_code}`);
    console.log(`   Status: ${resource.status}`);

    // Update order status in database
    // await orderService.updateOrderStatus(orderId, 'confirmed');

    return res.status(200).json({
      success: true,
      message: 'Payment capture processed',
    });
  } catch (error) {
    console.error('Error processing payment capture:', error);
    return res.status(200).json({
      success: true,
      message: 'Webhook acknowledged',
    });
  }
}

// ===============================================
// Handle Payment Capture Denied
// ===============================================
async function handlePaymentCaptureDenied(event: any, res: Response) {
  const { resource } = event;
  const paypalOrderId = resource.supplementary_data?.related_ids?.order_id;

  console.log(`❌ Payment denied for PayPal Order: ${paypalOrderId}`);
  console.log(`   Reason: ${resource.status_details?.reason}`);

  // Update order status to cancelled
  // await orderService.updateOrderStatus(orderId, 'cancelled');

  return res.status(200).json({
    success: true,
    message: 'Payment denial processed',
  });
}

// ===============================================
// Handle Payment Refund
// ===============================================
async function handlePaymentCaptureRefunded(event: any, res: Response) {
  const { resource } = event;
  const originalCaptureId = resource.links?.[0]?.rel === 'up' ? resource.links[0].href : null;

  console.log(`💰 Payment refunded: ${resource.id}`);
  console.log(`   Amount: ${resource.amount?.value} ${resource.amount?.currency_code}`);

  // Update order status if needed
  // Track refund in database

  return res.status(200).json({
    success: true,
    message: 'Refund processed',
  });
}

// ===============================================
// Handle Checkout Order Completed
// ===============================================
async function handleCheckoutOrderCompleted(event: any, res: Response) {
  const { resource } = event;
  const paypalOrderId = resource.id;

  console.log(`🎉 Checkout completed: ${paypalOrderId}`);
  console.log(`   Status: ${resource.status}`);
  console.log(`   Payer: ${resource.payer?.email_address}`);

  return res.status(200).json({
    success: true,
    message: 'Checkout order processed',
  });
}

// ===============================================
// POST /api/webhooks/test - Test webhook
// ===============================================
router.post('/test', (req: Request, res: Response) => {
  try {
    const event = req.body;

    console.log('🧪 Test webhook received:', {
      eventType: event.event_type,
      timestamp: event.event_time,
      resourceId: event.resource?.id,
    });

    res.status(200).json({
      success: true,
      message: 'Test webhook processed',
      received: event,
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      message: 'Webhook acknowledged',
    });
  }
});

export default router;
