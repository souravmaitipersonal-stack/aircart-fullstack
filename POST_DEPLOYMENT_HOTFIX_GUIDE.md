# 🔧 POST-DEPLOYMENT HOTFIX & LIVE UPDATE GUIDE

**Status**: Production Ready  
**Created**: March 14, 2026  
**Purpose**: How to fix bugs, update content, and deploy changes after going live

---

## 📋 Quick Reference

| Scenario | Time | Method |
|----------|------|--------|
| Fix critical bug | 5-10 min | Git commit → Auto-deploy |
| Update product prices | 1-2 min | Admin dashboard |
| Change email template | 10-15 min | Code update → Deploy |
| Update env variables | Immediate | Vercel/Railway settings |
| Database fix | 5-10 min | SQL query + Schema migration |
| Hot-reload (no rebuild) | 1-2 min | Environment variables |

---

## 🚨 CRITICAL BUG FIX (5 minutes)

### Scenario: Payment processing broken, orders failing

**Step 1: Assess the damage**
```bash
# SSH into Railway
railway run bash

# Check logs
journalctl -u aircart-api -n 50

# Or via Railway dashboard
# Settings → Logs → View real-time logs
```

**Step 2: Locate the bug**
```bash
cd /workspace
# Grep for error pattern
grep -r "PAYMENT_FAILED" packages/api/src/

# Check recent changes
git log --oneline -10
```

**Step 3: Fix locally**
```bash
# Create fix branch
git checkout -b fix/payment-critical

# Edit the file
# packages/api/src/services/payment.service.ts
# Fix the bug (test locally first)

npm run test

# Verify fix
npm run dev # Test manually
```

**Step 4: Deploy fix**
```bash
# Commit with clear message
git commit -m "fix: payment processing error in PayPal callback handler"
git push origin fix/payment-critical

# Create PR
# GitHub → Create Pull Request
# Title: "URGENT: Fix payment processing bug"
# Description: Detail the issue and fix

# OR push directly to main (if you trust the fix)
git checkout main
git merge fix/payment-critical
git push origin main
```

**Step 5: Monitor deployment**
```
GitHub Actions runs:
┌─ Lint check      ✅ 1 min
├─ Unit tests      ✅ 2 min
├─ Build           ✅ 3 min
└─ Deploy to Railway ✅ 3 min
─────────────────────────
Total: ~9 minutes to live

Check status:
- GitHub: Actions tab
- Railway: Dashboard Deployments
- Live: curl https://api.aircart.railway.app/api/health
```

**Step 6: Verify fix**
```bash
# Test fix manually
curl -X POST https://api.aircart.railway.app/api/orders \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"items": [...]}'

# Monitor live logs
# Railway Dashboard → Logs tab
```

---

## 🎨 UPDATE CONTENT (Without Code Changes)

### 1. Update Product Prices/Info

**Home page** → **Admin Dashboard** → **Products Management**

```
1. Login as admin (admin@aircart.com / Admin@123456)
2. Go to /admin/products
3. Click "Edit" on product
4. Change price, stock, description
5. Click "Update Product"
6. ✅ Live immediately (no rebuild)
```

**No deployment needed!** Changes reflect instantly via API.

### 2. Update Order Status

**Admin Dashboard** → **Orders Management** → **Status Dropdown**

```
1. Go to /admin/orders
2. Find order
3. Change status (pending → processing → shipped)
4. ✅ Customer sees update instantly
5. Email notification sent automatically
```

### 3. Add Featured Products

```
1. /admin/products
2. Click "Edit" on product
3. Check "Featured Product" checkbox
4. Click "Update"
5. Product appears on home page featured section
```

---

## 💌 UPDATE EMAIL TEMPLATES (Code Change Required)

### Edit Email Template

**File**: `packages/api/src/services/email.service.ts`

```typescript
private async sendOrderConfirmation(order: Order, user: User) {
  const subject = 'Order Confirmation #' + order.orderNumber;
  
  const htmlContent = `
    <html>
      <body>
        <h1>Thank you for your order!</h1>
        <!-- EDIT THIS HTML -->
        <p>Your order #${order.orderNumber} has been confirmed.</p>
        <p>Estimated delivery: 5-7 business days</p>
        <!-- END EDIT -->
      </body>
    </html>
  `;
  
  // Send email...
}
```

