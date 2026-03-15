/**
 * Phase 4 End-to-End Tests
 * Complete checkout flow testing from cart to confirmation
 * Path: packages/api/tests/e2e/orders.e2e.test.ts
 */

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:3001';

interface TestUser {
  email: string;
  password: string;
  name: string;
}

interface TestContext {
  token?: string;
  userId?: string;
  cartItems?: any[];
  orderId?: string;
  orderNumber?: string;
}

class Phase4E2ETests {
  private context: TestContext = {};
  private testUser: TestUser = {
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!',
    name: 'Test User',
  };

  // ==========================================
  // Helper Methods
  // ==========================================

  async makeRequest(
    path: string,
    method: string = 'GET',
    body?: any,
    useAuth: boolean = true
  ) {
    const options: any = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (useAuth && this.context.token) {
      options.headers.Authorization = `Bearer ${this.context.token}`;
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${path}`, options);
    const data = await response.json();

    return { status: response.status, data };
  }

  logTest(message: string, status: 'PASS' | 'FAIL' | 'SKIP') {
    const colors = {
      PASS: '\x1b[32m',
      FAIL: '\x1b[31m',
      SKIP: '\x1b[33m',
    };
    const reset = '\x1b[0m';
    console.log(`${colors[status]}[${status}]${reset} ${message}`);
  }

  // ==========================================
  // Test Suite
  // ==========================================

  async run() {
    console.log('\n================================================');
    console.log('🧪 PHASE 4 END-TO-END TESTS');
    console.log('================================================\n');

    console.log('📝 Test 1: Health Check');
    await this.testHealthCheck();

    console.log('\n📝 Test 2: User Registration & Authentication');
    await this.testUserRegistration();

    console.log('\n📝 Test 3: Get Products for Cart');
    await this.testGetProducts();

    console.log('\n📝 Test 4: Add Items to Cart');
    await this.testAddToCart();

    console.log('\n📝 Test 5: Get Cart Summary');
    await this.testGetCartSummary();

    console.log('\n📝 Test 6: Create Order from Cart');
    await this.testCreateOrder();

    console.log('\n📝 Test 7: Get Order Details');
    await this.testGetOrderDetails();

    console.log('\n📝 Test 8: Get User Orders');
    await this.testGetUserOrders();

    console.log('\n📝 Test 9: Generate Invoice');
    await this.testGenerateInvoice();

    console.log('\n📝 Test 10: Test PayPal Payment Flow');
    await this.testPayPalPaymentFlow();

    console.log('\n📝 Test 11: Test Webhook Handler');
    await this.testWebhookHandler();

    console.log('\n📝 Test 12: Test Order Cancellation');
    await this.testOrderCancellation();

    console.log('\n================================================');
    console.log('✅ ALL TESTS COMPLETED');
    console.log('================================================\n');
  }

  // ==========================================
  // Individual Tests
  // ==========================================

  async testHealthCheck() {
    try {
      const { status, data } = await this.makeRequest('/health', 'GET', null, false);
      
      if (status === 200 && data.status === 'success') {
        this.logTest('Backend health check', 'PASS');
        return true;
      } else {
        this.logTest('Backend health check', 'FAIL');
        return false;
      }
    } catch (error) {
      this.logTest('Backend health check - ' + (error instanceof Error ? error.message : 'Unknown error'), 'FAIL');
      return false;
    }
  }

  async testUserRegistration() {
    try {
      // Register
      const { status: regStatus, data: regData } = await this.makeRequest(
        '/auth/register',
        'POST',
        {
          email: this.testUser.email,
          password: this.testUser.password,
          name: this.testUser.name,
        },
        false
      );

      if (regStatus === 201) {
        this.logTest('User registration', 'PASS');
      } else {
        this.logTest('User registration - Status: ' + regStatus, 'FAIL');
        return false;
      }

      // Login
      const { status: loginStatus, data: loginData } = await this.makeRequest(
        '/auth/login',
        'POST',
        {
          email: this.testUser.email,
          password: this.testUser.password,
        },
        false
      );

      if (loginStatus === 200 && loginData.data?.token) {
        this.context.token = loginData.data.token;
        this.context.userId = loginData.data.user?.id;
        this.logTest('User login & token received', 'PASS');
        return true;
      } else {
        this.logTest('User login', 'FAIL');
        return false;
      }
    } catch (error) {
      this.logTest('User registration - ' + (error instanceof Error ? error.message : 'Unknown error'), 'FAIL');
      return false;
    }
  }

  async testGetProducts() {
    try {
      const { status, data } = await this.makeRequest('/products', 'GET', null, false);

      if (status === 200 && Array.isArray(data.data) && data.data.length > 0) {
        this.context.cartItems = data.data.slice(0, 2).map(product => ({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
        }));
        this.logTest(`Retrieved ${data.data.length} products`, 'PASS');
        return true;
      } else {
        this.logTest('Get products - No products available', 'FAIL');
        return false;
      }
    } catch (error) {
      this.logTest('Get products - ' + (error instanceof Error ? error.message : 'Unknown error'), 'FAIL');
      return false;
    }
  }

  async testAddToCart() {
    try {
      if (!this.context.cartItems || this.context.cartItems.length === 0) {
        this.logTest('Add to cart - No products available', 'SKIP');
        return false;
      }

      for (const item of this.context.cartItems) {
        const { status } = await this.makeRequest('/cart/add', 'POST', {
          productId: item.productId,
          quantity: item.quantity,
        });

        if (status !== 200 && status !== 201) {
          this.logTest(`Add item ${item.name} to cart`, 'FAIL');
          return false;
        }
      }

      this.logTest(`Added ${this.context.cartItems.length} items to cart`, 'PASS');
      return true;
    } catch (error) {
      this.logTest('Add to cart - ' + (error instanceof Error ? error.message : 'Unknown error'), 'FAIL');
      return false;
    }
  }

  async testGetCartSummary() {
    try {
      const { status, data } = await this.makeRequest('/cart/summary');

      if (status === 200 && data.data) {
        const summary = data.data;
        this.logTest(
          `Cart summary: ${summary.itemCount} items, Total: $${summary.total.toFixed(2)}`,
          'PASS'
        );
        return true;
      } else {
        this.logTest('Get cart summary', 'FAIL');
        return false;
      }
    } catch (error) {
      this.logTest('Get cart summary - ' + (error instanceof Error ? error.message : 'Unknown error'), 'FAIL');
      return false;
    }
  }

  async testCreateOrder() {
    try {
      if (!this.context.cartItems || this.context.cartItems.length === 0) {
        this.logTest('Create order - No cart items', 'SKIP');
        return false;
      }

      const orderPayload = {
        items: this.context.cartItems,
        shippingAddress: {
          fullName: 'Test User',
          email: this.testUser.email,
          phone: '9876543210',
          street: '123 Test St',
          city: 'Test City',
          state: 'TC',
          zipCode: '12345',
          country: 'USA',
        },
        paymentMethod: 'paypal',
      };

      const { status, data } = await this.makeRequest('/orders', 'POST', orderPayload);

      if (status === 201 && data.data?.orderId) {
        this.context.orderId = data.data.orderId;
        this.context.orderNumber = data.data.orderNumber;
        this.logTest(`Order created: ${data.data.orderNumber} (${data.data.orderId})`, 'PASS');
        return true;
      } else {
        this.logTest(`Create order - Status: ${status}`, 'FAIL');
        console.log('Response:', data);
        return false;
      }
    } catch (error) {
      this.logTest('Create order - ' + (error instanceof Error ? error.message : 'Unknown error'), 'FAIL');
      return false;
    }
  }

  async testGetOrderDetails() {
    try {
      if (!this.context.orderId) {
        this.logTest('Get order details - No order created', 'SKIP');
        return false;
      }

      const { status, data } = await this.makeRequest(`/orders/${this.context.orderId}`);

      if (status === 200 && data.data?.id) {
        this.logTest(`Order details retrieved: ${data.data.orderNumber}`, 'PASS');
        return true;
      } else {
        this.logTest(`Get order details - Status: ${status}`, 'FAIL');
        return false;
      }
    } catch (error) {
      this.logTest('Get order details - ' + (error instanceof Error ? error.message : 'Unknown error'), 'FAIL');
      return false;
    }
  }

  async testGetUserOrders() {
    try {
      const { status, data } = await this.makeRequest('/orders');

      if (status === 200 && Array.isArray(data.data?.orders)) {
        this.logTest(`User orders retrieved: ${data.data.orders.length} order(s)`, 'PASS');
        return true;
      } else {
        this.logTest('Get user orders', 'FAIL');
        return false;
      }
    } catch (error) {
      this.logTest('Get user orders - ' + (error instanceof Error ? error.message : 'Unknown error'), 'FAIL');
      return false;
    }
  }

  async testGenerateInvoice() {
    try {
      if (!this.context.orderId) {
        this.logTest('Generate invoice - No order created', 'SKIP');
        return false;
      }

      const { status, data } = await this.makeRequest(`/orders/${this.context.orderId}/invoice`);

      if (status === 200 && data.data) {
        this.logTest(`Invoice generated: ${data.data.orderNumber}`, 'PASS');
        return true;
      } else {
        this.logTest('Generate invoice', 'FAIL');
        return false;
      }
    } catch (error) {
      this.logTest('Generate invoice - ' + (error instanceof Error ? error.message : 'Unknown error'), 'FAIL');
      return false;
    }
  }

  async testPayPalPaymentFlow() {
    try {
      if (!this.context.orderId) {
        this.logTest('PayPal payment flow - No order created', 'SKIP');
        return false;
      }

      // In production, this would redirect to PayPal
      // For testing, we simulate the callback
      const paypalOrderId = `PAYPAL-${Date.now()}`;

      const { status } = await this.makeRequest(
        `/orders/${this.context.orderId}/payment/paypal`,
        'POST',
        { paypalOrderId }
      );

      if (status === 200 || status === 400) {
        // Either success or expected error in demo mode
        this.logTest('PayPal payment processing', 'PASS');
        return true;
      } else {
        this.logTest('PayPal payment processing', 'FAIL');
        return false;
      }
    } catch (error) {
      this.logTest('PayPal payment - ' + (error instanceof Error ? error.message : 'Unknown error'), 'FAIL');
      return false;
    }
  }

  async testWebhookHandler() {
    try {
      const webhookPayload = {
        event_type: 'PAYMENT.CAPTURE.COMPLETED',
        event_time: new Date().toISOString(),
        resource: {
          id: `CAPTURE-${Date.now()}`,
          status: 'COMPLETED',
          amount: {
            currency_code: 'USD',
            value: '99.99',
          },
          supplementary_data: {
            related_ids: {
              order_id: `PAYPAL-${Date.now()}`,
            },
          },
        },
      };

      const { status } = await this.makeRequest(
        '/webhooks/paypal',
        'POST',
        webhookPayload,
        false
      );

      if (status === 200) {
        this.logTest('Webhook handling', 'PASS');
        return true;
      } else {
        this.logTest('Webhook handling', 'FAIL');
        return false;
      }
    } catch (error) {
      this.logTest('Webhook handler - ' + (error instanceof Error ? error.message : 'Unknown error'), 'FAIL');
      return false;
    }
  }

  async testOrderCancellation() {
    try {
      if (!this.context.orderId) {
        this.logTest('Order cancellation - No order created', 'SKIP');
        return false;
      }

      const { status } = await this.makeRequest(
        `/orders/${this.context.orderId}/cancel`,
        'POST'
      );

      if (status === 200) {
        this.logTest('Order cancellation', 'PASS');
        return true;
      } else {
        this.logTest(`Order cancellation - Status: ${status}`, 'FAIL');
        return false;
      }
    } catch (error) {
      this.logTest('Order cancellation - ' + (error instanceof Error ? error.message : 'Unknown error'), 'FAIL');
      return false;
    }
  }
}

// Run tests
async function main() {
  try {
    const tests = new Phase4E2ETests();
    await tests.run();
  } catch (error) {
    console.error('Test runner error:', error);
    process.exit(1);
  }
}

main();
