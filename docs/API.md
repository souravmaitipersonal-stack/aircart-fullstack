# AirCart API Documentation

Complete API reference for AirCart backend.

> **Note**: This is Phase 1. Full endpoints will be added in subsequent phases.

## Base URL

```
Development:  http://localhost:5000/api
Production:   https://api.aircart.com/api
```

## Authentication

Most endpoints require JWT authentication via:
- Cookie: `authToken`
- Header: `Authorization: Bearer <token>`

## Response Format

All responses follow this format:

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2026-03-14T10:30:00.000Z"
}
```

Errors:
```json
{
  "success": false,
  "error": "Email already exists",
  "code": "EMAIL_EXISTS",
  "status": 400
}
```

---

## Endpoints

### Health Check

**GET** `/health`

Check if API is running.

```bash
curl http://localhost:5000/api/health
```

Response:
```json
{
  "status": "success",
  "message": "AirCart Backend is running!",
  "timestamp": "2026-03-14T10:30:00.000Z",
  "environment": "development"
}
```

---

### Welcome

**GET** `/`

Get API information.

```bash
curl http://localhost:5000/api
```

Response:
```json
{
  "name": "AirCart API",
  "version": "1.0.0",
  "description": "E-Commerce, Elevated",
  "endpoints": {
    "health": "/api/health",
    "auth": "/api/auth",
    "products": "/api/products",
    "cart": "/api/cart",
    "orders": "/api/orders"
  }
}
```

---

## Phase 2 Endpoints (Coming)

### Authentication

```
POST   /auth/register      - Register new user
POST   /auth/login         - User login
POST   /auth/logout        - User logout
POST   /auth/refresh       - Refresh JWT token
GET    /auth/me            - Get current user (protected)
```

### Products

```
GET    /products           - List all products
GET    /products/:id       - Get product details
POST   /products           - Create product (admin only)
PUT    /products/:id       - Update product (admin only)
DELETE /products/:id       - Delete product (admin only)
```

### Cart

```
GET    /cart               - Get current user's cart
POST   /cart/items         - Add item to cart
PUT    /cart/items/:id     - Update cart item quantity
DELETE /cart/items/:id     - Remove item from cart
```

### Orders

```
POST   /orders             - Create order
GET    /orders             - Get user's orders
GET    /orders/:id         - Get order details
PUT    /orders/:id/status  - Update order status (admin)
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal error |

---

## Error Codes

| Code | Status | Description |
|------|--------|-------------|
| INVALID_INPUT | 400 | Validation failed |
| EMAIL_EXISTS | 400 | Email already registered |
| INVALID_CREDENTIALS | 401 | Wrong email/password |
| AUTH_REQUIRED | 401 | Token missing or invalid |
| INSUFFICIENT_PERMISSIONS | 403 | Admin access required |
| NOT_FOUND | 404 | Resource doesn't exist |
| SERVER_ERROR | 500 | Internal server error |

---

## Implementation Timeline

- **Phase 1**: Health check, basic structure ✅
- **Phase 2**: Authentication (register, login, JWT)
- **Phase 3**: Products (CRUD, listing)
- **Phase 4**: Cart & Orders
- **Phase 5**: Admin endpoints, payment integration
- **Phase 6**: GraphQL API

---

## Examples

### Using Thunder Client (VS Code)
Create `.http` file in project root:

```http
### Health Check
GET http://localhost:5000/api/health

### API Info
GET http://localhost:5000/api
```

### Using cURL
```bash
curl http://localhost:5000/api/health

curl -X GET http://localhost:5000/api \
  -H "Content-Type: application/json"
```

### Using Postman/Insomnia
Import endpoints from `.http` files or manually create requests.

---

## Rate Limiting

Currently no rate limiting. Will be added in production phase.

---

## CORS

Configured for:
```
Origin: http://localhost:3000 (development)
Methods: GET, POST, PUT, DELETE, OPTIONS
Credentials: true
```

---

## Testing

Test endpoints using Thunder Client or Postman:

1. **Health Check**: `GET /api/health` (no auth)
2. **API Info**: `GET /api` (no auth)

---

## How to Test Locally

```bash
# Start backend
npm run dev --filter=api

# In another terminal, test endpoint
curl http://localhost:5000/api/health

# Should return:
# {"status":"success","message":"AirCart Backend is running!","timestamp":"...","environment":"development"}
```

---

## Pagination

Endpoints with large datasets support pagination:

```
?page=1&limit=20
```

Example:
```
GET /products?page=1&limit=20&category=electronics
```

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

---

## Filtering & Search

Products endpoint supports:
```
?category=electronics
?search=laptop
?priceMin=100&priceMax=1000
?sort=price&order=asc
```

---

## Glossary

| Term | Definition |
|------|-----------|
| JWT | JSON Web Token - stateless authentication |
| Bearer Token | JWT passed in Authorization header |
| CORS | Cross-Origin Resource Sharing - allows requests from other domains |
| Rate Limiting | Limiting requests per user/IP to prevent abuse |
| Pagination | Splitting large datasets into pages |

---

For full implementation details, see [ARCHITECTURE.md](./ARCHITECTURE.md)
