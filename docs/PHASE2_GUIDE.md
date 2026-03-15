# Phase 2 Implementation Guide

## Overview
Phase 2 implements **User Authentication & JWT Security** with registration, login, and protected routes.

**Duration**: Week 3-4 (2 weeks)  
**Status**: ✅ Complete - Ready for testing

---

## ✅ What's Implemented

### Backend (packages/api)

#### 1. **Authentication Service** (`src/services/auth.service.ts`)
- Password hashing with bcrypt (10 salt rounds)
- JWT token generation & verification
- Password strength validation (8+ chars, uppercase, lowercase, number, special char)
- Token extraction from Authorization headers

#### 2. **Auth Middleware** (`src/middleware/auth.middleware.ts`)
- `authMiddleware`: Protects routes, verifies JWT
- `adminMiddleware`: Admin-only route protection
- `optionalAuthMiddleware`: Optional authentication
- Attaches user data to `req.user`

#### 3. **Authentication Routes** (`src/routes/auth.ts`)
```
POST   /api/auth/register  - User registration
POST   /api/auth/login      - User login + token generation
POST   /api/auth/logout     - User logout
GET    /api/auth/me         - Get current user (protected)
POST   /api/auth/refresh    - Token refresh (placeholder)
```

#### 4. **Database Schemas**
- **PostgreSQL** (`src/database/schema.sql`):
  - Users table with UUID primary key
  - Password reset tokens table
  - Audit logs table
  - Automatic timestamp triggers
  - Performance indexes

- **MongoDB** (`src/database/mongodb-models.ts`):
  - Mongoose User schema
  - Password reset token schema
  - Audit log schema
  - Pre-save hooks for timestamps

#### 5. **User Models** (`src/models/User.ts`)
- User interface with all fields
- CreateUserRequest, LoginRequest
- AuthResponse with token + user

### Frontend (apps/web)

#### 1. **Login Page** (`src/app/auth/login/page.tsx`)
- Email & password input
- Remember me checkbox
- Demo credentials display
- Error handling
- Redirect to dashboard on success
- Beautiful gradient background

#### 2. **Register Page** (`src/app/auth/register/page.tsx`)
- Full name, email, phone inputs
- Password strength indicator (real-time validation)
- Confirm password matching
- Terms & conditions checkbox
- Form validation
- Auto-redirect to dashboard

#### 3. **Dashboard Page** (`src/app/dashboard/page.tsx`)
- Protected route (checks localStorage token)
- User profile display
- Orders overview
- Account settings menu
- Phase 2 status board
- Logout functionality

---

## 🧪 Testing Endpoints

### 1. Register New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass@123",
    "name": "John Doe",
    "phone": "+1-234-567-8900"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "user-1234567890",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "customer",
      "isActive": true,
      "createdAt": "2026-03-14T...",
      "updatedAt": "2026-03-14T..."
    }
  },
  "message": "User registered successfully"
}
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@aircart.com",
    "password": "Admin@123!Pass"
  }'
```

### 3. Get Current User (Protected)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Logout (Protected)
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎨 Frontend Testing

### Login Flow
1. Navigate to `http://localhost:3000/auth/login`
2. Use demo credentials:
   - Email: `admin@aircart.com`
   - Password: `Demo@123!Pass` (or your registered email)
3. Click "Sign In"
4. Should redirect to `http://localhost:3000/dashboard`

### Register Flow
1. Navigate to `http://localhost:3000/auth/register`
2. Fill in all fields
3. Watch password strength indicator
4. Create account
5. Auto-redirect to dashboard

### Dashboard Access
- Shows user profile info
- Displays orders count
- Lists account management options
- Shows Phase 2 progress board

---

## 🔐 Security Features Implemented

✅ **Passwords**
- Hashed with bcrypt (10 rounds)
- Strength validation enforced
- Never stored in plain text
- Never returned in API responses

✅ **JWT Tokens**
- 7-day expiration for access tokens
- 30-day expiration for refresh tokens
- HS256 signing algorithm
- Token verification on protected routes

