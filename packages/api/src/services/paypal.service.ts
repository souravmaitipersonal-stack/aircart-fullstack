// @ts-nocheck
/**
 * PayPal Service
 * Phase 4: PayPal Integration for Payment Processing
 * Path: packages/api/src/services/paypal.service.ts
 */

interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  apiMode: 'sandbox' | 'live';
}

interface PayPalOrder {
  id: string;
  status: 'CREATED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'COMPLETED' | 'PAYER_ACTION_REQUIRED';
  links: Array<{ rel: string; href: string; method: string }>;
}

interface PayPalError {
  error: string;
  error_description: string;
}

export class PayPalService {
  private clientId: string;
  private clientSecret: string;
  private apiMode: 'sandbox' | 'live';
  private baseUrl: string;

  constructor(config: PayPalConfig) {
    this.clientId = config.clientId;
    this.clientSecret = config.clientSecret;
    this.apiMode = config.apiMode;
    // For demo, use sandbox
    this.baseUrl = 'https://api-m.sandbox.paypal.com';
  }

  /**
   * Get access token from PayPal
   */
  async getAccessToken(): Promise<string> {
    const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const error = (await response.json()) as PayPalError;
      throw new Error(`PayPal auth failed: ${error.error_description}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  /**
   * Create PayPal order
   */
  async createOrder(
    amount: number,
    currency: string,
    orderId: string,
    items: Array<{ name: string; quantity: number; unit_amount: string }>
  ): Promise<PayPalOrder> {
    const accessToken = await this.getAccessToken();

    const payloadRequest = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: orderId,
          amount: {
            currency_code: currency,
            value: amount.toString(),
            breakdown: {
              item_total: {
                currency_code: currency,
                value: amount.toString(),
              },
            },
          },
          items: items,
          custom_id: orderId,
          description: `Order ${orderId}`,
        },
      ],
      application_context: {
        brand_name: 'AirCart',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `${process.env.FRONTEND_URL}/checkout/success`,
        cancel_url: `${process.env.FRONTEND_URL}/checkout/cancel`,
      },
    };

    const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payloadRequest),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`PayPal order creation failed: ${JSON.stringify(error)}`);
    }

    return await response.json();
  }

  /**
   * Get PayPal order details
   */
  async getOrderDetails(paypalOrderId: string): Promise<PayPalOrder> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${paypalOrderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`PayPal order fetch failed: ${JSON.stringify(error)}`);
    }

    return await response.json();
  }

  /**
   * Capture PayPal order (complete payment)
   */
  async captureOrder(paypalOrderId: string): Promise<{ id: string; status: string; purchase_units: any[] }> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(`PayPal capture failed: ${JSON.stringify(data.details || data.message)}`);
    }

    return await response.json();
  }

  /**
   * Validate PayPal webhook
   */
  async validateWebhook(
    body: string,
    headers: Record<string, string | string[] | undefined>
  ): Promise<boolean> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        webhook_id: process.env.PAYPAL_WEBHOOK_ID || '',
        webhook_event: JSON.parse(body),
        transmission_id: headers['paypal-transmission-id'],
        transmission_time: headers['paypal-transmission-time'],
        cert_url: headers['paypal-cert-url'],
        auth_algo: headers['paypal-auth-algo'],
        transmission_sig: headers['paypal-transmission-sig'],
      }),
    });

    const data = await response.json();
    return data.verification_status === 'SUCCESS';
  }
}

// Initialize PayPal service
export const paypalService = new PayPalService({
  clientId: process.env.PAYPAL_CLIENT_ID || '',
  clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
  apiMode: (process.env.PAYPAL_MODE as 'sandbox' | 'live') || 'sandbox',
});
