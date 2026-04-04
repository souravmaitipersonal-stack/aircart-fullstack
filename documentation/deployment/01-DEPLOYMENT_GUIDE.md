# 🚀 Deployment Guide - Production Deployment Instructions

**Current Status**: Deployment Ready  
**Supported Platforms**: Vercel (frontend), Railway/AWS (backend)  
**Database**: PostgreSQL (production recommended)

---

## Pre-Deployment Checklist

Before deploying to production, verify:

✅ **Code Quality**
- [ ] All TypeScript errors resolved (`npm run build` passes)
- [ ] All tests passing (`npm run test`)
- [ ] No console.log statements left (use logger instead)
- [ ] Environment variables configured
- [ ] API endpoints tested (postman collection included)

✅ **Security**
- [ ] JWT_SECRET is not default value
- [ ] Password validation enforced (8+ chars, mixed case, number, special char)
- [ ] HTTPS enforced in production
- [ ] CORS properly configured
- [ ] SQL injection protected (using parameterized queries)
- [ ] Sensitive data not in frontend code

✅ **Database**
- [ ] Database migrations up to date
- [ ] Backup strategy configured
- [ ] Connection pooling enabled
- [ ] Indexes created for frequently queried columns

✅ **Performance**
- [ ] Image optimization enabled
- [ ] Static assets minified
- [ ] Database queries optimized
- [ ] Caching strategy implemented

---

## Environment Configuration

### Frontend Environment Variables

Create `apps/web/.env.production`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Environment
NODE_ENV=production
```

**Vercel Configuration** (`.env` in Vercel dashboard):
- `NEXT_PUBLIC_API_URL` → Production API URL

### Backend Environment Variables

Create `.env` in project root:

```env
# Server Configuration
NODE_ENV=production
PORT=5000
CLIENT_URL=https://yourdomain.com

# Database
DB_HOST=your-db-host.rds.amazonaws.com
DB_PORT=5432
DB_NAME=aircart_production
DB_USER=postgres
DB_PASSWORD=strong_password_here
DATABASE_URL=postgresql://user:password@host:5432/aircart_production

# Authentication
JWT_SECRET=your-very-long-random-secret-key-here-minimum-32-chars
BCRYPT_ROUNDS=10

# Payment Processing
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# Email Service (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Security
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

**Never commit `.env` to Git!** Add to `.gitignore`:
```
.env
.env.local
.env.production.local
```

---

## Platform-Specific Deployment

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Step 1: Deploy Frontend to Vercel

**Prerequisites**: Vercel account, GitHub repository

1. **Push code to GitHub**
```bash
git add .
git commit -m "Production deployment"
git push origin main
```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Select your GitHub repository
   - Select framework: "Next.js"
   - Choose root directory: `apps/web`

3. **Configure Environment Variables**
   - Add `NEXT_PUBLIC_API_URL` pointing to your backend
   - Example: `https://api.railway.app` (if using Railway)

4. **Deploy**
   - Click "Deploy"
   - Vercel builds and deploys automatically
   - Your frontend is live at `your-project.vercel.app`

#### Step 2: Deploy Backend to Railway

**Prerequisites**: Railway account, GitHub repository

1. **Create New Project on Railway**
   - Go to https://railway.app/dashboard
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Link your repository

2. **Configure Services**
   - **API Service**: 
     - Root directory: `.` (root of project)
     - Build command: `npm install && npm run build`
     - Start command: `npm run start`
   
   - **PostgreSQL Database**:
     - Click "Add service"
     - Select "PostgreSQL"
     - Railway provisions database automatically

3. **Set Environment Variables**
   - In Railway dashboard, go to "Variables"
   - Add all variables from `.env` above
   - Railway provides `DATABASE_URL` automatically

4. **Deploy**
   - Railway auto-deploys on git push
   - Your API is live at `yourproject.up.railway.app`

