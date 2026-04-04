# 🛠️ Technology Stack - Complete Framework Overview

**Project**: AirCart (Phase 4 - Complete E-Commerce Platform)  
**Architecture**: Full-stack monorepo with Turborepo  
**Languages**: TypeScript, JavaScript, SQL  
**Status**: Production Ready

---

## Frontend Stack

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.12 | React meta-framework with SSR/SSG |
| **React** | 18.2 | UI component library |
| **TypeScript** | 5.4 | Type safety and development experience |
| **Node.js** | 20+ | Runtime environment |

**Location**: `apps/web/`

### Styling & UI

| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | 3.4 | Utility-first CSS framework |
| **PostCSS** | 8.4+ | CSS transformation and optimization |
| **Autoprefixer** | Latest | Browser vendor prefixes |

**Configuration**:
- `tailwind.config.js` - Tailwind customization
- `postcss.config.js` - PostCSS plugins
- `globals.css` - Global styles

### State Management

| Technology | Version | Purpose |
|------------|---------|---------|
| **Zustand** | 4.4 | Lightweight state management |
| **localStorage** | Native | Persistent client-side storage |

**Store Location**: `apps/web/src/store/cart.ts`

```typescript
// Example: Cart state management
import { create } from 'zustand'

export const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  }))
}))
```

### HTTP & API

| Technology | Purpose |
|------------|---------|
| **Fetch API** | HTTP requests (built-in) |
| **JWT** | Token-based authentication |
| **CORS** | Cross-origin resource sharing |

**API Client**: `apps/web/src/lib/api.ts`
- Centralized request handler
- Automatic JWT token injection
- Error handling & response typing

### Development Tools

| Technology | Purpose |
|------------|---------|
| **npm** | Package manager |
| **Turborepo** | Monorepo orchestration |
| **ESLint** | Code linting (optional) |
| **Prettier** | Code formatting (optional) |

### Frontend Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^15.5.12",
    "zustand": "^4.4.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

---

## Backend Stack

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Express** | 5.0 | REST API framework |
| **Node.js** | 20+ | JavaScript runtime |
| **TypeScript** | 5.4 | Type-safe backend code |

**Location**: `packages/api/`

### Database & ORM

| Technology | Version | Purpose |
|------------|---------|---------|
| **PostgreSQL** | 14+ | Primary relational database |
| **MongoDB** | 6.0+ | Alternative document storage |
| **node-postgres** | 8.10+ | PostgreSQL driver |

**Current Development**: In-memory storage (for rapid prototyping)

### Authentication & Security

| Technology | Purpose | Details |
|------------|---------|---------|
| **JWT** | Token generation | HS256 algorithm, 24hr expiry |
| **Bcrypt** | Password hashing | 10 salt rounds |
| **CORS** | Cross-origin requests | Configured for localhost:3000 |
| **dotenv** | Environment variables | `.env` file configuration |

**Security Practices**:
```typescript
// Password hashing (api/auth/register)
const hashedPassword = await bcrypt.hash(password, 10)

// JWT signing (api/auth/login)
const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
  expiresIn: '24h'
})

// Token verification (middleware)
authMiddleware: (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
}
```

### Validation

| Technology | Version | Purpose |
|------------|---------|---------|
| **Zod** | 3.22+ | TypeScript-first schema validation |

**Usage**: Request body validation before processing
```typescript
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2)
})
```

### API Structure

| Component | Purpose |
|-----------|---------|
| **Routes** | API endpoint definitions |
| **Controllers** | Business logic handlers |
| **Services** | Data access & operations |
| **Middleware** | Request/response processing |
| **Models** | Data schema definitions |

**Main API Modules**:
- `/api/auth` - Authentication (register, login, profile)
- `/api/products` - Product catalog (browse, filter, search)
- `/api/cart` - Shopping cart (add, remove, update)
- `/api/orders` - Order management (create, history)
- `/api/payments` - Payment processing (PayPal, Stripe)

### Backend Dependencies

```json
{
  "dependencies": {
    "express": "^5.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.1.0",
    "zod": "^3.22.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "pg": "^8.10.0",
    "mongoose": "^7.7.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "nodemon": "^3.0.0",
    "@types/express": "^4.17.21",
    "@types/node": "^20.10.0"
  }
}
```

### API Endpoints

**Total**: 20+ RESTful endpoints

#### Authentication (5 endpoints)
- POST `/auth/register` - New user registration
- POST `/auth/login` - User login
- GET `/auth/me` - Current user profile
- POST `/auth/logout` - Logout
- GET `/auth/refresh` - Token refresh

#### Products (5 endpoints)
- GET `/products` - List with filters
- GET `/products/featured` - Featured products
- GET `/products/:id` - Single product
- GET `/products/category/:name` - Category browse
- POST `/products/search` - Text search

#### Cart (5 endpoints)
- GET `/cart` - View cart
- POST `/cart/add` - Add item
- PUT `/cart/update` - Update quantity
- DELETE `/cart/item/:id` - Remove item
- DELETE `/cart` - Clear cart

#### Orders (3 endpoints)
- POST `/orders` - Create order
- GET `/orders` - Order history
- GET `/orders/:id` - Order details

#### System (2 endpoints)
- GET `/health` - Health check
- GET `/` - API info

---

## Development Setup

### Environment Variables

#### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NODE_ENV=development
```

#### Backend (`.env`)
```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
JWT_SECRET=your_secret_key_here
BCRYPT_ROUNDS=10
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aircart_db
DB_USER=postgres
DB_PASSWORD=password
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret
```

### Running Locally

```bash
# Install dependencies (monorepo)
npm install