**Steps to deploy**:
```bash
# 1. Edit the template HTML
vim packages/api/src/services/email.service.ts

# 2. Test (send test email to yourself)
# Use admin dashboard or API call

# 3. Commit and push
git commit -m "style: update order confirmation email template"
git push origin main

# 4. Automatic deployment (5 min)
# Railway auto-deploys, email uses new template
```

---

## 🔐 ENVIRONMENT VARIABLE UPDATES (Instant)

### Change Without Redeploy

**Example**: Update PayPal sandbox to production credentials

**Method 1: Vercel** (Frontend)
```
1. vercel.com → Project Settings → Environment Variables
2. Edit or add:
   NEXT_PUBLIC_API_URL=https://api.aircart.railway.app
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=new-production-id
3. Click "Save"
4. Redeployment happens automatically (2 min)
```

**Method 2: Railway** (Backend)
```
1. railway.app → Project → Settings → Variables
2. Edit:
   PAYPAL_CLIENT_ID=new-production-id
   PAYPAL_CLIENT_SECRET=new-secret
3. Click "Save"
4. Auto-redeployment (3 min) OR restart service
```

**Method 3: GitHub Secrets** (For CI/CD)
```
1. GitHub → Repository Settings → Secrets and Variables → Actions
2. Edit secrets:
   DATABASE_URL=new-connection-string
   JWT_SECRET=new-secret
3. Next deployment will use new secrets
```

---

## 🗄️ DATABASE FIXES (Direct Query)

### Quick Data Fixes

**Scenario**: Need to fix a corrupted order, update customer email, etc.

**Option 1: Railway PostgreSQL Proxy**
```bash
# Via Railway CLI
railway run psql

# Or via Railway dashboard
# Data → PostgreSQL → Connect → Query

# Example queries:
UPDATE orders SET status = 'shipped' WHERE id = 'order-123';
UPDATE users SET email = 'newemail@example.com' WHERE id = 'user-456';
DELETE FROM cart_items WHERE user_id = 'user-to-clear';
```

**Option 2: Application API**
```bash
# For admin-level fixes, create an admin endpoint
POST /api/admin/bulk-fix
{
  "action": "update-order-status",
  "orderId": "order-123",
  "newStatus": "shipped"
}
```

**Option 3: Direct Connection**
```bash
# Connect via pgAdmin or database client
Host: db.railway.internal
Port: 5432
Database: aircart
User: postgres
Password: [from Railway env vars]
```

---

## 🔄 SCHEMA MIGRATION (If Needed)

### Add New Database Column

**Example**: Add "priority_badge" to products table

**Step 1: Create migration script** (`packages/api/migrations/001-add-priority.sql`)
```sql
-- Migration: Add priority badge to products
-- Date: March 14, 2026

ALTER TABLE products
ADD COLUMN priority_badge VARCHAR(50) DEFAULT NULL;

-- Create index for performance
CREATE INDEX idx_products_priority ON products(priority_badge);

-- Verify
SELECT * FROM products LIMIT 1;
```

**Step 2: Test locally**
```bash
# Apply migration to local DB
psql -U aircart aircart < packages/api/migrations/001-add-priority.sql

# Test app works
npm run dev
```

**Step 3: Run on production**
```bash
# Via Railway SSH
railway run bash

# Apply migration
railway run psql < ./migrations/001-add-priority.sql

# Verify
railway run psql -c "SELECT * FROM products LIMIT 1;"
```

**Step 4: Update application code**
```typescript
// Update Product model to include new field
interface Product {
  // ... existing fields
  priorityBadge?: string;  // NEW
}

// Use in API
GET /api/products/:id
// Response now includes priorityBadge
```

---

## 🐛 BUG SEVERITY & RESPONSE TIME

### P1 - Critical (5 min response)
- Payments broken
- User account locked
- Data loss occurring
- Site down

