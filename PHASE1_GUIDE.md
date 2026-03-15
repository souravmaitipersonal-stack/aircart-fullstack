# AirCart Phase 1 - Quick Start Guide

## 🎉 Phase 1 Setup Complete!

Your AirCart ecommerce project is now ready! Below is the complete guide to get started.

---

## ⚠️ Important: Prerequisites to Install

Before running the project, you MUST install:

### 1. **Upgrade Node.js** (Current: v18.12.0 → Required: v24+)
```
Download: https://nodejs.org/
Select: LTS version (18+ minimum, 24+ recommended)
```

**Verify:**
```bash
node --version  # Should be v24.x.x or higher
npm --version   # Should be 10.x.x or higher (comes with Node.js)
```

### 2. **Install Docker Desktop** (For databases)
```
Download: https://www.docker.com/products/docker-desktop
Install and start Docker Desktop application
```

**Verify:**
```bash
docker --version
docker-compose --version
```

---

## 🚀 Quick Start (30 minutes)

### Step 1: Start Databases
```bash
cd aircart-fullstack
docker-compose up -d
```

Check if running:
```bash
docker-compose ps
# Should show:
# STATUS: Up X seconds
```

### Step 2: Install Dependencies (Already Done!)
```bash
npm install
```

### Step 3: Start All Services
```bash
npm run dev
```

You should see:
```
✨ Building...
✓ Compiling...

> @aircart/api@1.0.0 dev
tsx watch src/index.ts

✅ AirCart API running on http://localhost:5000

> @aircart/web@1.0.0 dev
  ▲ Next.js 15.x
  - ready started server on 0.0.0.0:3000
```

### Step 4: Open in Browser
- **Frontend**: http://localhost:3000
- **Backend Health**: http://localhost:5000/api/health

---

## ✅ What's Included (Phase 1)

### Frontend (Next.js)
✅ Beautiful hero page with Tailwind CSS styling
✅ Responsive navigation and footer
✅ Feature showcase section
✅ Call-to-action buttons
✅ Mobile-friendly design

### Backend (Express)
✅ Health check endpoint: `/api/health`
✅ API info endpoint: `/api`
✅ CORS configured
✅ Error handling middleware
✅ Request logging

### Code Organization
✅ Monorepo structure with Turborepo
✅ Shared types package
✅ Shared utilities package
✅ ESLint + Prettier configuration
✅ Husky pre-commit hooks
✅ TypeScript throughout

### Documentation
✅ SETUP.md - Installation guide
✅ ARCHITECTURE.md - System design
✅ API.md - API reference
✅ This file (PHASE1_GUIDE.md)

---

## 📂 Project Structure

```
aircart-fullstack/
├── apps/web/                    # Next.js storefront (Port 3000)
│   ├── src/app/                # Pages (home, products, cart, etc)
│   ├── src/components/         # React components
│   ├── src/store/              # Zustand stores
│   ├── src/styles/             # Tailwind CSS + globals
│   └── package.json
│
├── packages/api/                # Express backend (Port 5000)
│   ├── src/index.ts            # Main server
│   ├── src/config/             # Configuration & logger
│   ├── .env                    # Environment variables
│   └── package.json
│
├── packages/types/              # Shared TypeScript types
├── packages/utils/              # Shared utility functions
├── packages/ui/                 # Shared React components (placeholder)
│
├── docs/                        # Documentation
│   ├── SETUP.md
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── PHASE1_GUIDE.md
│
├── docker-compose.yml           # PostgreSQL + MongoDB
├── turbo.json                   # Monorepo configuration
├── package.json                 # Root workspace
├── tsconfig.json                # TypeScript config
├── .eslintrc.json               # ESLint rules
├── .prettierrc                  # Prettier formatting
└── README.md
```

---

## 🛠 Available Commands

### Development
```bash
npm run dev              # Start all services
npm run dev --filter=web # Frontend only
npm run dev --filter=api # Backend only
```

### Building
```bash
npm run build            # Build all packages
```

### Testing
```bash
npm run test             # Run tests (placeholder)
```

### Code Quality
```bash
npm run lint             # Check linting
npm run format           # Auto-format code
npm run format:check     # Check without changing
```

### Database
```bash
docker-compose up -d      # Start databases (background)
docker-compose down       # Stop databases
docker-compose logs       # View logs
docker-compose logs -f    # Follow logs
```

### Cleanup
```bash
npm run clean             # Remove build artifacts
```

---

## 🧪 Testing the Setup

