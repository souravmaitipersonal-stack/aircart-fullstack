# AirCart Production Deployment Guide

**Status**: 🚀 PHASE 4-5 COMPLETE - READY FOR PRODUCTION

**Last Updated**: March 14, 2026  
**Estimated Deployment Time**: 30-45 minutes

---

## 📋 Pre-Deployment Checklist

- [ ] Backend dependencies installed and built
- [ ] Frontend built successfully
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Email service configured
- [ ] PayPal production credentials ready
- [ ] SSL certificates ready
- [ ] Domain name configured

---

## 🚀 Deployment Architecture

```
┌──────────────────────────────────────┐
│         CDN (CloudFlare)             │
└──────────────────────────────────────┘
              ↓         ↓
┌──────────────────┐  ┌──────────────────┐
│  Frontend        │  │  Backend         │
│  (Vercel)        │  │  (Railway)       │
│  Next.js 15      │  │  Express 5       │
│  $0/month*       │  │  $5-50/month     │
└──────────────────┘  └──────────────────┘
         ↓                      ↓
    Static Site            API Server
```

---

## 📦 Database Setup

### PostgreSQL (Recommended)

**Option 1: Railway PostgreSQL**
```
Plan: Starter
Price: $5/month (with included credits)
Storage: 10 GB
```

**Option 2: AWS RDS**
```
Plan: t3.micro (Free Tier eligible)
Storage: 20 GB
Backup: Automatic
```

**Option 3: Heroku Postgres**
```
Plan: Standard
Price: $9/month
Backup: Automatic
```

### MongoDB (Alternative)

**Option 1: MongoDB Atlas**
```
Plan: Free
Storage: 512 MB
Regions: Global
```

---

## 🌐 Frontend Deployment (Vercel)

### Step 1: Connect GitHub Repository

1. Go to https://vercel.com
2. Sign up with GitHub account
3. Click "Add New" → "Project"
4. Select `aircart-fullstack` repository
5. Configure project:
   - **Root Directory**: `apps/web`
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### Step 2: Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.aircart.com
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

### Step 3: Deploy

Click "Deploy" button. Vercel will:
- Install dependencies
- Build Next.js app
- Optimize assets
- Deploy to CDN
- Configure SSL certificate
- Generate production URL

**Expected Result**:
- Deployment Time: 2-5 minutes
- URL: `https://aircart-fullstack.vercel.app`
- Auto-scaling: Enabled
- Analytics: Included

---

## 🛢️ Backend Deployment (Railway)

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub
3. Create new project
4. Select "Deploy from GitHub"

### Step 2: Connect Backend Repository

1. Select `aircart-fullstack` repository
2. Configure:
   - **Root Director**: `packages/api`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Port**: `5000`

### Step 3: Add PostgreSQL Database

1. Click "Add Service"
2. Select "PostgreSQL"
3. Choose plan (Starter recommended)
4. Railway will auto-generate `DATABASE_URL`

### Step 4: Environment Variables

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:pass@host:5432/db
DATABASE_PROVIDER=postgresql

JWT_SECRET=your_secure_jwt_secret_here_32_chars_min
JWT_EXPIRY=7d

PAYPAL_MODE=live
PAYPAL_CLIENT_ID=your_live_paypal_client_id
PAYPAL_CLIENT_SECRET=your_live_paypal_client_secret

EMAIL_FROM=noreply@aircart.com
SENDGRID_API_KEY=your_sendgrid_api_key

CLIENT_URL=https://aircart-fullstack.vercel.app
```

### Step 5: Deploy

Railway auto-deploys on Git push. Once deployed:
- URL: `https://api-aircart-production.railway.app`
- Auto-scaling: Enabled
- SSL: Included

---

## 🔗 Domain & DNS Configuration

### Option 1: Using Vercel Domains (Recommended)

```
1. Purchase domain through Vercel: $12-14/year
2. Configure in Vercel project settings
3. Auto-configured DNS
4. Auto-renews
```

### Option 2: External Domain (Namecheap, GoDaddy)

**Frontend Setup**:
1. Buy domain: aircart.com
2. Point to Vercel:
   - CNAME: `cname.vercel-dns.com`
3. Configure in Vercel

**Backend Setup**:
1. Create subdomain: `api.aircart.com`
2. Point to Railway:
   - CNAME: `api-aircart-production-railway.app`
3. Configure in Railway

**DNS Records**:
```
Type    Name      Value
CNAME   www       cname.vercel-dns.com
CNAME   api       api-aircart-production.railway.app
A       @         76.76.19.0
TXT     @         v=spf1 include:sendgrid.net ~all
```

---

## 🔐 Security Setup

### SSL Certificates

✅ Vercel: **Free, Auto-Renewing**  
✅ Railway: **Free, Auto-Renewing**

### Environment Variables

1. **Never commit secrets to Git**
2. **Use `.env.local` (gitignored)**
3. **Configure in each platform's dashboard**

### API Security

```typescript
// CORS Configuration
const allowedOrigins = [
  'https://aircart.com',
  'https://www.aircart.com',
];

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // requests per window
});

// Helmet for security headers
app.use(helmet());
```

---

## 💳 Payment Configuration

### PayPal Production Setup

1. **Upgrade to Business Account**:
   - Go to https://developer.paypal.com
   - Switch to "Live" mode
   - Generate Live API credentials

2. **Configure in Railway**:
   ```env
   PAYPAL_MODE=live
   PAYPAL_CLIENT_ID=live_client_id
   PAYPAL_CLIENT_SECRET=live_client_secret
   ```

