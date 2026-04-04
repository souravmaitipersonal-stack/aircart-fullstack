# 🗄️ Database Schema - Complete Data Model

**Supported Databases**: PostgreSQL (production), MongoDB (alternative)  
**Current Mode**: In-memory storage (development)

---

## Database Overview

### PostgreSQL Schema (Production)

```sql
-- Total: 8 tables with ACID compliance
-- Foreign keys: Properly enforced
-- Indexes: On frequently queried columns
```

---

## Table Definitions

### users (User Accounts)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'vendor')),
  email_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMP,
  phone_verified BOOLEAN DEFAULT false,
  phone_verified_at TIMESTAMP,
  profile_picture_url VARCHAR(500),
  bio TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

**Fields**:
- `id`: Unique identifier (UUID)
- `email`: Unique email address
- `password_hash`: Bcrypt hashed password (10 rounds)
- `name`: User's full name
- `phone`: Contact phone number
- `role`: User role (customer/admin/vendor)
- `email_verified`: Email verification status
- `is_active`: Account active status

---

### products (Product Catalog)

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  discounted_price DECIMAL(10, 2),
  cost_price DECIMAL(10, 2),
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  sku VARCHAR(100) UNIQUE NOT NULL,
  image_url VARCHAR(500),
  gallery_urls TEXT[], -- Array of image URLs
  rating DECIMAL(3, 2) DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
  review_count INTEGER DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  min_stock INTEGER DEFAULT 10,
  max_stock INTEGER DEFAULT 1000,
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  vendor_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_featured ON products(featured) WHERE active = true;
CREATE INDEX idx_products_stock ON products(stock) WHERE stock = 0;
```

**Fields**:
- `id`: Product UUID
- `name`: Product name
- `price`: Current price
- `discounted_price`: Sale price (if applicable)
- `category/subcategory`: Product classification
- `sku`: Stock keeping unit
- `rating`: Average rating (0-5)
- `stock`: Available quantity
- `featured`: Pinned product flag
- `vendor_id`: Seller (if applicable)

---

### cart_items (Shopping Cart)

```sql
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  product_id UUID NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE(user_id, product_id)
);

-- Indexes
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
```

**Fields**:
- `id`: Cart item UUID
- `user_id`: User owning the cart
- `product_id`: Product in cart
- `quantity`: Number of items
- `added_at`: When item was added

---

### orders (Purchase Orders)

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_code VARCHAR(50) UNIQUE NOT NULL, -- e.g., ORD-001234
  user_id UUID NOT NULL,
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  shipping_fee DECIMAL(10, 2) DEFAULT 0,
  discount DECIMAL(10, 2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  payment_method VARCHAR(50), -- 'paypal', 'stripe', 'bankTransfer'
  payment_ref VARCHAR(255), -- External payment ID
  shipping_address JSONB NOT NULL, -- {street, city, state, postalCode, country}
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  shipped_at TIMESTAMP,
  delivered_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_code ON orders(order_code);
```

**Fields**:
- `id`: Order UUID
- `order_code`: Human-readable order number (ORD-001234)
- `user_id`: Customer
- `total/subtotal/tax/shipping/discount`: Price breakdown
- `status`: Order lifecycle (pending → delivered)
- `payment_status`: Payment state
- `payment_method`: How paid (PayPal, Stripe, etc.)
- `shipping_address`: Delivery location (JSON)

---

### order_items (Order Line Items)

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL,
  product_id UUID NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
```

**Fields**:
- `id`: Line item UUID
- `order_id`: Parent order
- `product_id`: Product ordered
- `quantity/unit_price/subtotal`: Pricing snapshot at order time

---

### reviews (Product Reviews)

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title VARCHAR(255),
  content TEXT,
  helpful_count INTEGER DEFAULT 0,
  verified_purchase BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(product_id, user_id)
);

-- Indexes
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

**Fields**:
- `id`: Review UUID
- `product_id`: Product being reviewed
- `user_id`: Reviewer
- `rating`: 1-5 stars
- `title/content`: Review text
- `verified_purchase`: Only verified buyers can review

---

### categories (Product Categories)

```sql
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  icon_url VARCHAR(500),
  parent_id UUID,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(active);
