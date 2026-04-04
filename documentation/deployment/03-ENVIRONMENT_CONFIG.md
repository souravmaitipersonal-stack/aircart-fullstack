# ⚙️ Environment Configuration Guide - Setup Variables & Configuration

**Purpose**: Configure application behavior for different environments  
**Files**: `.env`, `.env.local`, `.env.production`  
**Security**: Never commit `.env` files to Git

---

## Environment Files Overview

### File Hierarchy (by precedence)

```
.env.production.local  (Local machine production override)
     ↓
.env.production        (Production defaults)
     ↓
.env.local             (Local machine override)
     ↓
.env                   (Development defaults)
```

---

## Frontend Environment Variables

### Location

`apps/web/.env.local` (development)  
`apps/web/.env.production` (production)

### Configuration

#### Development (.env.local)

```env
# API Server
NEXT_PUBLIC_API_URL=http://localhost:5000

# Environment
NODE_ENV=development

# Debugging (optional)
NEXT_PUBLIC_DEBUG=true

# Analytics (optional)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_MIXPANEL_TOKEN=
```

#### Production (.env.production)

```env
# API Server (your production backend URL)
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Environment
NODE_ENV=production

# Debugging
NEXT_PUBLIC_DEBUG=false

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=your_token_here
```

### Frontend Variables Explained

| Variable | Required | Purpose | Example |
|----------|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API base URL | `http://localhost:5000` |
| `NODE_ENV` | ✅ | Environment mode | `development` or `production` |
| `NEXT_PUBLIC_DEBUG` | ❌ | Enable debug logging | `true` or `false` |
| `NEXT_PUBLIC_GA_ID` | ❌ | Google Analytics ID | `G-XXXXXXXXXX` |

**Note**: Prefix `NEXT_PUBLIC_` makes variables available in browser. Use for non-sensitive config only!

---

## Backend Environment Variables

### Location

`.env` (root of project, used by `packages/api/src/index.ts`)

### Configuration

#### Development (.env)

```env
# Server Configuration
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/aircart
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aircart
DB_USER=postgres
DB_PASSWORD=password

# Or MongoDB
# DATABASE_URL=mongodb://localhost:27017/aircart

# Authentication & Security
JWT_SECRET=dev-secret-key-change-in-production-minimum-32-characters
BCRYPT_ROUNDS=10
TOKEN_EXPIRY=24h

# External Services (optional for development)
PAYPAL_CLIENT_ID=
PAYPAL_SECRET=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# SMTP Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM_EMAIL=noreply@aircart.com

# Logging
LOG_LEVEL=debug
LOG_FORMAT=pretty

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ENABLED=true
CORS_ORIGIN=http://localhost:3000
```

#### Production (.env)

```env
# Server Configuration
NODE_ENV=production
PORT=5000
CLIENT_URL=https://yourdomain.com

# Database - RDS or Managed Service
DATABASE_URL=postgresql://aircart_user:STRONG_PASSWORD@your-db-host.rds.amazonaws.com:5432/aircart_production
DB_HOST=your-db-host.rds.amazonaws.com
DB_PORT=5432
DB_NAME=aircart_production
DB_USER=aircart_user
DB_PASSWORD=STRONG_PASSWORD_HERE_MIN_16_CHARS

# Authentication & Security
JWT_SECRET=VERY_LONG_RANDOM_SECRET_KEY_MINIMUM_32_CHARACTERS_USE_OPENSSL_RAND
BCRYPT_ROUNDS=12
TOKEN_EXPIRY=24h

# Payment Processing - Real accounts
PAYPAL_CLIENT_ID=your_prod_paypal_client_id
PAYPAL_SECRET=your_prod_paypal_secret
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email Service
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.your_sendgrid_api_key
SMTP_FROM_EMAIL=noreply@yourdomain.com

# Logging
LOG_LEVEL=info
LOG_FORMAT=json

# Rate Limiting (stricter in production)
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ENABLED=true
CORS_ORIGIN=https://yourdomain.com
```

### Backend Variables Explained

#### Server Configuration

| Variable | Required | Purpose | Default |
|----------|----------|---------|---------|
| `NODE_ENV` | ✅ | Environment mode | - |
| `PORT` | ✅ | Server listen port | 5000 |
| `CLIENT_URL` | ✅ | Frontend URL (CORS) | - |

#### Database

| Variable | Required | Purpose | Format |
|----------|----------|---------|--------|
| `DATABASE_URL` | ✅ | Connection string | `postgresql://user:pass@host:port/db` |
| `DB_HOST` | ✅ | Database hostname | `localhost` or domain |
| `DB_PORT` | ✅ | Database port | `5432` (PostgreSQL) |
| `DB_NAME` | ✅ | Database name | `aircart` |
| `DB_USER` | ✅ | Database username | - |
| `DB_PASSWORD` | ✅ | Database password | - |

