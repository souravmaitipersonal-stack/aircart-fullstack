# ⚡ Performance Optimization Guide - Speed & Scalability

**Current Status**: Production optimized  
**Target**: <500ms average API response time, <3s page load time  
**Tools**: Lighthouse, Chrome DevTools, New Relic (optional)

---

## Frontend Performance

### Current Optimizations

✅ **Next.js Built-In**
- Image optimization (automatic resizing, lazy loading)
- Code splitting (only load needed code)
- Fast refresh (instant updates during development)
- Incremental Static Regeneration (ISR)

✅ **Tailwind CSS**
- Utility-first (minimal CSS)
- PurgeCSS (removes unused styles in production)

✅ **React 18**
- Concurrent rendering
- Automatic batching

### Performance Metrics

Check current performance:

```bash
# Lighthouse report (Chrome DevTools)
# 1. Open http://localhost:3000
# 2. Press F12 → Lighthouse tab
# 3. Generate report

# Core Web Vitals
# - Largest Contentful Paint (LCP): < 2.5s
# - First Input Delay (FID): < 100ms
# - Cumulative Layout Shift (CLS): < 0.1
```

### Optimization Techniques

#### 1. Image Optimization

**Next.js Image Component**:

```typescript
// ❌ Bad - DOM images load slowly
<img src="product.jpg" alt="Product" width="300" height="200" />

// ✅ Good - Next.js optimizes
import Image from 'next/image'

<Image 
  src={product.image} 
  alt={product.name}
  width={300}
  height={200}
  priority  // Load first (hero images)
  // or
  loading="lazy"  // Load on scroll (below fold)
/>
```

**Configuration** (`next.config.js`):

```javascript
module.exports = {
  images: {
    unoptimized: false,  // Enable optimization
    formats: ['image/webp', 'image/avif'],  // Modern formats
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd1234abcd.cloudfront.net',  // CDN
      }
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  }
}
```

#### 2. Code Splitting

**Automatic by Next.js**:
- Each page = separate bundle
- Shared code in `_app` bundle
- No extra config needed

**Manual Splitting** (if needed):

```typescript
// ❌ Bad - Loads all libraries
import * as heavyLib from 'heavy-library'

// ✅ Good - Async import
const heavyLib = await import('heavy-library')

// ✅ Better - Dynamic import with Suspense
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  { loading: () => <Skeleton /> }  // Show while loading
)
```

#### 3. CSS Optimization

**Current Setup**:
- Tailwind CSS with PurgeCSS
- Global styles: `~3KB` production

**Further Optimization**:

```typescript
// Critical CSS inlining (production)
import { getCriticalCSS } from 'critical-css'

// In next.config.js
experimental: {
  optimizeCss: true,  // Inline critical CSS
}
```

#### 4. Font Loading

```typescript
// next/font - Optimize font loading
import { Inter, Merriweather } from 'next/font'

const inter = Inter({ subsets: ['latin'] })
const serif = Merriweather({ weight: ['400', '700'] })

export default function Home() {
  return (
    <div className={inter.className}>
      <h1 className={serif.className}>Optimized Fonts</h1>
    </div>
  )
}
```

#### 5. Caching Strategy

**Browser Cache Headers**:

```javascript
// next.config.js
module.exports = {
  headers: async () => [
    {
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable'  // 1 year
        }
      ]
    },
    {
      source: '/api/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=60'  // 1 minute
        }
      ]
    }
  ]
}
```

**Client-Side Cache** (localStorage):

```typescript
// apps/web/src/lib/cache.ts
export const cache = {
  set: (key: string, value: any, ttl = 3600) => {
    const item = {
      value,
      expiry: Date.now() + ttl * 1000
    }
    localStorage.setItem(key, JSON.stringify(item))
  },
  
  get: (key: string) => {
    const item = localStorage.getItem(key)
    if (!item) return null
    
    const { value, expiry } = JSON.parse(item)
    if (Date.now() > expiry) {
      localStorage.removeItem(key)
      return null
    }
    return value
  }
}
```

Usage:

```typescript
// Cache products for 1 hour
const getProducts = async () => {
  const cached = cache.get('products')
  if (cached) return cached
  
  const data = await fetch('/api/products')
  cache.set('products', data, 3600)
  return data
}
```

---

## Backend Performance

### Current API Response Times

Benchmark (typical):
- Health check: ~5ms
- User login: ~50ms (password hashing)
- List products: ~30ms
- Add to cart: ~20ms

Target: Keep all endpoints < 200ms

### Database Optimization

#### 1. Index Critical Columns

**PostgreSQL** (currently in use):

```sql
-- Already created indexes for:
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Add more if needed:
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Verify indexes used:
EXPLAIN ANALYZE SELECT * FROM products WHERE category = 'Electronics';
```