✅ **Route Protection**
- Authentication middleware on all protected routes
- Admin-only routes with separate middleware
- Token extraction & validation
- Automatic 401 response for missing/invalid tokens

✅ **Request Validation**
- Zod schema validation
- Email format checking
- Required field validation
- Type-safe error responses

---

## 📊 Data Storage (Demo Mode)

**Current**: In-memory Map (for Phase 2 demo)
- Data persists during server runtime
- Lost on server restart
- Perfect for testing

**Phase 3**: Will integrate with:
- PostgreSQL (relational data)
- MongoDB (document store)
- Proper migrations

---

## 🚀 Next Steps (Phase 3)

### Database Integration
- [ ] Connect PostgreSQL
- [ ] Run database migrations
- [ ] Implement User repository
- [ ] Add transaction support

### Enhanced Auth
- [ ] Email verification
- [ ] Password reset flow
- [ ] Refresh token rotation
- [ ] Token blacklisting

### Authorization
- [ ] Role-based access control (RBAC)
- [ ] Permission system
- [ ] Resource-level authorization

### Frontend
- [ ] Auth context/store (Zustand)
- [ ] Protected route wrapper
- [ ] Auto-logout on token expiry
- [ ] API client with auth interceptors

---

## 📝 Environment Variables

Create `.env` in `packages/api/`:
```env
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRY=7d
REFRESH_TOKEN_EXPIRY=30d
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000
```

---

## 🔧 Running Phase 2

### Start Backend
```bash
cd packages/api
npm run dev
```
Runs on `http://localhost:5000`

### Start Frontend  
```bash
cd apps/web
npm run dev
```
Runs on `http://localhost:3000`

### Both Services
```bash
# From root
npm run dev --filter=api --filter=web
```

---

## 📚 Files Created/Modified

### New Files
- `packages/api/src/services/auth.service.ts` - Auth logic
- `packages/api/src/middleware/auth.middleware.ts` - Auth guards
- `packages/api/src/routes/auth.ts` - Auth endpoints
- `packages/api/src/models/User.ts` - User interfaces
- `packages/api/src/database/schema.sql` - PostgreSQL schema
- `packages/api/src/database/mongodb-models.ts` - MongoDB models
- `apps/web/src/app/auth/login/page.tsx` - Login page
- `apps/web/src/app/auth/register/page.tsx` - Register page
- `apps/web/src/app/dashboard/page.tsx` - Dashboard

### Modified Files
- `packages/api/src/index.ts` - Added auth routes import & middleware

---

## 🎯 Success Criteria

✅ Backend
- [ ] Register endpoint creates users
- [ ] Login endpoint returns tokens
- [ ] Protected routes block unauthenticated requests
- [ ] JWT tokens verify correctly

✅ Frontend
- [ ] Register page submits to API
- [ ] Login page authenticates user
- [ ] Tokens stored in localStorage
- [ ] Dashboard is accessible after login
- [ ] Unauthorized users redirected to login

---

## 💡 Demo Credentials

```
Email: admin@aircart.com
Password: Admin@123!Pass (demo - update in Phase 3)
```

Or register a new account via `/auth/register`

---

## 🆘 Troubleshooting

### "Passwords do not match"
- Ensure confirm password field matches password field exactly

### "Token is expired"
- Tokens last 7 days. Register new account in demo mode.

### "Invalid credentials"
- Check email and password are correct
- Passwords are case-sensitive

### CORS errors
- Ensure `CLIENT_URL` in backend `.env` matches frontend URL
- Default: `http://localhost:3000`

### Backend not running
```bash
cd packages/api && npm install && npm run dev
```

### Frontend not running
Check Node.js v20+ is installed:
```bash
node --version  # Should be v20.11.1 or higher
```

---

## 📖 Learning Outcomes

After Phase 2, you'll understand:
- ✅ JWT authentication flow
- ✅ Password security & hashing
- ✅ Middleware pattern in Express
- ✅ API route protection
- ✅ Frontend auth state management
- ✅ Secure token storage
- ✅ Server-side validation
- ✅ Error handling in auth flows

---

**Phase 2 Ready! Proceed to Phase 3 for database integration. 🚀**