# Run development servers (both frontend & backend)
npm run dev

# Frontend: http://localhost:3000
# Backend: http://localhost:5000

# Run tests
npm run test

# Build production (frontend)
cd apps/web
npm run build
```

---

## Testing Stack

| Technology | Purpose | Files |
|-----------|---------|-------|
| **Vitest** | Unit testing | `.test.ts` files |
| **Jest** | Integration testing | `.integration.test.ts` |
| **Supertest** | HTTP assertions | API endpoint testing |

**Test Locations**:
- Frontend unit tests: `apps/web/__tests__/`
- Backend unit tests: `packages/api/__tests__/`
- Integration tests: `packages/api/src/services/api.integration.test.ts`

**Test Coverage**:
- Authentication (registration, login, JWT)
- API endpoints (CRUD operations)
- Business logic (cart calculations, pricing)
- Error handling & validation

```bash
# Run all tests
npm run test

# Run specific test file
npm run test -- api.integration.test.ts

# Run with coverage
npm run test -- --coverage
```

---

## DevOps & Deployment

### Containerization

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Docker** | Latest | Container runtime |
| **Docker Compose** | 3.8+ | Multi-container orchestration |

**Docker Configuration**:
- `Dockerfile` - Backend API container image
- `docker-compose.yml` - Services definition (API, PostgreSQL, MongoDB)

**Running with Docker**:
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Services in Docker Compose**:
1. **API Service** - Express backend on port 5000
2. **PostgreSQL** - Database on port 5432
3. **MongoDB** - Document database on port 27017

### Deployment Platforms

| Platform | Status | Use Case |
|----------|--------|----------|
| **Vercel** | Ready | Frontend deployment (Next.js native) |
| **Railway** | Ready | Backend & database deployment |
| **AWS** | Documented | Enterprise deployment |
| **Docker Hub** | Ready | Container registry |

**Configuration Files**:
- `vercel.json` - Vercel deployment config
- `railway.toml` - Railway deployment config
- `.github/workflows/` - CI/CD pipelines (if configured)

---

## Code Organization

### Monorepo Structure (Turborepo)

```
aircart-fullstack/
├── apps/
│   └── web/                  # Next.js frontend
│       ├── src/
│       │   ├── app/         # Page routes
│       │   ├── components/  # Reusable UI components
│       │   ├── lib/         # Utilities & API client
│       │   ├── store/       # Zustand state
│       │   └── styles/      # Global CSS
│       └── package.json
├── packages/
│   ├── api/                 # Express backend
│   │   ├── src/
│   │   │   ├── index.ts     # Server entry
│   │   │   ├── routes/      # API endpoints
│   │   │   ├── services/    # Business logic
│   │   │   ├── models/      # Data schemas
│   │   │   └── middleware/  # Express middleware
│   │   └── package.json
│   ├── types/               # Shared TypeScript types
│   ├── ui/                  # Shared UI components
│   └── utils/               # Utility functions
├── turbo.json               # Turborepo configuration
└── package.json             # Root workspace config
```

### Key Files

**Frontend**:
- `apps/web/src/lib/api.ts` - HTTP client
- `apps/web/src/store/cart.ts` - Cart state
- `apps/web/src/app/auth/register/page.tsx` - Registration UI
- `apps/web/next.config.js` - Next.js config

**Backend**:
- `packages/api/src/index.ts` - Server bootstrap
- `packages/api/src/routes/` - Route definitions
- `packages/api/src/services/` - Service layer
- `packages/api/src/middleware/auth.ts` - Auth middleware

---

## Performance & Optimization

### Frontend Optimization
- Next.js Image optimization
- Code splitting & lazy loading
- CSS purging with Tailwind
- Client-side caching with localStorage

### Backend Optimization
- Connection pooling (database)
- Request rate limiting
- Compression middleware
- Database query indexing

### Scalability Considerations
- Stateless API design
- Database replication
- Redis caching (future)
- CDN for static assets
- Load balancing

---

## Monitoring & Logging

### Current Logging
- Server logs to console (development)
- Error logging in API responses
- Frontend error tracking (to be configured)

### Production Recommendations
- Centralized logging (ELK Stack, DataDog)
- Error tracking (Sentry, Rollbar)
- Performance monitoring (New Relic)
- Uptime monitoring (StatusPage)

---

## Version Management

| Component | Version | Node | Status |
|-----------|---------|------|--------|
| Frontend | 4.0 | 20+ | ✅ Production |
| Backend | 4.0 | 20+ | ✅ Production |
| Database | Schema 4.0 | - | ✅ Production |
| Types | 1.0 | - | ✅ Current |

---

## Troubleshooting

### Common Issues

**Module Resolution**
- Updated `moduleResolution` to `"bundler"` in tsconfig.json
- Fixes: Next.js 15 compatibility issues

**Type Errors**
- Use type assertions for API responses: `as any`
- Or create proper TypeScript interfaces in `packages/types/`

**Port Already in Use**
```powershell
# Find process using port 5000
netstat -ano | Select-String ":5000"

# Kill process (Windows)
taskkill /PID <PID> /F
```

---

## Resources & Documentation

| Resource | Link |
|----------|------|
| Next.js Docs | https://nextjs.org/docs |
| React Docs | https://react.dev |
| Express Docs | https://expressjs.com |
| TypeScript Docs | https://www.typescriptlang.org |
| Tailwind CSS | https://tailwindcss.com/docs |
| Zustand | https://github.com/pmndrs/zustand |
| Zod | https://zod.dev |
| Turborepo | https://turbo.build |

---

**Last Updated**: March 28, 2026  
**Stack Version**: 4.0  
**Status**: Complete & Documented