**Emergency fix**:
```bash
git checkout main
# Quick fix
git commit -m "hotfix: critical issue"
git push origin main
# Deploy & monitor
```

### P2 - High (30 min response)
- Feature not working
- Performance degraded
- Security vulnerability
- Part of user flow broken

**Standard fix**:
```bash
git checkout -b fix/issue-name
# Fix thoroughly
npm run test
git push & create PR
# Code review (or skip for security)
# Deploy
```

### P3 - Medium (next business day)
- Minor UI bugs
- Non-critical features
- Error message improvements
- Nice-to-have fixes

**Batch with other changes**:
```bash
# Include in next release
git checkout -b feature/batch-improvements
# Multiple fixes
# Code review + testing
# Deploy with release notes
```

### P4 - Low (next release)
- Polish improvements
- Documentation updates
- Code refactoring
- Nice-to-have enhancements

**Schedule for next cycle**:
```bash
# Add to backlog
# Plan for next release sprint
# Low priority in PR review
```

---

## 📊 MONITORING & ALERTING

### Real-Time Log Monitoring

**Railway Logs**:
```
1. railway.app → Project → Logs
2. Live stream of all server logs
3. Search: "ERROR", "PAYMENT", "WEBHOOK"
4. Filter by time range
```

**Application Logs**:
```typescript
// Already implemented with logInfo, logError, logSuccess
import { logError, logInfo, logSuccess } from './config/logger';

logError('Payment failed', error);
logInfo('Processing webhook from PayPal');
logSuccess('Order created successfully')
```

**GitHub Actions Logs**:
```
1. GitHub → Actions tab
2. Click workflow run
3. See each step output:
   - Lint output
   - Test failures
   - Build errors
   - Deploy logs
```

### Set Up Alerts (Optional)

**Vercel**:
- Settings → Integrations → Slack
- Get notified of deployments

**Railway**:
- Settings → Alerts
- Email for failed deployments
- Uptime monitoring

---

## ✅ DEPLOYMENT CHECKLIST

Before pushing to production:

```typescript
☐ Code compiles (npm run build)
☐ Tests pass (npm run test)
☐ Lint passes (npm run lint)
☐ Tested locally (npm run dev)
☐ Code reviewed (if team)
☐ No hardcoded secrets
☐ Environment variables set
☐ Database migrations ready
☐ Rollback plan in mind
☐ Monitoring set up
☐ Team notified
```

---

## 🔙 ROLLBACK PLAN (If Things Go Wrong)

### Quick Rollback to Previous Version

**Via Railway**:
```
1. railway.app → Deployments
2. Find previous successful deployment
3. Click "Redeploy"
4. App rolls back to previous version (2 min)
```

**Via GitHub**:
```bash
# Revert last commit
git revert HEAD
git push origin main

# GitHub Actions redeploys with reverted code
```

**Manual Railway Rollback**:
```bash
# Via Railway CLI
railway deploy --from-commit abc123def456

# Where abc123def456 is commit hash of good version
```

---

## 📝 POST-DEPLOYMENT VERIFICATION

After every deployment:

```bash
# 1. Health Check
curl https://api.aircart.railway.app/api/health
# Should return 200 with "status": "success"

# 2. Test Key Endpoints
curl https://api.aircart.railway.app/api/products
# Should return product list

curl https://api.aircart.railway.app/api/auth/me \
  -H "Authorization: Bearer {test_token}"
# Should return user info

# 3. Monitor Dashboard
# Vercel: Analytics → Response time, Errors
# Railway: Logs → Check for "ERROR" entries
# Custom: Check your monitoring tools

# 4. Test User Flow
# Visit https://aircart.vercel.app
# Login → Browse products → Add to cart → Checkout
# Verify everything works end-to-end

# 5. Check Payments
# If PayPal changes: Test with sandbox account
# Verify webhook receives events
# Check email notifications sent

# 6. Review Logs
# Railway → Logs → Search for errors
# GitHub Actions → Check deployment step outputs
# Check for any warnings or issues
```

---

## 🎯 COMMON FIXES & SOLUTIONS

