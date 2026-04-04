# 💻 Complete Installation Guide

## System Requirements

- **Node.js**: 20.0 or higher
- **npm**: 10.0 or higher
- **RAM**: Minimum 4GB
- **Disk Space**: 1GB+ free
- **OS**: Windows, macOS, or Linux

## Verify Requirements

```powershell
node --version
# Should output v20.x.x or higher

npm --version
# Should output 10.x.x or higher
```

## Step 1: Clone Repository

If not already done, navigate to your workspace:

```powershell
Set-Location d:\SOURAV\workspace\aircart-fullstack
```

## Step 2: Install Root Dependencies

```powershell
npm install
```

This installs Turborepo and dependencies for all workspaces.

## Step 3: Verify Installation

```powershell
npm --version
node --version
turbo --version
```

## Step 4: Check Workspace Structure

```powershell
# Verify apps/web exists
Test-Path apps\web\package.json

# Verify packages/api exists
Test-Path packages\api\package.json

# Verify node_modules exist
Test-Path node_modules
Test-Path apps\web\node_modules
Test-Path packages\api\node_modules
```

All should return `True`.

## Step 5: Environment Setup

### Backend Environment (packages/api/.env)

Already configured with:
```
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

### Frontend Environment (apps/web/.env.local)

Already configured with:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Step 6: Start Development Environment

### Terminal 1: Start Backend

```powershell
Set-Location packages\api
npm run dev
```

Expected output:
```
================================================
🚀 AirCart API Server - Phase 4
================================================
✅ Server running on http://localhost:5000
```

### Terminal 2: Start Frontend

```powershell
Set-Location apps\web
npm run dev
```

Expected output:
```
▲ Next.js 15.5.12
- Local:    http://localhost:3000
✓ Ready in 12s
```

## Step 7: Verify Both Services

### Check Backend is Responding

```powershell
# In PowerShell
Invoke-WebRequest -Uri 'http://localhost:5000/api/health' -UseBasicParsing
```

Should return status code 200.

### Open Frontend

```
http://localhost:3000
```

You should see the AirCart homepage.

## Step 8: Test Registration

1. Click "Sign Up"
2. Register with:
   - Name: Test
   - Email: test@gmail.com
   - Password: Test@1234
3. Should redirect to dashboard ✅

---

## 🔧 Troubleshooting Installation

### Port Already in Use

If you get "port 5000/3000 already in use":

```powershell
# Find process on port 5000
netstat -ano | Select-String ":5000"

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Restart npm run dev
```

### Dependencies Installation Fails

```powershell
# Clear npm cache
npm cache clean --force

# Remove node_modules
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force apps\web\node_modules
Remove-Item -Recurse -Force packages\api\node_modules

# Reinstall
npm install
```

### TypeScript Compilation Error

```powershell
# From project root
npm run build
```

If errors, check the specific file mentioned in the error.

---

## ✅ Installation Complete!

When all steps succeed, you have:
- ✅ Backend API running on port 5000
- ✅ Frontend app running on port 3000
- ✅ TypeScript compiled and type-safe
- ✅ All dependencies installed
- ✅ Development environment ready

**Next Steps**: 
1. Read [Quick Start Guide](./01-QUICK_START.md)
2. Run through [UI Testing Report](../testing/03-UI_TESTING_REPORT.md)
3. Deploy to production: See [Deployment Guide](../deployment/01-DEPLOYMENT_GUIDE.md)

