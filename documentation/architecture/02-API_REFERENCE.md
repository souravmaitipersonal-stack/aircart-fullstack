# 📡 API Reference - Complete Endpoint Documentation

**Base URL**: `http://localhost:5000/api`  
**Content-Type**: `application/json`  
**Auth**: JWT Bearer Token (in `Authorization` header)

---

## System Endpoints

### GET /health
Health check endpoint to verify API is running.

**Request**:
```
GET http://localhost:5000/api/health
```

**Response**: `200 OK`
```json
{
  "status": "success",
  "message": "AirCart Backend is running!",
  "timestamp": "2026-03-28T15:30:45.123Z",
  "environment": "development",
  "version": "4.0.0-phase4"
}
```

---

### GET /
API information and endpoint documentation.

**Request**:
```
GET http://localhost:5000/api
```

**Response**: `200 OK`
```json
{
  "name": "AirCart API",
  "version": "4.0.0-phase4",
  "description": "E-Commerce, Elevated",
  "phase": "Phase 4: Orders & Payments",
  "endpoints": { ... }
}
```

---

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request**:
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass@123",
  "phone": "1234567890"
}
```

**Validation**:
- Email: Valid email format
- Password: 8+ chars, uppercase, lowercase, number, special char
- Name: 2+ characters
- Phone: Optional

**Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-123",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "customer"
    }
  },
  "message": "User registered successfully"
}
```

**Error Responses**:
- `400 Bad Request` - Invalid input or duplicate email
- `500 Internal Server Error` - Server error

---

### POST /auth/login
Login with email and password.

**Request**:
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass@123"
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-123",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "customer"
    }
  },
  "message": "Login successful"
}
```

**Error Responses**:
- `401 Unauthorized` - Wrong password
- `401 Unauthorized` - User not found
- `400 Bad Request` - Invalid format

---

### GET /auth/me
Get current authenticated user info.

**Request**:
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer {token}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "email": "john@example.com",
    "name": "John Doe",
    "phone": "1234567890",
    "role": "customer",
    "createdAt": "2026-03-28T15:20:00Z"
  }
}
```

**Error Response**:
- `401 Unauthorized` - No token or invalid token

---

### POST /auth/logout
Logout and invalidate token (optional).

**Request**:
```
POST http://localhost:5000/api/auth/logout
Authorization: Bearer {token}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Product Endpoints

### GET /products
List all products with optional filters.

**Request**:
```
GET http://localhost:5000/api/products?category=Electronics&minPrice=100&maxPrice=500&search=phone&sort=price-desc
```

**Query Parameters**:
- `category` (string): Filter by category
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `search` (string): Search by name
- `sort` (string): Sort order (price-asc, price-desc, newest)
- `featured` (boolean): Only featured products
- `inStock` (boolean): Only in-stock products

**Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": "prod-1",
      "name": "Wireless Phone",
      "price": 299.99,
      "image": "phone.jpg",
      "category": "Electronics",
      "rating": 4.5,
      "featured": true,
      "stock": 25
    },
    {
      "id": "prod-2",
      "name": "USB Cable",
      "price": 9.99,
      "image": "cable.jpg",
      "category": "Accessories",
      "rating": 4.0,
      "featured": false,
      "stock": 100
    }
  ],
  "total": 2
}
```

---

### GET /products/featured
Get featured products only.

**Request**:
```
GET http://localhost:5000/api/products/featured
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    { ...product with featured: true... }
  ]
}
```

---

### GET /products/:id
Get single product by ID.

**Request**:
```
GET http://localhost:5000/api/products/prod-1
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "prod-1",
    "name": "Wireless Phone",
    "description": "Latest smartphone with 5G...",
    "price": 299.99,
    "image": "phone.jpg",
    "category": "Electronics",
    "rating": 4.5,
    "reviews": 128,
    "stock": 25,
    "sku": "WHP-001",
    "warranty": "2 years",
    "createdAt": "2026-01-15T10:00:00Z"
  }
}
```

**Error Response**:
- `404 Not Found` - Product doesn't exist

---

### GET /products/category/:name
Get all products in a category.

**Request**:
```
GET http://localhost:5000/api/products/category/Electronics
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    { ...product... },
    { ...product... }
  ],
  "category": "Electronics",
  "count": 15
}
```

---

## Shopping Cart Endpoints

### GET /cart
Get current user's shopping cart.