### Payment Webhook Not Firing

**Symptoms**: Orders created but status not updating

**Fix**:
```bash
# 1. Verify webhook URL is correct in PayPal dashboard
# PayPal Merchant Account → Settings → Webhooks
# URL should be: https://api.aircart.railway.app/api/webhooks/paypal

# 2. Test webhook manually
curl -X POST https://api.aircart.railway.app/api/webhooks/test \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# 3. Check logs
# railway run → grep "webhook" logs

# 4. Redeploy if webhook handler changed
git push origin main
```

### Emails Not Sending

**Symptoms**: Orders created but no confirmation email

**Fix**:
```bash
# 1. Check SendGrid key
# Railway → Variables → SENDGRID_API_KEY exists?

# 2. Verify API key is correct
# sendgrid.com → Settings → API Keys

# 3. Check email logs
# SendGrid Dashboard → Activity Feed

# 4. Test email service
# Create test endpoint and call it
POST /api/test/email
{
  "to": "your-email@example.com",
  "type": "welcome"
}

# 5. If still broken, fallback to NodeMailer
# Update .env: EMAIL_PROVIDER=nodemailer
# Configure SMTP credentials
```

### Database Connection Timeout

**Symptoms**: 500 errors, connection pool exhausted

**Fix**:
```bash
# 1. Increase pool size in Railway
# Railway → PostgreSQL → Resources → Increase

# 2. Restart database service
# Railway → Red button (restart service)

# 3. Check connection string format
# Should be PostgreSQL format: postgresql://user:pass@host:port/db

# 4. Verify network connectivity
railway run psql -c "SELECT 1;"
```

### Memory Leak / High CPU

**Symptoms**: App gets slow, then crashes

**Fix**:
```bash
# 1. Check what changed recently
git log --oneline -5

# 2. Look for infinite loops or missing closes
# grep -r "while(true)" src/
# grep for event handlers not being removed

# 3. Monitor memory before rollback
# Railway → Metrics → Memory usage

# 4. If critical, rollback immediately
railway deploy --from-commit {previous_commit}

# 5. Root cause analysis
# Profile the app locally
# Fix memory leak
# Redeploy
```

---

## 📚 USEFUL COMMANDS

```bash
# View recent deployments
git log --oneline -20

# Check what's diff from main
git diff main origin/main

# See current environment
echo $DATABASE_URL
echo $PAYPAL_CLIENT_ID

# Test connection to database
psql $DATABASE_URL -c "SELECT version();"

# Monitor app locally with logs
npm run dev 2>&1 | grep -i "error\|warn"

# Rebuild specific package
npm run build -- --filter=api

# Force redeployment
git commit --allow-empty -m "ci: force redeploy"
git push origin main
```

---

## 🎓 BEST PRACTICES

1. **Test changes locally first**
   ```bash
   npm run test
   npm run dev # Verify manually
   ```

2. **Use feature flags for risky changes**
   ```typescript
   if (process.env.ENABLE_NEW_FEATURE === 'true') {
     // New code
   }
   ```

3. **Monitor after every deployment**
   - Check logs
   - Test critical flows
   - Monitor error rate

4. **Have rollback ready**
   - Know previous stable commit
   - Test rollback procedure beforehand
   - Document it

5. **Communicate with team**
   - Tell team before major changes
   - Post in Slack when deploying
   - Share deploy notes

6. **Batch small changes**
   - Don't deploy every tiny fix
   - Group related changes
   - Deploy once per day if possible

7. **Write clear commit messages**
   ```
   ✅ Good: "fix: prevent race condition in payment webhook handler"
   ❌ Bad: "fixed stuff"
   ```

---

## 📞 EMERGENCY CONTACTS

- **Railway Support**: railway.app → Help → Support Chat
- **Vercel Support**: vercel.com → Support
- **PayPal Developer**: developer.paypal.com → Help
- **SendGrid Support**: sendgrid.com → Help

---

**Remember**: Think before you deploy. Test locally first. Monitor after deployment. Have a rollback plan.

**Happy deploying! 🚀**