3. **Update Webhook URL**:
   - Go to PayPal Dashboard
   - Add Webhook URL: `https://api.aircart.com/api/webhooks/paypal`
   - Subscribe to events: PAYMENT.CAPTURE.COMPLETED

### Stripe (Optional)

```env
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 📧 Email Service Setup

### SendGrid (Recommended)

```
1. Sign up: https://sendgrid.com
2. Create API key
3. Verify sender email
4. Add to Railway:
   SENDGRID_API_KEY=SG.xxxxx
```

### NodeMailer (SMTP)

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=app_password
```

---

## 🗄️ Database Migration

### Running Migrations on Production

```bash
# Connect to Railway PostgreSQL
psql postgresql://user:pass@container.railway.app:5432/railway

# Run migrations
npm run migrate:prod
```

### Sample Migration (First Time)

```sql
-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INT DEFAULT 0,
  category VARCHAR(100),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  order_number VARCHAR(50) UNIQUE,
  status VARCHAR(50),
  total DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_user_id ON orders(user_id);
```

---

## 👀 Monitoring & Analytics

### Vercel Analytics

- Real-time deployment logs
- Performance metrics (Core Web Vitals)
- Error tracking
- Bandwidth usage

### Railway Dashboard

- CPU & Memory usage
- Database performance
- Error logs
- API metrics

### Third-Party Tools

```
Service          Purpose         Free Plan
─────────────────────────────────────────
Sentry.io        Error Tracking  ✅ Yes
LogRocket        Session Replay  ✅ Yes (1000/mo)
New Relic        APM             ✅ Yes
Datadog          Monitoring      ✅ Yes (Free Tier)
```

---

## 🧪 Pre-Production Testing

### 1. Connected Testing

```bash
# Test frontend connects to backend
curl https://api.aircart.com/api/health

# Test PayPal webhook
curl -X POST https://api.aircart.com/api/webhooks/test \
  -H "Content-Type: application/json" \
  -d '{"event_type":"TEST","event_time":"2026-03-14T00:00:00Z"}'
```

### 2. End-to-End Flow

- [ ] User registration on production
- [ ] Product browsing works
- [ ] Cart functionality works
- [ ] Checkout flow works
- [ ] PayPal payment processes
- [ ] Order confirmation email sends
- [ ] Order appears in admin dashboard

### 3. Performance Testing

```bash
# Load testing
npx artillery quick --count 100 --num 10 https://aircart.com

# Lighthouse audit
npx lighthouse https://aircart.com --view
```

---

## 📊 Cost Estimation

| Service | Component | Plan | Cost/Month |
|---------|-----------|------|-----------|
| Vercel | Frontend | Hobby | $0 |
| Railway | Backend | Starter | $5 |
| Railway | PostgreSQL | Basic | $5 |
| SendGrid | Email | Free | $0 |
| PayPal | Payments | Live | 2.9%+$0.30/tx |
| Domain | DNS | Starter | $12/year |
| CDN | CloudFlare | Free | $0 |
| **Total** | **All** | **Basic** | **~$10/mo** |

---

## 🔄 CI/CD Pipeline

### GitHub Actions Setup

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 20
      - run: npm ci
      - run: npm run test
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## ⚠️ Post-Deployment Checklist

- [ ] Frontend accessible at production URL
- [ ] Backend API responding with 200 status
- [ ] Database connected and migrated
- [ ] SSL certificates valid
- [ ] Email service sending confirmations
- [ ] PayPal webhooks configured
- [ ] Admin dashboard accessible
- [ ] Analytics tracking working
- [ ] CDN cache configured
- [ ] Monitoring & alerts set up
- [ ] Backups configured
- [ ] Error logging enabled

---

## 🆘 Troubleshooting

### Frontend Won't Deploy

```
Error: Build failed
Solution:
1. Check Node version: node --version (should be 18+)
2. Clear cache: npm cache clean --force
3. Reinstall: npm ci
4. Check logs: vercel logs --follow
```

### Backend Connection Issues

```
Error: Cannot connect to database
Solution:
1. Check DATABASE_URL in Railway env vars
2. Verify database is running: psql connection test
3. Check firewall/network rules
4. Review Railway logs
```

### PayPal Not Working

```
Error: PayPal API returns 403
Solution:
1. Verify PAYPAL_CLIENT_ID in production
2. Check PAYPAL_MODE=live vs sandbox
3. Confirm webhook URL registered
4. Check IP whitelist if applicable
```

---

## 📝 Rollback Plan

If deployment fails:

```bash
# Revert to previous version in Vercel
1. Dashboard → Deployments
2. Click on previous successful deployment
3. Click "Redeploy"

# Revert Railway deployment
1. Railway Dashboard → Deployments
2. Select previous deployment
3. Click "Redeploy"
```

---

## 🎓 Production Maintenance

### Weekly Tasks

- [ ] Check monitoring dashboards
- [ ] Review error logs
- [ ] Verify backups completed
- [ ] Check status page

### Monthly Tasks

- [ ] Review analytics reports
- [ ] Update dependencies
- [ ] Security patch review
- [ ] Database optimization

### Quarterly Tasks

- [ ] Full security audit
- [ ] Performance optimization
- [ ] Capacity planning
- [ ] Cost review

---

## 📞 Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Express Deployment**: https://expressjs.com/en/advanced/best-practice-performance.html
- **Next.js Production**: https://nextjs.org/docs/going-to-production
- **PayPal Developer**: https://developer.paypal.com

---

**Status**: ✅ READY FOR PRODUCTION DEPLOYMENT

**Next Steps**:
1. Set up Vercel account
2. Set up Railway account
3. Configure environment variables
4. Run production tests
5. Deploy! 🚀