#### 2. Query Optimization

**Current** (good):

```typescript
// Uses parameterized queries (prevents SQL injection)
db.query('SELECT * FROM users WHERE email = $1', [email])

// With indexes, very fast
const users = await User.find({ email })
```

**Optimization** - Use database views:

```sql
-- Create view for frequently accessed joined data
CREATE VIEW user_order_summary AS
SELECT 
  u.id,
  u.email,
  COUNT(o.id) as total_orders,
  SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;

-- Query is now instant
SELECT * FROM user_order_summary WHERE id = 123;
```

#### 3. Connection Pooling

**Current** (good in production):

```typescript
// apps/api/src/database/connection.ts
import { Pool } from 'pg'

export const pool = new Pool({
  max: 20,              // Max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})
```

**Fine-tune for your workload**:
- Low traffic: `max: 5-10`
- Medium traffic: `max: 20-50`
- High traffic: `max: 100+` (use read replicas)

#### 4. Pagination

Always paginate large result sets:

```typescript
// ❌ Bad - Load all 1 million products into memory
app.get('/api/products', (req, res) => {
  const products = await db.query('SELECT * FROM products')
})

// ✅ Good - Paginate with limit & offset
app.get('/api/products', (req, res) => {
  const page = req.query.page || 1
  const limit = 50
  const offset = (page - 1) * limit
  
  const products = await db.query(
    'SELECT * FROM products LIMIT $1 OFFSET $2',
    [limit, offset]
  )
})
```

### API Response Optimization

#### 1. Select Only Needed Fields

```typescript
// ❌ Bad - Returns all fields
SELECT * FROM users

// ✅ Good - Return only what's needed
SELECT id, email, name FROM users

// ✅ Better - Even fewer fields for lists
SELECT id, name FROM users
```

#### 2. Response Compression

```typescript
// Enable Gzip compression
import compression from 'compression'

app.use(compression({
  threshold: 1024,  // Only compress > 1KB
  level: 6          // Compression level (1-9)
}))
```

Reduces response size by ~70%.

#### 3. Caching Headers

```typescript
// Cache products (they change rarely)
app.get('/api/products', (req, res) => {
  res.set('Cache-Control', 'public, max-age=300')  // 5 minutes
  res.json(products)
})

// Don't cache auth/cart (changes frequently)
app.get('/api/cart', (req, res) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  res.json(cart)
})
```

#### 4. Batch Operations

```typescript
// ❌ Bad - N+1 queries
const orders = await getOrders()
for (const order of orders) {
  order.items = await getOrderItems(order.id)  // Query per order!
}

// ✅ Good - Single batch query
const orders = await db.query('SELECT * FROM orders')
const allItems = await db.query(`
  SELECT * FROM order_items 
  WHERE order_id = ANY($1)
`, [orders.map(o => o.id)])
// Combine results in JavaScript
```

---

## Caching Strategy

### Layered Caching

```
Browser Cache (24 hours)
         ↓
CDN Cache (1 hour)
         ↓
Server Cache / Redis (5 minutes)
         ↓
Database
```

### Redis Implementation (Optional)

```bash
# Install Redis
npm install redis ioredis

# Start Redis (local development)
redis-server
```

```typescript
// apps/api/src/services/cache.ts
import Redis from 'ioredis'

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
})

export const cacheGet = async (key: string) => {
  const cached = await redis.get(key)
  return cached ? JSON.parse(cached) : null
}

export const cacheSet = async (key: string, value: any, ttl = 300) => {
  await redis.setex(key, ttl, JSON.stringify(value))
}
```

Usage:

```typescript
// Cache product list
app.get('/api/products', async (req, res) => {
  const cacheKey = `products:${JSON.stringify(req.query)}`
  
  let products = await cache.get(cacheKey)
  if (!products) {
    products = await db.query('SELECT * FROM products WHERE ...')
    await cache.set(cacheKey, products, 300)  // 5 min TTL
  }
  
  res.json(products)
})
```

---

## Monitoring Performance

### Application Metrics to Track

| Metric | Target | Tool |
|--------|--------|------|
| Response Time | < 200ms | New Relic, DataDog |
| CPU Usage | < 70% | Server monitoring |
| Memory Usage | < 80% | Server monitoring |
| Database Query Time | < 50ms | Slow query log |
| Error Rate | < 0.1% | Sentry, Rollbar |
| Uptime | > 99.9% | StatusPage |

### Enabling Monitoring

**Development** - Use Chrome DevTools:

```javascript
// In browser console
performance.measure('api-call', 'navigationStart', 'loadEventEnd')
console.log(performance.getEntriesByName('api-call'))
```

**Production** - Use New Relic:

```typescript
// npm install newrelic

require('newrelic')

// Automatically tracks:
// - Response times
// - Database queries
// - External API calls
// - Error rates
```

