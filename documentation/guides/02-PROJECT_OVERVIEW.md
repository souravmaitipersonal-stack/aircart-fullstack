# 📖 Project Overview - Architecture & Features

## Project Structure

```
aircart-fullstack/
├── apps/
│   └── web/                    # Next.js Frontend (Port 3000)
│       ├── src/app/
│       │   ├── auth/           # Auth pages (register, login)
│       │   ├── products/       # Product pages
│       │   ├── cart/           # Cart page
│       │   ├── checkout/       # Checkout
│       │   └── dashboard/      # User dashboard
│       ├── src/components/     # Reusable components
│       ├── src/lib/api.ts      # API client
│       └── src/store/cart.ts   # State management
├── packages/
│   ├── api/                    # Express Backend (Port 5000)
│   │   ├── src/routes/         # API endpoints
│   │   ├── src/services/       # Business logic
│   │   ├── src/middleware/     # Auth, CORS
│   │   └── src/models/         # Data models
│   ├── types/                  # Shared types
│   └── ui/                     # Shared components (future)
└── documentation/              # This folder
```

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | Next.js | 15.5 |
| React | React | 18.2 |
| Styling | Tailwind CSS | 3.4 |
| State Management | Zustand | 4.4 |
| Backend Framework | Express | 5.0 |
| Language | TypeScript | 5.4 |
| Auth | JWT + Bcrypt | - |
| Database | PostgreSQL/MongoDB | Ready |
| Monorepo | Turborepo | 2.0 |

## Core Features

### Authentication
- User registration with validation
- User login with JWT tokens
- Password hashing (Bcrypt)
- Protected routes
- Token refresh

### Products
- Product listing with grid layout
- Real-time search and filtering
- Product categorization
- Price range filtering
- Product details page

### Shopping Cart
- Add/remove items
- Quantity management
- Real-time calculations
- LocalStorage persistence
- Cart summary

### Checkout & Orders
- Shipping address form
- Payment method selection
- Order creation
- PayPal integration
- Order history

## API Endpoints (20+)

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`

### Products
- `GET /api/products`
- `GET /api/products/featured`
- `GET /api/products/:id`
- `GET /api/products/category/:name`

### Cart
- `GET /api/cart`
- `POST /api/cart/add`
- `PUT /api/cart/update`
- `DELETE /api/cart/item/:id`
- `GET /api/cart/summary`

### Orders
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:id`

## Data Flow

```
User Browser
    ↓
Frontend (Next.js, React, Zustand)
    ↓
API Client (lib/api.ts - JWT injection)
    ↓
Backend API (Express, JWT validation)
    ↓
(Database ready - PostgreSQL/MongoDB)
    ↓
Response back to Frontend
    ↓
Update UI & LocalStorage
```

## Key Components

### Frontend Components
- `ProductCard` - Displays product with price and add-to-cart
- `ProductFilters` - Advanced filtering UI
- `CartIcon` - Navigation cart badge
- `Navigation` - Header with auth-aware menu

### Backend Services
- `auth.service` - Password hashing, JWT tokens
- `product.service` - Product CRUD operations
- `cart.service` - Cart management
- `order.service` - Order processing

## Current Phase Status

**Phase 4: Orders & Payments** ✅ COMPLETE
- Order creation: ✅ Working
- PayPal integration: ✅ Ready
- Order history: ✅ Ready
- Invoice generation: ✅ Ready

**Next: Phase 5 - Admin Dashboard & Analytics**