5. **Update Frontend**
   - In Vercel dashboard, set `NEXT_PUBLIC_API_URL=https://yourproject.up.railway.app`
   - Redeploy frontend

### Option 2: Docker Deployment

#### Build Docker Image

```bash
# Build image
docker build -t aircart-api:latest .

# Tag for repo
docker tag aircart-api:latest your-registry/aircart-api:latest

# Push to Docker Hub or AWS ECR
docker push your-registry/aircart-api:latest
```

#### Run with Docker Compose (Production)

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  api:
    image: aircart-api:latest
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@postgres:5432/aircart
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
    restart: unless-stopped

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=aircart_production
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api
    restart: unless-stopped

volumes:
  postgres_data:
```

Run:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Option 3: AWS Deployment

#### EC2 + RDS + Elastic Load Balancer

1. **Create RDS PostgreSQL Instance**
   - Go to AWS RDS Console
   - Create database: PostgreSQL 14+
   - Multi-AZ deployment for high availability
   - Enable backup (7-day retention minimum)
   - Security group: Allow port 5432 from EC2

2. **Create EC2 Instance**
   - Instance type: t3.medium or larger
   - OS: Amazon Linux 2
   - Security group: Allow ports 22 (SSH), 80, 443

3. **Install Dependencies**
```bash
# SSH into EC2
ssh -i your-key.pem ec2-user@your-instance.amazonaws.com

# Install Node.js 20
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install nodejs

# Install Docker
sudo amazon-linux-extras install docker
sudo usermod -a -G docker ec2-user

# Clone repository
git clone https://github.com/your-username/aircart-fullstack.git
cd aircart-fullstack
```

4. **Configure Environment**
```bash
# Create .env with production variables
sudo nano .env
# Add all environment variables from above
```

5. **Deploy Application**
```bash
# Build frontend
cd apps/web
npm run build
cd ../..

# Start API with PM2 (process manager)
npm install -g pm2
pm2 start packages/api/src/index.ts --name "aircart-api"
pm2 startup
pm2 save

# Or use Docker
docker compose up -d
```

6. **Setup Nginx Reverse Proxy**
```bash
sudo yum install nginx
sudo nano /etc/nginx/nginx.conf
```

Add configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Frontend static files
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

7. **Setup SSL with Let's Encrypt**
```bash
sudo amazon-linux-extras install certbot-nginx
sudo certbot certonly --standalone -d yourdomain.com
```

---

## Database Migration (Production)

### PostgreSQL Setup

1. **Create Database**
```sql
CREATE DATABASE aircart_production;
CREATE USER aircart_user WITH PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE aircart_production TO aircart_user;
```

2. **Run Migration Script**
```bash
# Connect to database
psql -h your-db-host -U aircart_user -d aircart_production

# Run schema creation (from documentation/architecture/03-DATABASE_SCHEMA.md)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- ... (see database schema doc)
);

-- ... run all table creation statements
```

### MongoDB Setup (Alternative)

```bash
# MongoDB Atlas Cloud
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Create cluster
# 3. Add database user
# 4. Get connection string
# 5. Add to .env: DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/aircart

# Or local MongoDB
# 1. Install MongoDB locally
# 2. Start service: mongod
# 3. Connection: mongodb://localhost:27017/aircart
```

---

## SSL/TLS Certificates

### Let's Encrypt (Recommended - Free)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (runs daily)
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Certificate in Nginx Config

```nginx
ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers HIGH:!aNULL:!MD5;
```

---

## CDN & Static Assets

### Using CloudFront (AWS)

1. Create S3 bucket for static assets
2. Create CloudFront distribution pointing to S3
3. Update image URLs to CloudFront domain

```typescript
// In next.config.js
module.exports = {
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'd1234abcd.cloudfront.net',
      }
    ]
  }
}
```

---

## Monitoring & Logging

### Configure Logging

```bash
# Application logs to file
pm2 save logs to: /var/log/aircart/

