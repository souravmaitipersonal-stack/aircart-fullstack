# 🗄️ Database Access Guide for Admins

**Last Updated**: March 28, 2026  
**Status**: Complete & Ready

---

## 📋 Overview

This guide explains how administrators can access and manage the AirCart databases directly. The system supports multiple database options:

1. **PostgreSQL** - Primary relational database
2. **MongoDB** - Document database alternative
3. **In-Memory** - Development/testing only

---

## 🔐 PostgreSQL Access

### Option 1: Connection String (Direct Connection)

#### Standard Connection Format
```
postgresql://username:password@host:port/database_name
```

#### Development Environment
```
Host: localhost
Port: 5432
Database: aircart_db
Username: aircart_user
Password: aircart_secure_password_123
```

#### Complete Development Connection String
```
postgresql://aircart_user:aircart_secure_password_123@localhost:5432/aircart_db
```

#### Production Connection String (Railway/Neon)
```
postgresql://admin:securepassword@db.railway.app:5432/production_db
```

### Option 2: pgAdmin Web Interface (GUI)

pgAdmin is a web-based PostgreSQL management tool.

#### Setup pgAdmin Locally
```bash
# Using Docker (Recommended)
docker run -p 5050:80 \
  -e 'PGADMIN_DEFAULT_EMAIL=admin@aircart.com' \
  -e 'PGADMIN_DEFAULT_PASSWORD=admin' \
  dpage/pgadmin4

# Access pgAdmin at: http://localhost:5050
# Login with: admin@aircart.com / admin
```

#### Add Server in pgAdmin
1. Open http://localhost:5050
2. Login with credentials above
3. Right-click "Servers" → "Create" → "Server"
4. **General Tab**:
   - Name: AirCart Dev
5. **Connection Tab**:
   - Host: localhost
   - Port: 5432
   - Username: aircart_user
   - Password: aircart_secure_password_123
   - Database: aircart_db
6. Click "Save"

### Option 3: Command Line (psql)

#### Install PostgreSQL Client
```bash
# Windows (if PostgreSQL not installed)
# Download from: https://www.postgresql.org/download/windows/

# macOS
brew install postgresql

# Linux
sudo apt-get install postgresql-client
```

#### Connect Using psql
```bash
# Basic connection
psql -U aircart_user -h localhost -d aircart_db

# With password prompt
psql -U aircart_user -h localhost -d aircart_db -W

# Connection string method
psql postgresql://aircart_user:aircart_secure_password_123@localhost:5432/aircart_db
```

#### Common psql Commands
```sql
-- List all databases
\l

-- Connect to a database
\c aircart_db

-- List all tables
\dt

-- Show table structure
\d table_name

-- Show all users
\du

-- Exit psql
\q

-- Run SQL query
SELECT * FROM users;
```

### Option 4: Visual Studio Code Extension

#### Install PostgreSQL Extension
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "PostgreSQL"
4. Install the extension by "Chris Kolkman"

#### Configure Connection
1. In VS Code, open Command Palette (Ctrl+Shift+P)
2. Type "PostgreSQL: Add Connection"
3. Fill in details:
   - Host: localhost
   - User: aircart_user
   - Password: aircart_secure_password_123
   - Port: 5432
   - Database: aircart_db

#### Usage
- View database structure in sidebar
- Right-click tables to run queries
- Execute SQL scripts directly

---

## 🍃 MongoDB Access

### Option 1: MongoDB Atlas (Cloud)

#### Create Free Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create cluster (M0 free tier)
4. Create database user
5. Whitelist IP address

#### Connection String Format
```
mongodb+srv://username:password@cluster0.mongodb.net/database_name
```

#### Development Connection String Example
```
mongodb+srv://aircart_admin:secure_password_123@aircart-dev.mongodb.net/aircart_db
```

### Option 2: MongoDB Compass (Desktop GUI)

MongoDB Compass is a GUI tool for MongoDB management.

#### Download & Install
1. Visit: https://www.mongodb.com/products/compass
2. Download for your OS
3. Install the application

#### Connect to Local MongoDB
1. Open MongoDB Compass
2. Click "New Connection"
3. Connection String:
   ```
   mongodb://localhost:27017/aircart_db
   ```
