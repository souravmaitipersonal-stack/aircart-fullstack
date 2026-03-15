# AirCart Architecture

System design and architectural decisions for the AirCart platform.

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Client Applications                       │
├──────────────────────────┬──────────────────────────────────┤
│    Web Browser           │    Mobile App (Phase 2)          │
│  (React/Next.js)         │  (React Native/Expo)             │
└─────────────┬──────────────────────────┬────────────────────┘
              │                          │
              └──────────────┬───────────┘
                             │
                    ┌────────▼────────┐
                    │  API Layer      │
                    │  (Express.js)   │
                    │  REST + GraphQL │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
        ┌─────▼────┐  ┌──────▼────┐  ┌────▼────┐
        │Services  │  │  Auth     │  │Payment  │
        │ & Logic  │  │ Handler   │  │Handler  │
        └─────┬────┘  └──────┬────┘  └────┬────┘
              │              │             │
        ┌─────▼──────────────▼─────────────▼────┐
        │         Database Layer                │
        ├──────────────┬──────────────┐         │
        │ PostgreSQL   │   MongoDB    │         │
        │ (Relational) │ (NoSQL/Docs) │         │
        └──────────────┴──────────────┘         │
        └──────────────────────────────────────┘
```

---

## Technology Stack Decision

### Frontend (apps/web)

**Why Next.js + React?**
- SSR/SSG for better SEO and performance
- Built-in API routes (middleware)
- Image optimization
- File-based routing (intuitive)
- Large ecosystem (job market)
- TypeScript support out of box
- Easy deployment (Vercel)

**State Management: Zustand**
- Lightweight (2.3KB)
- Simple API (no Redux boilerplate)
- TypeScript-friendly
- Async support

**Styling: Tailwind CSS**
- Utility-first approach
- Fast development
- Small bundle size with purging
- Responsive design built-in

### Backend (packages/api)

**Why Express.js?**
- Minimal framework (not opinionated)
- Largest ecosystem
- Easy middleware integration
- Flexible for both REST and GraphQL
- Learning-friendly
- Production-proven

**API Design: REST + GraphQL**
- REST: Standard CRUD operations (familiar, simple)
- GraphQL: Complex queries (flexible, optimized for client)
- Learn both paradigms

### Databases

**PostgreSQL (Relational)**
- Financial transactions (orders, payments)
- ACID compliance (data integrity)
- Complex queries (reports, analytics)
- Relationships (users → orders → items)

**MongoDB (NoSQL)**
- Product reviews (flexible schema)
- Logs and analytics
- Cache data
- Learning document-based design

---

## Authentication Flow

```
User Registration
  │
  ├─→ Validate input
  ├─→ Check if email exists
  ├─→ Hash password (bcryptjs)
  ├─→ Create user in PostgreSQL
  └─→ Return success

User Login
  │
  ├─→ Validate credentials
  ├─→ Fetch user from DB
  ├─→ Compare password hash
  ├─→ Generate JWT token
  ├─→ Set secure cookie (httpOnly)
  └─→ Return token + user info

Protected Requests
  │
  ├─→ Extract JWT from cookies/header
  ├─→ Verify signature
  ├─→ Check expiration
  ├─→ Attach user to request
  └─→ Allow/deny based on role
```

---

## Data Models

### User (PostgreSQL)
```
users
├── id (UUID, PK)
├── email (VARCHAR, UNIQUE)
├── password (VARCHAR, hashed)
├── name (VARCHAR)
├── role (VARCHAR: customer|admin)
├── createdAt (TIMESTAMP)
└── updatedAt (TIMESTAMP)
```

### Product (Both)
```
PostgreSQL:
products
├── id (UUID, PK)
├── name (VARCHAR)
├── description (TEXT)
├── price (DECIMAL)
├── stock (INT)
├── category (VARCHAR)
├── image (VARCHAR, URL)
├── createdAt (TIMESTAMP)
└── updatedAt (TIMESTAMP)

MongoDB (Optional):
product_analytics
├── productId
├── views (INT)
├── revenue (DECIMAL)
└── timestamp
```

### Order (PostgreSQL)
```
orders
├── id (UUID, PK)
├── userId (UUID, FK)
├── status (VARCHAR)
├── total (DECIMAL)
├── createdAt (TIMESTAMP)
└── updatedAt (TIMESTAMP)

order_items
├── id (UUID, PK)
├── orderId (UUID, FK)
├── productId (UUID, FK)
├── quantity (INT)
├── price (DECIMAL)
└── total (DECIMAL)
```

---

## API Endpoints (Phase 1-2)

### Authentication
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - User login
POST   /api/auth/logout        - User logout
POST   /api/auth/refresh       - Refresh JWT token
GET    /api/auth/me            - Get current user (protected)
```

