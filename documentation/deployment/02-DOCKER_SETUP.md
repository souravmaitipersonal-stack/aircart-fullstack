# 🐳 Docker Setup Guide - Containerization & Orchestration

**Purpose**: Run entire application stack in isolated, reproducible containers  
**Platforms**: Docker Desktop (development), Linux Server (production)  
**Databases Included**: PostgreSQL, MongoDB

---

## What is Docker?

Docker packages your application with all dependencies into containers - like portable mini-computers.

**Benefits**:
- ✅ Consistent environment (dev = staging = production)
- ✅ No "works on my machine" problems
- ✅ Easy deployment to any server
- ✅ Automatic scaling
- ✅ Resource isolated (CPU, memory, network)

---

## Prerequisites

### Windows/Mac
1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Start Docker Desktop application
3. Verify: Open PowerShell and run `docker --version`

### Linux
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Start service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (no sudo needed)
sudo usermod -a -G docker $USER
```

---

## Project Docker Configuration

### Current `Dockerfile`

Located at project root: `Dockerfile`

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Runtime stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/api ./packages/api
COPY --from=builder /app/package.json ./

EXPOSE 5000

CMD ["npm", "run", "start"]
```

**Image Size**: ~300MB (multi-stage build keeps it small)

**Ports Exposed**:
- `5000` - Express API server

### Current `docker-compose.yml`

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/aircart
      - JWT_SECRET=dev-secret-key-change-in-production
      - CLIENT_URL=http://localhost:3000
    depends_on:
      - postgres
      - mongodb
    volumes:
      - ./packages/api:/app/packages/api
    restart: unless-stopped

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=aircart
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  mongodb:
    image: mongo:6.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

volumes:
  postgres_data:
  mongodb_data:
```

---

## Quick Start with Docker

### 1. Build and Run All Services

```powershell
# Navigate to project root
cd d:\SOURAV\workspace\aircart-fullstack

# Build images and start services
docker-compose up -d

# Verify services running
docker-compose ps
```

Expected output:
```
NAME                COMMAND             STATUS              PORTS
aircart-api         npm run start       Up 2 minutes        0.0.0.0:5000->5000/tcp
aircart-postgres    postgres            Up 2 minutes        0.0.0.0:5432->5432/tcp
aircart-mongodb     mongod              Up 2 minutes        0.0.0.0:27017->27017/tcp
```

### 2. Verify Services are Running

```powershell
# Test API health
curl http://localhost:5000/api/health

# Expected response:
# {"status":"success","message":"AirCart Backend is running!"}

# Test database connections
docker-compose logs api

# Check database
docker-compose exec postgres psql -U postgres -d aircart -c "\dt"
```

### 3. View Logs

```powershell
# All services
docker-compose logs

# Specific service
docker-compose logs api
docker-compose logs postgres
docker-compose logs mongodb

# Follow logs (live)
docker-compose logs -f api
```

### 4. Stop Services

```powershell
# Stop all services (data preserved)
docker-compose stop

# Stop specific service
docker-compose stop api

# Remove all containers (data in volumes preserved)
docker-compose down

# Remove everything including volumes (WARNING: data deleted!)
docker-compose down -v
```

---

## Docker Images Explained

### API Image

**Base**: Node.js 20 Alpine (lightweight Linux)
**Size**: ~300MB
**Packages**: Node.js, npm, Express, TypeScript

Build process:
1. Install dependencies
2. Build TypeScript → JavaScript
3. Copy only needed files to runtime stage
4. Expose port 5000

### PostgreSQL Image

**Base**: PostgreSQL 15 Alpine
**Size**: ~200MB
**Data**: Stored in `postgres_data` volume

Default credentials (development only):
- Username: `postgres`
- Password: `password`
- Database: `aircart`
- Port: `5432`

### MongoDB Image

**Base**: MongoDB 6.0 Community
**Size**: ~500MB
**Data**: Stored in `mongodb_data` volume

Default credentials (development only):
- Username: `admin`
- Password: `password`
- Port: `27017`

---

## Docker Compose Services

### Service: `api`

**Builds**: The Express backend from `Dockerfile`

Environment variables:
```yaml
NODE_ENV: development
DATABASE_URL: Points to PostgreSQL in container
JWT_SECRET: (development value shown)
CLIENT_URL: For CORS configuration
```

Port mapping: `5000:5000` (host:container)

Volume mounting:
```yaml
- ./packages/api:/app/packages/api  # Live reload on code change
```

Dependencies: Waits for postgres & mongodb to start before starting

### Service: `postgres`

**Pre-built Image**: `postgres:15-alpine`

Initialization:
- Creates database: `aircart`
- Sets password: `password`

Port mapping: `5432:5432`

Volume:
```yaml
postgres_data:  # Persists data between container restarts
  /var/lib/postgresql/data  # Container storage path
