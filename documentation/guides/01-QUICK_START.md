# 🚀 Quick Start Guide - 5 Minutes to Running

## Prerequisites
- Node.js 20+ installed
- npm 10+ installed
- VS Code (optional)

## Step 1: Navigate to Project (30 seconds)

```powershell
Set-Location d:\SOURAV\workspace\aircart-fullstack
```

## Step 2: Start Backend Server (1 minute)

```powershell
# Open Terminal 1
Set-Location packages\api
npm run dev
```

You should see:
```
================================================
🚀 AirCart API Server - Phase 4
================================================
✅ Server running on http://localhost:5000
```

## Step 3: Start Frontend Server (1 minute)

```powershell
# Open Terminal 2
Set-Location apps\web
npm run dev
```

You should see:
```
▲ Next.js 15.5.12
- Local:    http://localhost:3000
✓ Ready in 12s
```

## Step 4: Open in Browser (30 seconds)

```
👉 http://localhost:3000
```

## Step 5: Test Registration (2 minutes)

1. Click **"Sign Up"**
2. Fill the form:
   - Name: `test`
   - Email: `test@gmail.com`
   - Password: `Test@1234`
3. Click **"Create Account"**
4. Should redirect to Dashboard ✅

---

## ✅ You're Ready!

Your AirCart application is now running with:
- ✅ Frontend on http://localhost:3000
- ✅ Backend API on http://localhost:5000
- ✅ User authentication working
- ✅ Products and shopping cart ready

**Next**: Read [Project Overview](./02-PROJECT_OVERVIEW.md) to understand the architecture.