#### Authentication

| Variable | Required | Purpose | Example |
|----------|----------|---------|---------|
| `JWT_SECRET` | ✅ | JWT signing key | Min 32 random chars |
| `BCRYPT_ROUNDS` | ❌ | Password hashing rounds | `10` (dev), `12` (prod) |
| `TOKEN_EXPIRY` | ❌ | JWT expiration time | `24h`, `7d`, `30d` |

#### Payment Processing

| Variable | Required | Purpose | Scope |
|----------|----------|---------|-------|
| `PAYPAL_CLIENT_ID` | ❌ | PayPal credentials | Sandbox or Live |
| `PAYPAL_SECRET` | ❌ | PayPal secret key | - |
| `STRIPE_SECRET_KEY` | ❌ | Stripe secret API key | Test or Live |
| `STRIPE_WEBHOOK_SECRET` | ❌ | Webhook signing key | For payment events |

#### Email Service

| Variable | Required | Purpose | Provider |
|----------|----------|---------|----------|
| `SMTP_HOST` | ❌ | Email server | `smtp.gmail.com`, `smtp.sendgrid.net` |
| `SMTP_PORT` | ❌ | Email server port | `587` (TLS) or `465` (SSL) |
| `SMTP_USER` | ❌ | Email username | - |
| `SMTP_PASSWORD` | ❌ | Email password or API key | - |
| `SMTP_FROM_EMAIL` | ❌ | Sender email address | `noreply@yourdomain.com` |

#### Logging

| Variable | Purpose | Options |
|----------|---------|---------|
| `LOG_LEVEL` | Minimum log severity | `debug`, `info`, `warn`, `error` |
| `LOG_FORMAT` | Log output format | `pretty`, `json` |

#### Rate Limiting

