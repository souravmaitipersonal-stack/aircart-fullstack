# 🏗️ System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│  (Chrome, Firefox, Safari on localhost:3000)            │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/HTTPS, JSON
                     ↓
┌─────────────────────────────────────────────────────────┐
│            Frontend Application Layer                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Next.js 15.5 (React 18, TypeScript)            │   │
│  │  ├── Pages (React Components)                   │   │
│  │  ├── Components (ProductCard, CartIcon, etc.)   │   │
│  │  ├── API Client (lib/api.ts - JWT injection)    │   │
│  │  └── State Management (Zustand)                 │   │
│  └──────────────────────────────────────────────────┘   │
│  Port: 3000                                             │
└────────────────────┬────────────────────────────────────┘
                     │ REST API + JWT Bearer Tokens
                     ↓
┌─────────────────────────────────────────────────────────┐
│              API Protocol Layer (CORS)                   │
│  - Content-Type: application/json                       │
│  - Authorization: Bearer <JWT_TOKEN>                    │
│  - CORS: localhost:3000 allowed                         │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
                     ↓
┌─────────────────────────────────────────────────────────┐
│            Backend Application Layer                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Express.js 5.0 (Node.js, TypeScript)           │   │
│  │  ├── Routes Handlers                            │   │
│  │  │   ├── /api/auth          (authentication)    │   │
│  │  │   ├── /api/products      (product mgmt)      │   │
│  │  │   ├── /api/cart          (shopping cart)     │   │
│  │  │   └── /api/orders        (order mgmt)        │   │
│  │  ├── Middleware                                 │   │
│  │  │   ├── authMiddleware     (JWT validation)    │   │
│  │  │   ├── cors               (CORS headers)      │   │
│  │  │   └── logging            (request logs)      │   │
│  │  ├── Services                                   │   │
│  │  │   ├── auth.service       (JWT, hashing)      │   │
│  │  │   ├── product.service    (CRUD ops)          │   │
│  │  │   ├── cart.service       (cart logic)        │   │
│  │  │   └── order.service      (order logic)       │   │
│  │  └── Models                                     │   │
│  │      ├── User                                   │   │
│  │      ├── Product                                │   │
│  │      └── Order                                  │   │
│  └──────────────────────────────────────────────────┘   │
│  Port: 5000                                             │
└────────────────────┬────────────────────────────────────┘
                     │ SQL/NoSQL Queries
                     ↓
┌─────────────────────────────────────────────────────────┐
│              Data Persistence Layer                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │  PostgreSQL (Production Database)               │   │
│  │  - Users Table                                  │   │
│  │  - Products Table                               │   │
│  │  - Orders Table                                 │   │
│  │  - Cart Items Table                             │   │
│  │  Port: 5432                                     │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  MongoDB (Alternative Database)                 │   │
│  │  - products collection                          │   │
│  │  - orders collection                            │   │
│  │  - users collection                             │   │
│  │  Port: 27017                                    │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  In-Memory Storage (Current Development)        │   │
│  │  - User Map (email -> user object)              │   │
│  │  - Product Array                                │   │
│  │  - Cart Map (userId -> items)                   │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## Request-Response Flow

### Example: User Registration

```
1. User navigates to http://localhost:3000/auth/register
   ↓
2. Frontend renders registration form (React component)
   ↓
3. User fills form and clicks "Create Account"
   ↓
4. onChange events trigger password validation (Frontend)
   ↓
5. Form submitted → API Client (lib/api.ts) called
   ↓
6. API Client:
   - Constructs request: POST http://localhost:5000/api/auth/register
   - Headers: { 'Content-Type': 'application/json', 'Authorization': Bearer ...}
   - Body: { email, password, name, phone }
   ↓
7. Backend receives request:
   - CORS middleware validates origin
   - JSON parser extracts body
   - Route handler (POST /api/auth/register)
   ↓
8. Backend processing:
   - Zod validates input
   - Check if email exists
   - Hash password with Bcrypt
   - Create user object
   - Generate JWT token
   ↓
9. Backend response:
   - Status: 201 Created
   - Body: { success: true, data: { token, user, refreshToken } }
   ↓
10. Frontend receives response:
    - Check response.success
    - Store token in localStorage
    - Store user in localStorage
    - Redirect to /dashboard
    ↓
11. User now logged in and sees dashboard
```