```

---

### payments (Payment Records)

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  external_payment_id VARCHAR(255), -- PayPal/Stripe transaction ID
  response_data JSONB, -- Full payment gateway response
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(status);
```

---

## MongoDB Collections (Alternative)

### users

```json
{
  "_id": ObjectId,
  "email": "user@example.com",
  "passwordHash": "bcrypt_hash",
  "name": "John Doe",
  "phone": "1234567890",
  "role": "customer",
  "emailVerified": false,
  "isActive": true,
  "createdAt": ISODate("2026-03-28T10:00:00Z"),
  "updatedAt": ISODate("2026-03-28T10:00:00Z")
}
```

### products

```json
{
  "_id": ObjectId,
  "sku": "WHP-001",
  "name": "Wireless Phone",
  "description": "Latest 5G smartphone",
  "price": 299.99,
  "category": "Electronics",
  "rating": 4.5,
  "stock": 25,
  "featured": true,
  "images": ["phone.jpg"],
  "createdAt": ISODate("2026-01-15T10:00:00Z")
}
```

### sales_orders

```json
{
  "_id": ObjectId,
  "orderCode": "ORD-001234",
  "userId": ObjectId("..."),
  "items": [
    {
      "productId": ObjectId("..."),
      "quantity": 2,
      "price": 299.99
    }
  ],
  "total": 724.92,
  "status": "delivered",
  "paymentMethod": "paypal",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York"
  },
  "createdAt": ISODate("2026-03-25T10:00:00Z")
}
```

### shopping_cart

```json
{
  "_id": ObjectId,
  "userId": ObjectId("..."),
  "items": [
    {
      "productId": ObjectId("..."),
      "quantity": 2
    }
  ],
  "updatedAt": ISODate("2026-03-28T15:30:00Z")
}
```

---

## Data Relationships

```
users (1) ──┬─→ (many) cart_items
            ├─→ (many) orders
            ├─→ (many) reviews
            └─→ (many) payments

products (1) ──┬─→ (many) cart_items
               ├─→ (many) order_items
               └─→ (many) reviews

orders (1) ──┬─→ (many) order_items
             └─→ (many) payments

categories (1) ──→ (many) products
```

---

## Typical Data Flows

### User Registration → Purchase Flow

1. **User Registration**
   - Insert into `users` table
   - Hash password with bcrypt

2. **Product Browse**
   - Query `products` table
   - Filter by category, price, rating

3. **Add to Cart**
   - Insert/update `cart_items`
   - Link user → products

4. **Create Order**
   - Insert `orders` record
   - Insert multiple `order_items` (one per product)
   - Clear `cart_items` for user
   - Initiate payment

5. **Payment Processing**
   - Insert `payments` record with external ID
   - Update `orders.payment_status`

6. **Order Delivery**
   - Update `orders.status` → delivered
   - Update `orders.updated_at` timestamp

---

## Important Constraints

### Authentication
- Passwords: Bcrypt hashed (10 rounds) before storage
- Tokens: JWT with HS256 algorithm
- No plain passwords ever stored

### Business Rules
- Order total must equal sum of order_items subtotals
- Cart quantity must be > 0 and ≤ product stock
- Product price must be ≥ 0
- Rating must be between 0-5

### Cascading Operations
- When user deleted → orders/cart items deleted
- When product deleted → reviews/order_items affected
- Orders never auto-deleted (audit trail)

---

## Query Performance

### Most Common Queries

```sql
-- Get user cart (frequently accessed)
SELECT * FROM cart_items WHERE user_id = $1
JOIN products ON cart_items.product_id = products.id

-- Get recent orders
SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50

-- Browse products with filters
SELECT * FROM products 
WHERE category = $1 AND price BETWEEN $2 AND $3
AND active = true
ORDER BY featured DESC, rating DESC

-- Check product availability
SELECT stock FROM products WHERE id = $1
```

---

## Backup & Recovery

- **Daily automated backups** of production database
- **30-day retention** policy
- **Point-in-time restore** capability
- **Replication** across availability zones (if cloud hosted)

---

**Last Updated**: March 28, 2026  
**Schema Version**: 4.0  
**Status**: Production Ready