4. Click "Connect"

#### Connect to MongoDB Atlas
1. In MongoDB Compass, click "New Connection"
2. Paste your Atlas connection string:
   ```
   mongodb+srv://aircart_admin:password@cluster0.mongodb.net/aircart_db
   ```
3. Click "Connect"

### Option 3: Command Line (mongosh)

#### Install MongoDB Tools
```bash
# Download from: https://www.mongodb.com/try/download/shell

# Windows: Download and install from website
# macOS: brew install mongosh
# Linux: Follow official guide
```

#### Connect to Local MongoDB
```bash
mongosh mongodb://localhost:27017/aircart_db
```

#### Connect to MongoDB Atlas
```bash
mongosh "mongodb+srv://aircart_admin:password@cluster0.mongodb.net/aircart_db"
```

#### Common mongosh Commands
```javascript
// Show current database
db

// Switch database
use aircart_db

// List all collections
show collections

// List all databases
show dbs

// Query documents
db.users.find()

// Insert document
db.users.insertOne({ email: "test@example.com", name: "Test User" })

// Update document
db.users.updateOne({ _id: ObjectId("...") }, { $set: { name: "New Name" } })

// Delete document
db.users.deleteOne({ _id: ObjectId("...") })

// Count documents
db.users.countDocuments()

// Exit mongosh
exit
```

---

## 🗄️ Database Schemas

### PostgreSQL Tables

#### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Orders Table
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'pending',
  total_amount DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### MongoDB Collections

#### Users Collection
```javascript
{
  _id: ObjectId("..."),
  email: "user@example.com",
  password: "hashed_password",
  name: "User Name",
  phone: "1234567890",
  role: "customer",
  createdAt: ISODate("2026-03-28T00:00:00Z")
}
```

#### Products Collection
```javascript
{
  _id: ObjectId("..."),
  id: 1,
  name: "Product Name",
  description: "Product description",
  price: 99.99,
  category: "Electronics",
  imageUrl: "https://...",
  status: "active",
  createdAt: ISODate("2026-03-28T00:00:00Z")
}
```

---

## 🔑 Environment Variables

### PostgreSQL Configuration
```env
# .env.local or .env.production

# PostgreSQL Connection
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aircart_db
DB_USER=aircart_user
DB_PASSWORD=aircart_secure_password_123

# or use connection string
DATABASE_URL=postgresql://aircart_user:aircart_secure_password_123@localhost:5432/aircart_db
```

### MongoDB Configuration
```env
# MongoDB Local
MONGODB_URL=mongodb://localhost:27017/aircart_db

# MongoDB Atlas
MONGODB_URL=mongodb+srv://aircart_admin:password@cluster0.mongodb.net/aircart_db
```

### Environment Files Location
```
aircart-fullstack/
├── .env.local              (Local development)
├── .env.production         (Production)
├── packages/api/.env       (Backend specific)
└── apps/web/.env.local     (Frontend specific)
```

---

## 🚀 Backup & Restore

### PostgreSQL Backup

#### Create Backup
```bash
# Backup entire database
pg_dump -U aircart_user -h localhost aircart_db > backup.sql

# Backup with custom format (compressed)
pg_dump -U aircart_user -h localhost -Fc aircart_db > backup.dump
```

#### Restore from Backup
```bash
# Restore SQL backup
psql -U aircart_user -h localhost aircart_db < backup.sql

# Restore custom format backup
pg_restore -U aircart_user -h localhost -d aircart_db backup.dump
```

### MongoDB Backup

#### Create Backup
```bash
# Backup local MongoDB
mongodump --uri "mongodb://localhost:27017/aircart_db" --out ./backup

# Backup MongoDB Atlas
mongodump --uri "mongodb+srv://user:password@cluster0.mongodb.net/aircart_db" --out ./backup
```

#### Restore from Backup
```bash
# Restore to local MongoDB
mongorestore --uri "mongodb://localhost:27017/aircart_db" ./backup

# Restore to MongoDB Atlas
mongorestore --uri "mongodb+srv://user:password@cluster0.mongodb.net/aircart_db" ./backup
```

---

## 👨‍💼 Admin Permissions

