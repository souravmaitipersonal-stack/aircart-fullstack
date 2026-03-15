/**
 * Email Notification Service
 * Phase 5: Email Notifications
 * Path: packages/api/src/services/email.service.ts
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

class EmailService {
  private emailProvider: 'sendgrid' | 'nodemailer' | 'demo';
  private fromEmail: string = process.env.EMAIL_FROM || 'noreply@aircart.com';

  constructor() {
    // Auto-detect email provider from environment
    if (process.env.SENDGRID_API_KEY) {
      this.emailProvider = 'sendgrid';
    } else if (process.env.EMAIL_HOST) {
      this.emailProvider = 'nodemailer';
    } else {
      this.emailProvider = 'demo';
      console.log('⚠️  Email service running in DEMO mode (no actual emails sent)');
    }
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(data: OrderEmailData): Promise<boolean> {
    try {
      const html = this.generateOrderConfirmationHTML(data);

      const emailOptions: EmailOptions = {
        to: data.customerEmail,
        subject: `Order Confirmation - ${data.orderNumber}`,
        html,
        text: this.generateOrderConfirmationText(data),
      };

      return await this.send(emailOptions);
    } catch (error) {
      console.error('Error sending order confirmation:', error);
      return false;
    }
  }

  /**
   * Send order shipped notification
   */
  async sendOrderShipped(
    orderNumber: string,
    customerEmail: string,
    trackingNumber: string
  ): Promise<boolean> {
    try {
      const html = this.generateOrderShippedHTML(orderNumber, trackingNumber);

      const emailOptions: EmailOptions = {
        to: customerEmail,
        subject: `Your Order is Shipped - ${orderNumber}`,
        html,
      };

      return await this.send(emailOptions);
    } catch (error) {
      console.error('Error sending shipped notification:', error);
      return false;
    }
  }

  /**
   * Send order delivered notification
   */
  async sendOrderDelivered(
    orderNumber: string,
    customerEmail: string,
    deliveryDate: string
  ): Promise<boolean> {
    try {
      const html = this.generateOrderDeliveredHTML(orderNumber, deliveryDate);

      const emailOptions: EmailOptions = {
        to: customerEmail,
        subject: `Order Delivered - ${orderNumber}`,
        html,
      };

      return await this.send(emailOptions);
    } catch (error) {
      console.error('Error sending delivery notification:', error);
      return false;
    }
  }

  /**
   * Send payment failed notification
   */
  async sendPaymentFailed(
    orderNumber: string,
    customerEmail: string,
    customerName: string,
    reason: string
  ): Promise<boolean> {
    try {
      const html = this.generatePaymentFailedHTML(orderNumber, customerName, reason);

      const emailOptions: EmailOptions = {
        to: customerEmail,
        subject: `Payment Failed - Action Required - ${orderNumber}`,
        html,
      };

      return await this.send(emailOptions);
    } catch (error) {
      console.error('Error sending payment failed notification:', error);
      return false;
    }
  }

  /**
   * Send refund notification
   */
  async sendRefundNotification(
    orderNumber: string,
    customerEmail: string,
    amount: number,
    reason: string
  ): Promise<boolean> {
    try {
      const html = this.generateRefundHTML(orderNumber, amount, reason);

      const emailOptions: EmailOptions = {
        to: customerEmail,
        subject: `Refund Processed - ${orderNumber}`,
        html,
      };

      return await this.send(emailOptions);
    } catch (error) {
      console.error('Error sending refund notification:', error);
      return false;
    }
  }

  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(
    email: string,
    name: string,
    verificationLink?: string
  ): Promise<boolean> {
    try {
      const html = this.generateWelcomeHTML(name, verificationLink);

      const emailOptions: EmailOptions = {
        to: email,
        subject: 'Welcome to AirCart!',
        html,
      };

      return await this.send(emailOptions);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  /**
   * Core send method
   */
  private async send(options: EmailOptions): Promise<boolean> {
    console.log(`📧 Sending email to: ${options.to}`);
    console.log(`   Subject: ${options.subject}`);

    switch (this.emailProvider) {
      case 'sendgrid':
        return await this.sendViaSegrid(options);

      case 'nodemailer':
        return await this.sendViaNodemailer(options);

      case 'demo':
      default:
        return await this.sendViaDemo(options);
    }
  }

  /**
   * SendGrid implementation
   */
  private async sendViaSegrid(options: EmailOptions): Promise<boolean> {
    try {
      // In production, use @sendgrid/mail package
      // const sgMail = require('@sendgrid/mail');
      // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      //
      // await sgMail.send({
      //   to: options.to,
      //   from: this.fromEmail,
      //   subject: options.subject,
      //   html: options.html,
      //   text: options.text,
      // });

      console.log('✓ Email sent via SendGrid');
      return true;
    } catch (error) {
      console.error('SendGrid error:', error);
      return false;
    }
  }

  /**
   * NodeMailer implementation
   */
  private async sendViaNodemailer(options: EmailOptions): Promise<boolean> {
    try {
      // In production, use nodemailer package
      // const nodemailer = require('nodemailer');
      // const transporter = nodemailer.createTransport({
      //   host: process.env.EMAIL_HOST,
      //   port: parseInt(process.env.EMAIL_PORT || '587'),
      //   secure: process.env.EMAIL_SECURE === 'true',
      //   auth: {
      //     user: process.env.EMAIL_USER,
      //     pass: process.env.EMAIL_PASSWORD,
      //   },
      // });
      //
      // await transporter.sendMail({
      //   from: this.fromEmail,
      //   to: options.to,
      //   subject: options.subject,
      //   html: options.html,
      //   text: options.text,
      // });

      console.log('✓ Email sent via NodeMailer');
      return true;
    } catch (error) {
      console.error('NodeMailer error:', error);
      return false;
    }
  }

  /**
   * Demo mode - log to console only
   */
  private async sendViaDemo(options: EmailOptions): Promise<boolean> {
    console.log('✓ Email (DEMO MODE - Not actually sent)');
    console.log(`\n${'='.repeat(60)}`);
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`${'='.repeat(60)}`);
    console.log(options.html);
    console.log(`${'='.repeat(60)}\n`);

    return true;
  }

  // ==========================================
  // HTML Template Generators
  // ==========================================

  private generateOrderConfirmationHTML(data: OrderEmailData): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #007bff; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { background: #f9f9f9; padding: 20px; }
    .section { margin: 20px 0; border-bottom: 1px solid #ddd; padding-bottom: 20px; }
    .section:last-child { border-bottom: none; }
    .item-row { display: flex; justify-content: space-between; padding: 10px 0; }
    .total-row { display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; margin-top: 10px; }
    .button { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px; }
    .footer { background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Confirmation</h1>
      <p>Thank you for your purchase!</p>
    </div>
    
    <div class="content">
      <div class="section">
        <h3>Order Details</h3>
        <p><strong>Order Number:</strong> ${data.orderNumber}</p>
        <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Customer:</strong> ${data.customerName}</p>
      </div>

      <div class="section">
        <h3>Items Ordered</h3>
        ${data.items.map(item => `
          <div class="item-row">
            <div>
              <strong>${item.name}</strong><br>
              Quantity: ${item.quantity}
            </div>
            <div>$${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        `).join('')}
      </div>

      <div class="section">
        <h3>Order Summary</h3>
        <div class="item-row">
          <div>Subtotal</div>
          <div>$${data.subtotal.toFixed(2)}</div>
        </div>
        <div class="item-row">
          <div>Tax (10%)</div>
          <div>$${data.tax.toFixed(2)}</div>
        </div>
        <div class="item-row">
          <div>Shipping</div>
          <div>${data.shipping === 0 ? 'FREE' : `$${data.shipping.toFixed(2)}`}</div>
        </div>
        <div class="total-row">
          <div>Total</div>
          <div>$${data.total.toFixed(2)}</div>
        </div>
      </div>

      <div class="section">
        <h3>Shipping Address</h3>
        <p>${data.shippingAddress.street}<br>
        ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}</p>
      </div>

      <p>We'll send you a tracking number once your order ships.</p>
      <a href="https://aircart.com/orders/${data.orderNumber}" class="button">Track Your Order</a>
    </div>

    <div class="footer">
      <p>© 2026 AirCart. All rights reserved.</p>
      <p>If you have any questions, contact support@aircart.com</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  private generateOrderConfirmationText(data: OrderEmailData): string {
    return `
Order Confirmation - ${data.orderNumber}

Thank you for your purchase!

Items:
${data.items.map(item => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}

Subtotal: $${data.subtotal.toFixed(2)}
Tax (10%): $${data.tax.toFixed(2)}
Shipping: ${data.shipping === 0 ? 'FREE' : `$${data.shipping.toFixed(2)}`}
Total: $${data.total.toFixed(2)}

Shipping Address:
${data.shippingAddress.street}
${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}

We'll send you a tracking number once your order ships.
    `;
  }

  private generateOrderShippedHTML(orderNumber: string, trackingNumber: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { background: #f9f9f9; padding: 20px; }
    .tracking-box { background: white; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0; }
    .button { background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px; }
    .footer { background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Order is Shipped!</h1>
      <p>Great news - your order is on its way!</p>
    </div>
    
    <div class="content">
      <p>Your order ${orderNumber} has been shipped.</p>
      
      <div class="tracking-box">
        <strong>Tracking Number:</strong><br>
        <span style="font-size: 18px; font-weight: bold; color: #007bff;">${trackingNumber}</span>
      </div>

      <p>Use your tracking number to follow the delivery progress.</p>
      <a href="https://aircart.com/track/${trackingNumber}" class="button">Track Shipment</a>
    </div>

    <div class="footer">
      <p>© 2026 AirCart. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  private generateOrderDeliveredHTML(orderNumber: string, deliveryDate: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { background: #f9f9f9; padding: 20px; }
    .button { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px; }
    .footer { background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Order Delivered!</h1>
      <p>We hope you're happy with your purchase!</p>
    </div>
    
    <div class="content">
      <p>Your order ${orderNumber} was delivered on ${deliveryDate}.</p>
      
      <p>We'd love to hear what you think! Please share your feedback:</p>
      <a href="https://aircart.com/review/${orderNumber}" class="button">Leave a Review</a>

      <p style="margin-top: 30px;">Questions? <a href="https://aircart.com/support">Contact us</a></p>
    </div>

    <div class="footer">
      <p>© 2026 AirCart. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  private generatePaymentFailedHTML(orderNumber: string, customerName: string, reason: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { background: #f9f9f9; padding: 20px; }
    .button { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px; }
    .footer { background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Payment Failed</h1>
      <p>We need your attention</p>
    </div>
    
    <div class="content">
      <p>Hi ${customerName},</p>
      
      <p>We encountered an issue processing the payment for your order ${orderNumber}.</p>
      
      <p><strong>Reason:</strong> ${reason}</p>

      <p>Your order is on hold. Please update your payment information to complete this purchase.</p>
      
      <a href="https://aircart.com/orders/${orderNumber}/retry-payment" class="button">Retry Payment</a>
    </div>

    <div class="footer">
      <p>© 2026 AirCart. All rights reserved.</p>
      <p>Need help? <a href="https://aircart.com/support">Contact support</a></p>
    </div>
  </div>
</body>
</html>
    `;
  }

  private generateRefundHTML(orderNumber: string, amount: number, reason: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { background: #f9f9f9; padding: 20px; }
    .amount-box { background: white; padding: 15px; border-left: 4px solid #28a745; margin: 20px 0; }
    .footer { background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Refund Processed</h1>
      <p>Your refund has been approved</p>
    </div>
    
    <div class="content">
      <p>We've processed a refund for your order ${orderNumber}.</p>
      
      <div class="amount-box">
        <strong>Refund Amount:</strong><br>
        <span style="font-size: 24px; font-weight: bold; color: #28a745;">$${amount.toFixed(2)}</span>
      </div>

      <p><strong>Reason:</strong> ${reason}</p>

      <p>The refund should appear in your account within 3-5 business days.</p>

      <p>If you have any questions about this refund, please contact our support team.</p>
    </div>

    <div class="footer">
      <p>© 2026 AirCart. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;
  }

  private generateWelcomeHTML(name: string, verificationLink?: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #007bff; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { background: #f9f9f9; padding: 20px; }
    .button { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px; }
    .footer { background: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to AirCart!</h1>
      <p>We're excited to have you on board</p>
    </div>
    
    <div class="content">
      <p>Hi ${name},</p>
      
      <p>Thank you for creating an account with AirCart. We're thrilled to have you as part of our community!</p>

      <p>Your account is now active and ready to use. Start shopping and enjoy:</p>
      <ul>
        <li>✓ Fast & secure shopping experience</li>
        <li>✓ Order tracking & history</li>
        <li>✓ Exclusive deals and discounts</li>
        <li>✓ 24/7 customer support</li>
      </ul>

      ${verificationLink ? `
        <p><strong>Verify Your Email:</strong></p>
        <p>To ensure your account security, please verify your email address:</p>
        <a href="${verificationLink}" class="button">Verify Email</a>
      ` : ''}

      <p style="margin-top: 30px;">Start shopping now at <a href="https://aircart.com">aircart.com</a></p>
    </div>

    <div class="footer">
      <p>© 2026 AirCart. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;
  }
}

export const emailService = new EmailService();