**Request**:
```
GET http://localhost:5000/api/cart
Authorization: Bearer {token}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "productId": "prod-1",
      "name": "Wireless Phone",
      "quantity": 2,
      "price": 299.99,
      "image": "phone.jpg",
      "subtotal": 599.98
    },
    {
      "productId": "prod-2",
      "name": "USB Cable",
      "quantity": 5,
      "price": 9.99,
      "image": "cable.jpg",
      "subtotal": 49.95
    }
  ],
  "itemCount": 2
}
```

---

### POST /cart/add
Add item to cart.

**Request**:
```
POST http://localhost:5000/api/cart/add
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "prod-1",
  "quantity": 2
}
```

**Response**: `201 Created`
```json
{
  "success": true,
  "data": [
    { ...cart items... }
  ],
  "message": "Item added to cart"
}
```

---

### PUT /cart/update
Update item quantity in cart.

**Request**:
```
PUT http://localhost:5000/api/cart/update
Authorization: Bearer {token}
Content-Type: application/json

{
  "productId": "prod-1",
  "quantity": 5
}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    { ...updated cart items... }
  ]
}
```

---

### DELETE /cart/item/:productId
Remove item from cart.

**Request**:
```
DELETE http://localhost:5000/api/cart/item/prod-1
Authorization: Bearer {token}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    { ...remaining cart items... }
  ],
  "message": "Item removed from cart"
}
```

---

### DELETE /cart
Clear entire cart.

**Request**:
```
DELETE http://localhost:5000/api/cart
Authorization: Bearer {token}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": [],
  "message": "Cart cleared"
}
```

---

### GET /cart/summary
Get cart totals (subtotal, tax, shipping, total).

**Request**:
```
GET http://localhost:5000/api/cart/summary
Authorization: Bearer {token}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "subtotal": 649.93,
    "tax": 64.99,
    "shipping": 10.00,
    "total": 724.92,
    "itemCount": 7,
    "discount": 0
  }
}
```

---

### GET /cart/count
Get number of items in cart.

**Request**:
```
GET http://localhost:5000/api/cart/count
Authorization: Bearer {token}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "count": 7
  }
}
```

---

## Order Endpoints

### POST /orders
Create new order from cart.

**Request**:
```
POST http://localhost:5000/api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "shippingAddress": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "paypal"
}
```

**Response**: `201 Created`
```json
{
  "success": true,
  "data": {
    "orderId": "order-123",
    "orderNumber": "ORD-001234",
    "status": "pending",
    "total": 724.92,
    "paypalLink": "https://paypal.com/checkoutnow?token=..."
  }
}
```

---

### GET /orders
Get user's order history.

**Request**:
```
GET http://localhost:5000/api/orders
Authorization: Bearer {token}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "orderId": "order-123",
      "orderNumber": "ORD-001234",
      "status": "delivered",
      "total": 724.92,
      "createdAt": "2026-03-25T10:00:00Z"
    }
  ]
}
```

---

### GET /orders/:orderId
Get specific order details.

**Request**:
```
GET http://localhost:5000/api/orders/order-123
Authorization: Bearer {token}
```

**Response**: `200 OK`
```json
{
  "success": true,
  "data": {
    "orderId": "order-123",
    "orderNumber": "ORD-001234",
    "items": [...],
    "shippingAddress": {...},
    "status": "delivered",
    "total": 724.92,
    "createdAt": "2026-03-25T10:00:00Z"
  }
}
```

---

## Error Handling

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable error message",
  "details": "Additional context (optional)"
}
```

### Common HTTP Status Codes

| Status | Meaning | Example |
|--------|---------|---------|
| 200 | OK | GET successful |
| 201 | Created | POST successful |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend error |

---

## Authentication

All protected endpoints require the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

To get a token:
1. Call `POST /auth/register` or `POST /auth/login`
2. Extract `token` from response
3. Store in localStorage (frontend does this automatically)
4. Include in all authenticated requests

---

## Testing API Endpoints

### Using curl in PowerShell

```powershell
# Test health endpoint
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"name":"Test","email":"test@gmail.com","password":"Test@1234"}'

# Login
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
curl -X GET http://localhost:5000/api/auth/me `
  -H "Authorization: Bearer $token"

# Get products
curl http://localhost:5000/api/products
```

---

**Last Updated**: March 28, 2026  
**API Version**: 4.0.0  
**Status**: Production Ready