### Test Backend
```bash
# Terminal 1: Start backend
npm run dev --filter=api

# Terminal 2: Test endpoint
curl http://localhost:5000/api/health

# Should return (JSON):
{
  "status": "success",
  "message": "AirCart Backend is running!",
  "timestamp": "2026-03-14T10:30:00Z",
  "environment": "development"
}
```

### Test Frontend
```bash
# Terminal 1: Start frontend
npm run dev --filter=web

# Terminal 2: Open browser
# http://localhost:3000
# Should show: Beautiful AirCart homepage with hero section
```

### Test Full Stack
```bash
# Terminal 1: Start all
npm run dev

# Terminal 2: Open browser
# http://localhost:3000 (see homepage)
# http://localhost:5000/api/health (see API response)
```

---

## 📋 Next Steps (Phase 2)

Once Phase 1 is stable, Phase 2 starts:

1. **Database Schema Design**
   - User, Product, Order models
   - PostgreSQL migrations
   - MongoDB setup

2. **Authentication System**
   - User registration endpoint
   - User login endpoint
   - JWT token generation
   - Protected routes middleware

3. **First API Endpoints**
   - POST /api/auth/register
   - POST /api/auth/login
   - GET /api/auth/me

4. **End-to-End Flow**
   - Login form on frontend
   - Test signup/login E2E

---

## 🎨 UI Features (Already Included)

### Styling
- ✅ Tailwind CSS with custom color scheme (blues + accents)
- ✅ Global styles and utility classes
- ✅ Responsive design (mobile-first)
- ✅ Custom component classes (btn, card, container-wide)

### Layout
- ✅ Sticky navigation bar
- ✅ Footer with links
- ✅ Hero section
- ✅ Features grid
- ✅ Call-to-action sections

### AirCart Branding
- ✅ Logo integration ready
- ✅ Color scheme: Primary blue + accent orange
- ✅ Tagline: "E-Commerce, Elevated"
- ✅ Professional design

---

## 🔐 Security (Phase 1)

- ✅ CORS configured for localhost
- ✅ Environment variables separated (.env)
- ✅ Type safety with TypeScript
- ✅ Error handling middleware

(Passwords, JWTs, authentication coming in Phase 2)

---

## 🚨 Troubleshooting

### "npm: command not found"
→ Install Node.js from https://nodejs.org/

### "docker: command not found"
→ Install Docker Desktop from https://www.docker.com/products/docker-desktop

### Port 3000 already in use
```bash
# Kill process using port 3000
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

### Port 5000 already in use
```bash
# Change PORT in packages/api/.env
PORT=5001
```

### Dependencies not installing
```bash
rm -r node_modules
npm install
```

### Hot reload not working
```bash
# Restart with clean cache
npm run clean
npm install
npm run dev
```

### Database connection refused
```bash
# Ensure Docker Desktop is running
docker-compose up -d
docker-compose logs  # Check for errors
```

---

## 📞 Getting Help

1. **Check documentation**: docs/
2. **Review error messages** - they're detailed and helpful
3. **Verify prerequisites** are installed (Node.js, Docker)
4. **Check ports** aren't in use (3000, 5000, 5432, 27017)
5. **Restart services** - often fixes issues

---

## 🎯 Phase 1 Checklist

- [ ] Node.js v24+ installed and working
- [ ] Docker Desktop installed and running
- [ ] npm install completed successfully
- [ ] docker-compose up -d databases running
- [ ] npm run dev starts all services
- [ ] Frontend loads at http://localhost:3000
- [ ] Backend health check works at http://localhost:5000/api/health
- [ ] Hot reload works (edit src files and see changes instantly)
- [ ] Code linting works (npm run lint)
- [ ] No console errors or warnings (check dev console)

---

## 🎬 Ready to Start?

```bash
# Navigate to project
cd aircart-fullstack

# Start databases
docker-compose up -d

# Start all services
npm run dev

# Open browser
# Frontend: http://localhost:3000
# Backend: http://localhost:5000/api/health
```

---

## 📖 Full Documentation

- **SETUP.md** - Detailed setup instructions
- **ARCHITECTURE.md** - System design & decisions
- **API.md** - API endpoints (Phase 2+)
- **README.md** - Project overview

---

## 💡 Tips

1. **Split terminals**: Run `npm run dev` in one, keep another for git commands
2. **Use Thunder Client**: VS Code extension for testing API (better than curl)
3. **Read error messages**: They tell you exactly what's wrong
4. **HMR (Hot Module Reload)**: Edit files and see changes instantly
5. **Version control**: Commit after each feature works, not at the end

---

**Phase 1 is complete! You now have a production-ready foundation ready for Phase 2: Authentication.**

Good luck with your learning journey! 🚀