| Variable | Purpose | Example |
|----------|---------|---------|
| `RATE_LIMIT_WINDOW` | Time window in milliseconds | `900000` (15 minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests in window | `100` |

#### CORS

| Variable | Purpose | Example |
|----------|---------|---------|
| `CORS_ENABLED` | Enable/disable CORS | `true` |
| `CORS_ORIGIN` | Allowed frontend URL | `http://localhost:3000` |

---

## Generating Secure Values

### JWT_SECRET Generation

**Windows PowerShell**:
```powershell
# Generate 32-character random hex string
-join ((0..31) | ForEach-Object { '{0:x}' -f (Get-Random -Max 16) })
```

**Linux/Mac**:
```bash
# Generate 32-byte random string
openssl rand -hex 32
```

**Python**:
```python
import secrets
secrets.token_hex(32)  # Output: 64-character hex string
```

**Online**: Use https://www.random.org/strings/ to generate random string

### BCRYPT_ROUNDS Calculator

```
Time to hash = 2^rounds * ~12ms

Rounds  Time
10      12ms   (default development)
12      48ms   (recommended production)
14      190ms  (demanding production workload)
```

For most applications, use:
- Development: `10`
- Production: `12`

---

## Docker Environment Configuration

### Docker Compose (.env.docker)

```env
# API Service
API_PORT=5000
NODE_ENV=development

# PostgreSQL
POSTGRES_DB=aircart
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password

# MongoDB
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=password

# Application
JWT_SECRET=dev-secret-key-min-32-chars
DATABASE_URL=postgresql://postgres:password@postgres:5432/aircart
CLIENT_URL=http://localhost:3000
```

Load with:
```bash
docker-compose --env-file .env.docker up -d
```

---

## Platform-Specific Configurations

### Vercel (Frontend)

**Set via Vercel Dashboard**:

1. Go to Project Settings → Environment Variables
2. Add `NEXT_PUBLIC_API_URL`
3. Set for `Production`:
   ```
   NEXT_PUBLIC_API_URL = https://api.yourdomain.com
   ```

### Railway (Backend)

**Set via Railway Dashboard**:

1. Go to Variables → Variables
2. Add all backend environment variables
3. Railway provides `DATABASE_URL` automatically for linked PostgreSQL

### AWS RDS (Database)

Copy `DATABASE_URL` format:
```
postgresql://username:password@your-instance.c9akciq32.us-east-1.rds.amazonaws.com:5432/aircart_prod
```

### AWS Secrets Manager (Sensitive Values)

```bash
# Store JWT_SECRET securely
aws secretsmanager create-secret \
  --name aircart/jwt-secret \
  --secret-string "your-secret-value"

# Retrieve in application
aws secretsmanager get-secret-value --secret-id aircart/jwt-secret
```

---

## Environment-Specific Behavior

### Development
- Debug logging enabled
- CORS allows localhost
- Relaxed rate limiting
- In-memory database (or local PostgreSQL)
- Hot reload enabled

### Staging
- Same as production, but separate database
- Staging payment credentials (PayPal/Stripe sandbox)
- Test data pre-loaded
- External monitoring enabled

### Production
- Minimal logging (info/error only)
- CORS restricted to production domain
- Strict rate limiting
- Cloud managed database
- All payment credentials live
- Monitoring & alerts active

---

## Configuration in Code

### How to Use Environment Variables

#### Frontend (Next.js)

```typescript
// In any component or SSR context
const apiUrl = process.env.NEXT_PUBLIC_API_URL

// Must be accessible at build time for production
if (!apiUrl) {
  throw new Error('NEXT_PUBLIC_API_URL is not configured')
}
```

#### Backend (Express)

```typescript
// In api/src/index.ts
import dotenv from 'dotenv'

dotenv.config()  // Load .env file

const port = process.env.PORT || 5000
const jwtSecret = process.env.JWT_SECRET

if (!jwtSecret) {
  throw new Error('JWT_SECRET must be configured')
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
```

---

## Validation & Error Handling

### Type-Safe Environment Variables

Create `config/env.ts`:

```typescript
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']),
  PORT: z.coerce.number().default(5000),
  JWT_SECRET: z.string().min(32),
  DATABASE_URL: z.string().url(),
  BCRYPT_ROUNDS: z.coerce.number().default(10),
  CLIENT_URL: z.string().url().default('http://localhost:3000'),
})

export const env = envSchema.parse(process.env)
```

Usage:
```typescript
import { env } from './config/env'

const jwtSecret = env.JWT_SECRET  // Type safe, throws if missing
```

---

## Common Configuration Mistakes

### ❌ Wrong

```env
# .env (committed to Git)
JWT_SECRET=hardcoded-secret
DATABASE_PASSWORD=actual-password
STRIPE_SECRET=sk_live_xxxxx
```

### ✅ Correct

```bash
# .env (template, safe to commit)
JWT_SECRET=CHANGE_ME_IN_PRODUCTION
DATABASE_PASSWORD=CHANGE_ME
STRIPE_SECRET=

# .env.local (NOT committed, in .gitignore)
JWT_SECRET=actual-long-random-secret
DATABASE_PASSWORD=actual-strong-password
STRIPE_SECRET=sk_live_xxxxx
```

### .gitignore

```
# Environment files
.env
.env.local
.env.*.local
.env.production.local

# Node
node_modules/
npm-debug.log*

# Build
dist/
build/
.next/
```

---

## Testing Configuration Changes

### Verify Environment

```bash
# Backend - Check loaded config
npm run test:env

# Frontend - Check config
npx next info

# Docker - Check in container
docker-compose exec api env | grep NODE_ENV
```

### Test Database Connection

```bash
# PostgreSQL
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT 1"

# MongoDB
mongosh "mongodb://$MONGO_USER:$MONGO_PASSWORD@$MONGO_HOST:27017"
```

---

## Environment Files Checklist

### Before Development

- [ ] `.env` file exists with development values
- [ ] `DATABASE_URL` connection works
- [ ] `JWT_SECRET` set (can be development value)
- [ ] `CLIENT_URL` = http://localhost:3000
- [ ] `NEXT_PUBLIC_API_URL` = http://localhost:5000

### Before Staging Push

- [ ] Create `.env.staging`
- [ ] All required variables filled
- [ ] Payment credentials set to sandbox
- [ ] Database points to staging database
- [ ] Email uses staging email service

### Before Production Deployment

- [ ] `.env.production` created (never commit!)
- [ ] `JWT_SECRET` is strong random string (32+ chars)
- [ ] `BCRYPT_ROUNDS` ≥ 12
- [ ] Database URL points to production RDS
- [ ] Contact payment providers (PayPal, Stripe) for live credentials
- [ ] CORS configured for production domain only
- [ ] `CLIENT_URL` = https://yourdomain.com
- [ ] `NEXT_PUBLIC_API_URL` = https://api.yourdomain.com
- [ ] Email service configured (SendGrid, AWS SES)
- [ ] All URLs use HTTPS

---

## Quick Reference

### Change Database Connection

```env
# PostgreSQL (current)
DATABASE_URL=postgresql://user:pass@localhost:5432/aircart

# MongoDB
DATABASE_URL=mongodb://localhost:27017/aircart

# AWS RDS PostgreSQL
DATABASE_URL=postgresql://user:pass@instance.rds.amazonaws.com:5432/aircart_prod
```

### Change Backend URL (Frontend)

**Vercel Dashboard**:
```
NEXT_PUBLIC_API_URL = https://api.yourdomain.com
```

**Local Development**:
Edit `apps/web/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Enable Debug Logging

Add to `.env`:
```env
LOG_LEVEL=debug
NEXT_PUBLIC_DEBUG=true
```

---

**Last Updated**: March 28, 2026  
**Version**: 4.0  
**Status**: Complete