## Authentication Flow

```
1. User logs in
   ↓
2. Backend generates JWT token: eyJhbGciOiJIUzI1NiIs...
   ↓
3. Frontend stores token in localStorage
   ↓
4. For subsequent requests:
   - API Client reads token from localStorage
   - Adds header: "Authorization: Bearer <token>"
   ↓
5. Backend authMiddleware:
   - Extracts token from header
   - Verifies token with JWT_SECRET
   - Decodes user info
   - Attaches user to req.user
   ↓
6. Protected route handler can now:
   - Access req.user
   - Know which user made request
   - Personalize response
   ↓
7. Token expires after 7 days (JWT_EXPIRES_IN)
   - User needs to log in again
   - Or use refreshToken to get new token
```

## State Management

### Frontend State (Zustand)

```
useCartStore
├── items: CartItem[] (product id, qty, price)
├── total: number (calculated)
├── subtotal: number (calculated)
├── tax: number (calculated)
├── shipping: number (calculated)
├── addItem(productId, quantity)
├── removeItem(productId)
├── updateItem(productId, quantity)
├── clearCart()
└── getTotal()
```

### Backend Session (In-Memory)

```
userStore: Map
├── Key: email
└── Value: { id, email, password_hash, name, phone, role, ... }

productStore: Array
├── [0]: { id, name, price, description, ... }
├── [1]: { id, name, price, description, ... }
└── ...

cartStore: Map
├── Key: userId
└── Value: CartItem[] (items in user's cart)
```

## Data Models

### User Model
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'admin' | 'customer';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Product Model
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  featured: boolean;
  tags: string[];
}
```

### Cart Item Model
```typescript
interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}
```

### Order Model
```typescript
interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  shippingAddress: Address;
  paymentInfo: PaymentInfo;
  status: OrderStatus;
  total: number;
  tax: number;
  shipping: number;
  createdAt: Date;
}
```

## Security Architecture

```
Password Security:
User enters password
    ↓
Hash with Bcrypt (10 rounds)
    ↓
Store hash in database (never store plain password)
    ↓
Login: Hash input password
    ↓
Compare hash with stored hash
    ↓
Match = User authenticated

Token Security:
User authenticated
    ↓
Generate JWT with:
- User ID (subject)
- Expiration (7 days)
- Algorithm (HS256)
- Secret key
    ↓
Store JWT in localStorage
    ↓
Send with every request in Authorization header
    ↓
Backend verifies signature with same secret key
    ↓
If valid = Request is from authenticated user
    ↓
If expired = Request must be rejected (401 Unauthorized)
```

## Deployment Architecture

### Development (Current)
```
Localhost Machine
├── Frontend: http://localhost:3000 (Next.js dev server)
├── Backend: http://localhost:5000 (Express dev server)
└── Database: In-memory storage (resets on server restart)
```

### Production (Ready to Deploy)
```
CDN (CloudFlare)
    ↓
┌─────────────┐              ┌──────────┐              ┌───────────┐
│  Vercel     │              │ Railway  │              │ Railway   │
│ (Frontend)  │              │ (Backend)│              │ ( Database│
│ Next.js 15  │◄────────────►│ Express  │◄────────────►│PostgreSQL │
│ Deployed    │   REST API   │ Running  │   SQL Query  │ Running   │
└─────────────┘              └──────────┘              └───────────┘
    3000                         5000                       5432
```

## Monitoring & Logging

```
Backend Logging:
┌─────────────────────────────────────────┐
│ [2026-03-28T15:30:45.123Z] GET /api/... │
│ [2026-03-28T15:30:45.456Z] POST /api... │
│ [2026-03-28T15:30:45.789Z] Error: ...    │
└─────────────────────────────────────────┘
Shown in terminal where npm run dev is running

Health Check Endpoint:
GET http://localhost:5000/api/health
Response: { status: "success", message: "API running" }
```

## Scalability & Performance

### Current Limitations
- In-memory storage (resets on restart)
- Single server (no load balancing)
- No caching layer

### For Production
1. Add Redis caching layer
2. Use database with transactions
3. Add load balancer
4. Set up CDN for static assets
5. Implement rate limiting
6. Add monitoring & alerting