```

Connection string:
```
postgresql://postgres:password@postgres:5432/aircart
```

### Service: `mongodb`

**Pre-built Image**: `mongo:6.0`

Authentication:
- Root user: `admin`
- Password: `password`

Port mapping: `27017:27017`

Connection string:
```
mongodb://admin:password@mongodb:27017/aircart
```

---

## Development Workflow with Docker

### Adding Code Changes

Since `packages/api` is volume-mounted, changes are reflected immediately:

```powershell
# 1. Edit code
notepad packages/api/src/index.ts

# 2. Changes are instantly visible in container
docker-compose logs -f api

# 3. Container auto-reloads (if using nodemon)
```

### Accessing Database

#### PostgreSQL Interactive Shell

```powershell
# Connect to PostgreSQL inside container
docker-compose exec postgres psql -U postgres -d aircart

# Once connected, run SQL:
\dt  # List tables
SELECT * FROM users;
\q   # Exit
```

#### MongoDB Shell

```powershell
# Connect to MongoDB inside container
docker-compose exec mongodb mongosh -u admin -p password

# Once connected:
> use aircart
> db.users.find()
> exit
```

#### Using Database GUI Tools

**DBeaver** (PostgreSQL/MongoDB GUI):
1. Download from https://dbeaver.io
2. Create new connection:
   - Host: localhost
   - Port: 5432 (PostgreSQL) or 27017 (MongoDB)
   - Username/Password: postgres/password or admin/password
3. Connect and browse data

### Running Migrations

```powershell
# Inside API container
docker-compose exec api npm run migrate

# Or use custom script
docker-compose exec api node scripts/setup-db.js
```

### Running Tests in Docker

```powershell
# Run all tests
docker-compose exec api npm run test

# Run specific test file
docker-compose exec api npm run test -- api.integration.test.ts

# Run with coverage
docker-compose exec api npm run test -- --coverage
```

---

## Building Custom Images

### Build API Image Manually

```powershell
# Build from Dockerfile
docker build -t aircart-api:latest .

# Build with custom tag
docker build -t aircart-api:v1.0 .

# View built images
docker images | grep aircart
```

### Tag for Docker Registry

```powershell
# Tag for Docker Hub
docker tag aircart-api:latest yourusername/aircart-api:latest

# Tag for AWS ECR
docker tag aircart-api:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/aircart-api:latest

# Push to registry
docker push yourusername/aircart-api:latest
```

---

## Production Configuration

### Security Best Practices

**Change Default Credentials**

Edit `docker-compose.prod.yml`:

```yaml
services:
  postgres:
    environment:
      - POSTGRES_PASSWORD=your-strong-password-here
  
  mongodb:
    environment:
      - MONGO_INITDB_ROOT_PASSWORD=your-strong-password-here
```

**Environment Variables**

Store in `.env.production`:

```env
NODE_ENV=production
JWT_SECRET=your-long-random-secret-key-minimum-32-characters
DATABASE_PASSWORD=your-strong-password
MONGODB_PASSWORD=your-strong-password
DATABASE_URL=postgresql://postgres:your-password@postgres:5432/aircart_prod
```

Load with:
```powershell
docker-compose --env-file .env.production up -d
```

### Production Recipe

`docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  api:
    build: .
    image: aircart-api:latest
    restart: always
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:${DB_PASSWORD}@postgres:5432/aircart
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - postgres
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  postgres:
    image: postgres:15-alpine
    restart: always
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}
      - POSTGRES_DB=aircart_production
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  nginx:
    image: nginx:alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - api

volumes:
  postgres_data:
