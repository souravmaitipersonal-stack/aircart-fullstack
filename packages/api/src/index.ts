import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import cartRoutes from './routes/cart';
import ordersRoutes from './routes/orders';
import webhooksRoutes from './routes/webhooks';
import { logInfo, logSuccess } from './config/logger';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// MIDDLEWARE
// ============================================

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware (simple)
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// ROUTES
// ============================================

// Authentication routes (Phase 2)
app.use('/api/auth', authRoutes);

// Products routes (Phase 3)
app.use('/api/products', productRoutes);

// Shopping cart routes (Phase 3)
app.use('/api/cart', cartRoutes);

// Orders routes (Phase 4)
app.use('/api/orders', ordersRoutes);

// Webhooks routes (Phase 4)
app.use('/api/webhooks', webhooksRoutes);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    message: 'AirCart Backend is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '3.0.0-phase3',
  });
});

// Welcome endpoint
app.get('/api', (req: Request, res: Response) => {
  res.json({
    name: 'AirCart API',
    version: '4.0.0-phase4',
    description: 'E-Commerce, Elevated',
    phase: 'Phase 4: Orders & Payments',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        me: 'GET /api/auth/me',
        refresh: 'POST /api/auth/refresh',
      },
      products: {
        list: 'GET /api/products',
        featured: 'GET /api/products/featured',
        byCategory: 'GET /api/products/category/:category',
        getOne: 'GET /api/products/:id',
        create: 'POST /api/products (admin)',
        update: 'PUT /api/products/:id (admin)',
        delete: 'DELETE /api/products/:id (admin)',
      },
      cart: {
        get: 'GET /api/cart',
        add: 'POST /api/cart/add',
        update: 'PUT /api/cart/update',
        remove: 'DELETE /api/cart/item/:productId',
        clear: 'DELETE /api/cart',
        count: 'GET /api/cart/count',
        summary: 'GET /api/cart/summary',
      },
      orders: {
        create: 'POST /api/orders',
        getAll: 'GET /api/orders',
        getOne: 'GET /api/orders/:orderId',
        payWithPayPal: 'POST /api/orders/:orderId/payment/paypal',
        cancel: 'POST /api/orders/:orderId/cancel',
        invoice: 'GET /api/orders/:orderId/invoice',
      },
      webhooks: {
        paypal: 'POST /api/webhooks/paypal',
        test: 'POST /api/webhooks/test',
      },
    },
  });
});

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.path,
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error',
  });
});

// ============================================
// SERVER START
// ============================================

app.listen(PORT, () => {
  console.log('================================================');
  console.log('🚀 AirCart API Server - Phase 4');
  console.log('================================================');
  logSuccess(`Server running on http://localhost:${PORT}`);
  logInfo(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logInfo(`Features: Authentication, Products, Shopping Cart, Orders & Payments`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 API Info: http://localhost:${PORT}/api`);
  console.log('================================================');
  console.log('📚 Phase 4 Endpoints:');
  console.log('   💳 Orders:');
  console.log('      POST   /api/orders          - Create new order');
  console.log('      GET    /api/orders          - Get user orders');
  console.log('      GET    /api/orders/:id      - Get order details');
  console.log('      POST   /api/orders/:id/payment/paypal - Process PayPal payment');
  console.log('      POST   /api/orders/:id/cancel - Cancel order');
  console.log('      GET    /api/orders/:id/invoice - Download invoice');
  console.log('');
  console.log('   🔗 Webhooks:');
  console.log('      POST   /api/webhooks/paypal - PayPal payment confirmation');
  console.log('      POST   /api/webhooks/test   - Test webhook');
  console.log('================================================');
});

export default app;