### Products
```
GET    /api/products           - List products (with filters)
GET    /api/products/:id       - Get product details
POST   /api/products           - Create product (admin only)
PUT    /api/products/:id       - Update product (admin only)
DELETE /api/products/:id       - Delete product (admin only)
```

### Cart
```
GET    /api/cart               - Get current cart
POST   /api/cart/items         - Add to cart
PUT    /api/cart/items/:id     - Update cart item
DELETE /api/cart/items/:id     - Remove from cart
```

### Orders
```
POST   /api/orders             - Create order from cart
GET    /api/orders             - Get user's orders
GET    /api/orders/:id         - Get order details
PUT    /api/orders/:id/status  - Update order status (admin)
```

---

## File Organization Philosophy

**Keep It Simple & Readable**

- **Minimal abstractions**: No unnecessary layers
- **Clear naming**: File names describe content
- **Co-locate related code**: Same folder = related features
- **Type safety**: TypeScript prevents bugs early
- **Comments for why**: Self-explanatory code + comments for non-obvious decisions

Example:
```
api/src/services/
├── auth.service.ts          # Authentication logic
├── product.service.ts       # Product operations
└── order.service.ts         # Order operations
```

Each file is ~200-300 lines, easy to understand at a glance.

---

## Error Handling Strategy

### API Errors
```typescript
// Standardized error response
{
  success: false,
  error: "User not found",
  code: "USER_NOT_FOUND",
  status: 404
}
```

### Error Codes
- `4xx`: Client errors (validation, auth, not found)
- `5xx`: Server errors (database, external API)
- Always return JSON with message

---

## Security Measures

1. **Passwords**: Hashed with bcryptjs (10 salt rounds)
2. **JWT**: Signed with secret, expires in 7 days
3. **CORS**: Restricted to frontend origin
4. **Admin Routes**: Role-based middleware
5. **Input Validation**: Zod schemas
6. **HTTPS**: Use in production (enforced on hosting)

---

## Performance Optimization

1. **Database Indexing**: Indexes on email, productId
2. **Pagination**: Limit, offset for large datasets
3. **Caching**: (Phase 3) Redis for sessions/products
4. **Image Optimization**: Next.js Image component
5. **Lazy Loading**: Components load on demand
6. **CSS**: Tailwind purges unused styles

---

## Monitoring & Logging

### Backend Logs
```
[2026-03-14 10:30:45] ℹ️  Server started
[2026-03-14 10:30:46] ℹ️  Connected to PostgreSQL
[2026-03-14 10:31:00] POST /api/auth/login
[2026-03-14 10:31:01] ✅ User logged in
```

### Error Tracking
- Console errors in development
- (Phase 3) Sentry integration for production

---

## Testing Strategy

### Unit Tests (Jest/Vitest)
- Services, utilities
- 70-80% coverage

### Integration Tests (Jest)
- API endpoints with mock database
- Full request/response cycles

### E2E Tests (Playwright)
- Real browser
- User workflows
- Critical paths only

---

## Development Lifecycle

```
Feature Branch
    │
    ├─→ Write tests (TDD)
    ├─→ Implement feature
    ├─→ Run tests locally
    ├─→ Commit (pre-commit hooks run)
    ├─→ Push
    │
    └─→ GitHub Actions
        ├─→ Lint
        ├─→ Type check
        ├─→ Test
        ├─→ Build
        │
        └─→ All pass? Deploy
```

---

## Scalability Considerations

**For Future Growth:**

1. **Microservices**: Split into auth, products, orders services (optional)
2. **Caching**: Redis for session/product cache
3. **Load Balancing**: Multiple backend instances
4. **Database Replication**: Read replicas for reporting
5. **Search Engine**: Elasticsearch for product search
6. **Queue System**: Job queue for emails, reports
7. **CDN**: Cloudflare for static assets

---

## Deployment Architecture

### Development
- Local Docker databases
- Localhost ports (3000, 5000)

### Staging
- Cloud databases
- Pre-production testing

### Production
- Vercel (frontend)
- Railway/Render (backend)
- Cloud PostgreSQL (Supabase)
- MongoDB Atlas (cloud)
- CloudFlare DNS/CDN

---

## What's Next?

Phase 2: Database schema design and migrations
Phase 3: Authentication system
Phase 4: Product catalog
Phase 5: Shopping cart and orders