**Custom Timing**:

```typescript
// Track specific operations
const start = Date.now()
const result = await heavyOperation()
const duration = Date.now() - start
logger.info(`Operation took ${duration}ms`)
```

---

## Load Testing

### Test Your Application's Capacity

Using Apache Bench:

```bash
# Install (Windows via WSL or Cygwin)
apt-get install apache2-utils

# Run 1000 requests, 10 concurrent
ab -n 1000 -c 10 http://localhost:5000/api/health

# Results show:
# Requests/sec: 200
# Time per request: 50ms
# Failed requests: 0
```

Using Artillery:

```bash
# Install
npm install -g artillery

# Create test.yml
scenarios:
  - name: "Browse products"
    flow:
      - get:
          url: "/api/products?category=Electronics"
      - think: 2

# Run test
artillery run test.yml --target http://localhost:5000
```

---

## Scaling Strategies

### Vertical Scaling (Single Server)

Upgrade hardware:
- Larger instance type (t3.medium → t3.large)
- More RAM (8GB → 32GB)
- Faster storage (SSD)

Works until you hit single-server limits (~10K req/sec).

### Horizontal Scaling (Multiple Servers)

1. **Load Balancer**:
   - AWS ELB or Nginx
   - Distributes traffic

2. **Stateless API**:
   - No session storage on server
   - All state in database/Redis
   - Any server can handle any request

3. **Database Scaling**:
   - Read replicas for SELECT queries
   - Sharding for very large datasets
   - Write replicas for high-traffic inserts

```typescript
// Stateless - can scale horizontally
export const login = async (req, res) => {
  // No server state
  const user = await db.query('SELECT * FROM users WHERE email = $1')
  const token = jwt.sign({ id: user.id }, JWT_SECRET)
  res.json({ token })  // Token is stateless JWT
}
```

### Auto-Scaling Configuration

**AWS Auto Scaling Group**:
- Min instances: 2
- Max instances: 10
- Scale up if: CPU > 70%
- Scale down if: CPU < 30%

---

## Database Scaling

### Read Replicas

```typescript
// Primary database (writes)
const primaryDb = new Pool({
  host: 'primary.rds.amazonaws.com'
})

// Read replicas (reads only)
const readDb = new Pool({
  host: 'replica1.rds.amazonaws.com'
})
const readDb2 = new Pool({
  host: 'replica2.rds.amazonaws.com'
})

// Use read replica for SELECT queries
app.get('/api/products', async (req, res) => {
  const products = await readDb.query('SELECT * FROM products')
  res.json(products)
})
```

### Database Caching (Redis)

See Redis section above.

---

## Content Delivery Network (CDN)

### CloudFront Setup

1. **Create S3 bucket** for static assets
2. **Upload images** to S3
3. **Create CloudFront distribution** pointing to S3
4. **Update image URLs** in app

```typescript
// Before (origin server)
const imageUrl = 'https://yourdomain.com/images/product.jpg'

// After (CDN)
const imageUrl = 'https://d123abc.cloudfront.net/images/product.jpg'
```

Benefits:
- Edge locations globally (lower latency)
- Reduced server load
- Automatic compression & optimization
- Caching rules (1 year for static assets)

---

## Production Checklist

Before deploying, ensure:

✅ **Performance**
- [ ] All pages load < 3 seconds
- [ ] API responses < 200ms
- [ ] Images optimized (WebP format)
- [ ] Compression enabled (Gzip)
- [ ] Caching headers set
- [ ] Database indexes created
- [ ] No N+1 queries

✅ **Monitoring**
- [ ] Error tracking enabled (Sentry)
- [ ] Performance monitoring active (New Relic)
- [ ] Database slow query log enabled
- [ ] Uptime monitoring configured

✅ **Scalability**
- [ ] Load balancer configured
- [ ] API stateless (no server sessions)
- [ ] Database read replicas setup
- [ ] Redis cache for hot data
- [ ] CDN for static assets

---

## Performance Quick Wins

These give biggest impact:

1. **Enable Image Optimization** (+40% speed)
   - Use `next/image` component
   - Set proper widths/heights

2. **Add Database Indexes** (+50% query speed)
   - Index `email`, `user_id`, `category`
   - Verify with EXPLAIN ANALYZE

3. **Implement Caching** (+30% throughput)
   - Cache products (5 min)
   - Cache order history (1 hour)

4. **Enable Compression** (+70% bandwidth)
   - Gzip responses
   - Minify CSS/JS

5. **Optimize Images** (+60% transfer size)
   - Convert to WebP
   - Resize for different devices
   - Lazy load below-fold images

---

**Last Updated**: March 28, 2026  
**Version**: 4.0  
**Status**: Production Ready