### User Roles & Permissions

```sql
-- SQL to set admin role
UPDATE users SET role = 'admin' WHERE email = 'admin@aircart.com';
```

### Admin-Only Operations

```sql
-- View all users (admin only)
SELECT * FROM users;

-- View all orders (admin only)
SELECT * FROM orders;

-- View product details (admin only)
SELECT * FROM products;

-- View analytics (admin only)
SELECT COUNT(*) as total_users FROM users;
SELECT SUM(total_amount) as total_revenue FROM orders;
```

---

## 🔍 Useful Admin Queries

### User Management
```sql
-- Get all users
SELECT id, email, name, phone, role FROM users;

-- Get admin users
SELECT * FROM users WHERE role = 'admin';

-- Get user by email
SELECT * FROM users WHERE email = 'user@example.com';

-- Count total users
SELECT COUNT(*) as total_users FROM users;

-- Get users created in last 30 days
SELECT * FROM users WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';
```

### Product Management
```sql
-- Get all products
SELECT * FROM products ORDER BY created_at DESC;

-- Get products by category
SELECT * FROM products WHERE category = 'Electronics';

-- Get active products
SELECT * FROM products WHERE status = 'active';

-- Get out of stock products
SELECT * FROM products WHERE quantity = 0;

-- Get expensive products (> $500)
SELECT * FROM products WHERE price > 500;
```

### Order Analytics
```sql
-- Total revenue
SELECT SUM(total_amount) as total_revenue FROM orders;

-- Revenue by date
SELECT DATE(created_at), SUM(total_amount) as daily_revenue 
FROM orders 
GROUP BY DATE(created_at) 
ORDER BY DATE(created_at) DESC;

-- Order count by status
SELECT status, COUNT(*) as count 
FROM orders 
GROUP BY status;

-- Total orders
SELECT COUNT(*) as total_orders FROM orders;
```

---

## ⚠️ Security Best Practices

### Do's ✅
- [ ] Use strong passwords (16+ chars, mix of letters, numbers, symbols)
- [ ] Store credentials in environment variables
- [ ] Enable SSL/TLS for database connections
- [ ] Regularly backup database
- [ ] Use role-based access controls
- [ ] Audit admin actions regularly
- [ ] Keep database client software updated

### Don'ts ❌
- [ ] Don't hardcode passwords in code
- [ ] Don't commit .env files to git
- [ ] Don't expose database credentials in client code
- [ ] Don't use Simple passwords
- [ ] Don't grant unnecessary admin privileges
- [ ] Don't leave database ports exposed to public internet
- [ ] Don't skip security updates

---

## 🆘 Troubleshooting

### Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:5432

Solution:
1. Start PostgreSQL service
2. Verify host and port
3. Check if database exists
```

### Authentication Failed
```
Error: FATAL: password authentication failed

Solution:
1. Verify username and password
2. Check database user exists
3. Reset password if needed
```

### Database Not Found
```
Error: database "aircart_db" does not exist

Solution:
1. Create database first
2. Verify database name spelling
3. Check connection to correct server
```

### Port Already in Use
```
Error: listen EADDRINUSE :::5432

Solution:
1. Kill process using port
2. Use different port
3. Check if database already running
```

---

## 📚 Resources

### PostgreSQL
- Official Docs: https://www.postgresql.org/docs/
- pgAdmin: https://www.pgadmin.org/
- psql Cheatsheet: https://postgreSQL.org/docs/current/app-psql.html

### MongoDB
- Official Docs: https://docs.mongodb.com/
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- MongoDB Compass: https://www.mongodb.com/products/compass

### Tools
- VS Code PostgreSQL Extension: https://marketplace.visualstudio.com/items?itemName=ckolkman.vscode-postgres
- TablePlus: https://tableplus.com/ (Universal DB GUI)
- DBeaver: https://dbeaver.io/ (Universal DB GUI)

---

## 📞 Support

For issues or questions:
1. Check [Troubleshooting](#troubleshooting) section
2. Review database console logs
3. Check environment variables
4. Contact admin support

---

**Last Updated**: March 28, 2026  
**Version**: 1.0  
**Status**: Production Ready ✅