# Or use CloudWatch (AWS)
# Or use ELK Stack (Elasticsearch, Logstash, Kibana)
```

### Monitor Performance

- **Uptime**: Use StatusPage.io or similar
- **Performance**: Use New Relic or DataDog
- **Errors**: Use Sentry.io for error tracking
- **Analytics**: Use Vercel Analytics or Google Analytics

---

## Backup & Recovery

### Daily Automated Backup (RDS)

```bash
# AWS RDS - automatic backups enabled
# Retention: 7 days (configurable)
# Restore from backup: 1-click in AWS Console
```

### Manual Backup

```bash
# PostgreSQL
pg_dump -h your-host -U postgres aircart_production > backup.sql

# Restore
psql -h your-host -U postgres aircart_production < backup.sql

# MongoDB
mongodump --uri "mongodb://user:pass@host/aircart" --out ./backup
mongorestore --uri "mongodb://user:pass@host/aircart" --drop ./backup
```

---

## Performance Optimization

### Frontend (Vercel)

- Automatic image optimization
- Edge caching
- Automatic deployments
- Performance monitoring via Vercel Analytics

### Backend (Railway)

- Load balancing across instances
- Auto-scaling available
- Database connection pooling

```javascript
// In api/index.ts
const pool = new Pool({
  max: 20,  // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})
```

---

## Security Hardening

### Production Checklist

1. **HTTPS Only**
   - Redirect HTTP → HTTPS
   - HSTS header enabled

2. **CORS Configuration**
```typescript
// Only allow your frontend domain
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}))
```

3. **Rate Limiting**
```typescript
// Prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100  // max 100 requests per window
})
app.use('/api/auth', limiter)
```

4. **Security Headers**
```typescript
app.use(helmet())  // npm install helmet
// Sets: X-Frame-Options, X-Content-Type-Options, etc.
```

5. **Input Validation**
```typescript
// All API endpoints validate input with Zod
const schema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(255)
})
```

6. **SQL Injection Protection**
```typescript
// Use parameterized queries (already in use)
db.query('SELECT * FROM users WHERE id = $1', [userId])
```

---

## Rollback Plan

If deployment goes wrong:

```bash
# Vercel - Click "Revert" on previous deployment
# Railway - Roll back to previous commit via GitHub
# Manual - Use PM2 to restart previous version
pm2 restart aircart-api --update-env
```

---

## Monitoring Dashboard

Set up dashboards to track:

- **Uptime**: % active time
- **Response Time**: API latency
- **Error Rate**: % failed requests
- **Database**: Connection count, query time
- **Traffic**: Requests per second
- **Users**: Active daily/monthly users

---

## Scaling Considerations

### Horizontal Scaling
- Run multiple API instances behind load balancer
- Database read replicas
- Redis cache for frequently accessed data

### Vertical Scaling
- Upgrade instance type (more CPU/RAM)
- Increase database resources
- Expand storage

---

## Post-Deployment Verification

After deployment:

1. ✅ Health check endpoint responding: `GET /api/health`
2. ✅ Frontend loads and connects to backend
3. ✅ User registration working
4. ✅ User login working
5. ✅ Product browsing functioning
6. ✅ Shopping cart operational
7. ✅ Checkout process complete
8. ✅ Orders saving to database
9. ✅ Payment processing working
10. ✅ Error handling displaying properly

---

## Support & Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Frontend can't reach API | CORS or DNS issue | Check NEXT_PUBLIC_API_URL in Vercel config |
| Database connection error | Wrong credentials | Verify DATABASE_URL in environment variables |
| 502 Bad Gateway | API not running | Check Railway logs: `railway logs -f service/api` |
| SSL certificate error | Certificate expired | Renew: `certbot renew` |
| High response times | Database slow | Add indexes, enable caching |

---

**Last Updated**: March 28, 2026  
**Status**: Production Ready  
**Maintained By**: Team