```

---

## Docker Networking

### How Services Communicate

Inside Docker Compose, services communicate via service names:

```typescript
// From `api` service
const connectionString = 'postgresql://postgres:password@postgres:5432/aircart'
//                                                      ↑
//                                      Service name as hostname
```

DNS resolution automatically maps service names to container IPs.

### External Access

From your host machine:
```powershell
# Mapped through port forwarding
http://localhost:5000      # → api:5000
http://localhost:5432      # → postgres:5432
http://localhost:27017     # → mongodb:27017
```

---

## Troubleshooting Docker

### Common Issues

**Port Already in Use**

```powershell
# Check what's using port 5000
netstat -ano | Select-String ":5000"

# Kill process
taskkill /PID <PID> /F

# Or change port in docker-compose.yml:
ports:
  - "5001:5000"  # Use 5001 instead
```

**Container Exits Immediately**

```powershell
# Check logs
docker-compose logs api

# If "Cannot find module", rebuild:
docker-compose build --no-cache
docker-compose up -d
```

**Database Connection Refused**

```powershell
# Ensure postgres is running
docker-compose ps

# Rebuild and restart
docker-compose down
docker-compose up -d

# Wait 30 seconds for database to start
docker-compose logs -f postgres
```

**Can't Access API from Browser**

```powershell
# Check if container is running
docker-compose ps

# Check container logs for errors
docker-compose logs api

# Test from within container
docker-compose exec api curl http://localhost:5000/api/health
```

**Permission Denied on Linux**

```bash
# Add user to docker group
sudo usermod -a -G docker $USER

# Log out and back in, or:
newgrp docker
```

---

## Docker Commands Reference

| Command | Purpose |
|---------|---------|
| `docker-compose up -d` | Start all services |
| `docker-compose stop` | Stop all services |
| `docker-compose down` | Stop and remove containers |
| `docker-compose ps` | List running services |
| `docker-compose logs <service>` | View service logs |
| `docker-compose exec <service> <cmd>` | Run command in container |
| `docker-compose build` | Rebuild images |
| `docker build -t name .` | Build image from Dockerfile |
| `docker images` | List images |
| `docker push image:tag` | Push to registry |

---

## Performance Optimization

### Reduce Image Size

```dockerfile
# Use minimal base image
FROM node:20-alpine

# Multi-stage builds (already in use)
FROM node:20-alpine AS builder
# ... build stage
FROM node:20-alpine
# ... runtime stage

# Remove development dependencies
RUN npm ci --only=production
```

### Resource Limits

```yaml
services:
  api:
    deployments:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### Caching Strategy

Docker caches layers - order matters:

```dockerfile
# ✅ Good: Cache invalidates only when dependencies change
COPY package*.json ./
RUN npm install
COPY . .

# ❌ Bad: Any change invalidates cache, rebuilds everything
COPY . .
RUN npm install
```

---

## Multi-Environment Setup

### Development Environment

```bash
docker-compose up -d
```

### Staging Environment

```bash
docker-compose -f docker-compose.staging.yml up -d
```

### Production Environment

```bash
docker-compose -f docker-compose.prod.yml -f docker-compose.prod.local.yml up -d
```

---

## Debugging in Docker

### Interactive Shell

```powershell
# Connect to running container
docker-compose exec api bash

# Once inside:
ls -la
ps aux
env | grep NODE
exit
```

### Debug Node Application

```powershell
# Run with debug mode
docker-compose exec api node --inspect-brk packages/api/src/index.js

# Connect Chrome DevTools: chrome://inspect
```

---

## Persistence & Backups

### Backup Volumes

```powershell
# Backup PostgreSQL db
docker-compose exec postgres pg_dump -U postgres aircart > backup.sql

# Backup MongoDB
docker-compose exec mongodb mongodump --out ./backup --username admin --password password

# Backup volumes (entire directory)
docker run --rm -v postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
```

### Restore from Backup

```powershell
# Restore PostgreSQL
docker-compose exec postgres psql -U postgres -d aircart < backup.sql

# Restore MongoDB
docker-compose exec mongodb mongorestore ./backup --username admin --password password
```

---

**Last Updated**: March 28, 2026  
**Version**: 4.0  
**Status**: Production Ready

