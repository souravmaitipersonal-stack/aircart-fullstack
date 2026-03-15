# AirCart Setup Guide

Complete guide to set up AirCart development environment locally.

## Prerequisites

### Required
- **Node.js**: v24.14.0 LTS or later
  - Download: https://nodejs.org/
  - Verify: `node --version`
- **Git**: Latest version
- **Docker + Docker Compose**: For local databases
  - Download: https://www.docker.com/products/docker-desktop
  - Verify: `docker --version && docker-compose --version`

### Optional
- **VS Code**: Recommended editor
  - Extensions: ESLint, Prettier, Thunder Client (REST testing)
- **MongoDB Compass**: GUI for MongoDB (optional)
- **pgAdmin**: GUI for PostgreSQL (optional)

---

## Installation Steps

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/aircart-fullstack.git
cd aircart-fullstack
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or with pnpm (recommended for monorepos):
```bash
npm install -g pnpm
pnpm install
```

### 3. Setup Environment Variables

#### Backend (.env)
```bash
cd packages/api
cp .env.example .env
# Edit .env with your values (defaults should work locally)
```

Contents:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

POSTGRES_URL=postgresql://aircart:aircart@localhost:5432/aircart_db
MONGODB_URL=mongodb://aircart:aircart@localhost:27017/aircart

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
```

#### Frontend (.env.local)
```bash
cd apps/web
cp .env.example .env.local
# No changes needed for local development
```

Contents:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Start Databases

From project root:
```bash
docker-compose up -d
```

Verify databases are running:
```bash
# PostgreSQL
psql -h localhost -U aircart -d aircart_db -c "SELECT 1"

# MongoDB
mongosh --authenticationDatabase admin -u aircart -p aircart localhost:27017
# Type: exit
```

### 5. Start Development Servers

From project root:
```bash
npm run dev
```

This will start:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **Hot reload**: Automatic on file changes

### 6. Verify Everything Works

Open in browser:
- Frontend: http://localhost:3000 (should show hero page)
- Backend API: http://localhost:5000/api/health (should show JSON response)

---

## Available Commands

### Development
```bash
npm run dev              # Start all services
npm run dev --filter=web # Start only frontend
npm run dev --filter=api # Start only backend
```

### Building
```bash
npm run build            # Build all packages
npm run build --filter=web
npm run build --filter=api
```

### Testing
```bash
npm run test             # Run all tests
npm run test --filter=web
npm run test -- --watch # Watch mode
```

### Code Quality
```bash
npm run lint             # Check code style
npm run format           # Auto-format all code
npm run format:check     # Check formatting without changing
```

### Database Operations
```bash
docker-compose up       # Start databases
docker-compose down     # Stop databases
docker-compose logs     # View database logs
```

### Cleanup
```bash
npm run clean           # Remove build artifacts
docker-compose down -v  # Stop and remove volumes
```

---

## Project Structure

```
aircart-fullstack/
├── apps/
│   └── web/                          # Next.js storefront
│       ├── src/app/                  # Pages and layouts
│       ├── src/components/           # React components
│       ├── src/hooks/                # Custom hooks
│       ├── src/store/                # Zustand stores
│       ├── __tests__/                # Tests
│       └── package.json
│
├── packages/
│   ├── api/                          # Express backend
│   │   ├── src/index.ts              # Main server
│   │   ├── src/routes/               # API endpoints
│   │   ├── src/services/             # Business logic
│   │   ├── src/config/               # Configuration
│   │   └── __tests__/                # Tests
│   │
│   ├── types/                        # Shared TypeScript types
│   │   └── src/index.ts
│   │
│   └── utils/                        # Shared utilities
│       └── src/index.ts
│
├── docs/                             # Documentation
├── .github/workflows/                # CI/CD pipelines
├── docker-compose.yml                # Local databases
├── turbo.json                        # Monorepo config
├── README.md
└── package.json                      # Root workspace
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000 or 5000
lsof -i :3000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Database Connection Errors
```bash
# Check if Docker is running
docker ps

# Restart databases
docker-compose restart

# View logs
docker-compose logs postgres
docker-compose logs mongodb
```

### Dependencies Not Resolved
```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install
```

### Port 5432 (PostgreSQL) Already in Use
```bash
# Specify different port in .env
POSTGRES_URL=postgresql://aircart:aircart@localhost:5433/aircart_db

# Update docker-compose.yml
# ports:
#   - "5433:5432"
```

### TypeScript Errors
```bash
# Rebuild TypeScript
npm run build

# Clear cache
npm run clean
npm install
```

---

## Development Workflow

1. **Create feature branch**:
   ```bash
   git checkout -b feat/feature-name
   ```

2. **Make changes** and test

3. **Commit with meaningful messages**:
   ```bash
   git commit -m "feat: add user authentication"
   git commit -m "fix: resolve cart calculation bug"
   ```

4. **Husky will run pre-commit checks automatically**:
   - ESLint
   - Prettier formatting
   - (Later: unit tests)

5. **Push and create pull request**:
   ```bash
   git push origin feat/feature-name
   ```

6. **GitHub Actions will verify**:
   - Code linting
   - Formatting
   - Build success

7. **Merge after approval**.

---

## Next Steps

After setup is confirmed working:
1. Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand system design
2. Check [API.md](./API.md) for API documentation
3. Start Phase 2: Database schema and authentication
4. Follow roadmap in main [README.md](../README.md)

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| `npm: command not found` | Install Node.js from nodejs.org |
| `docker: command not found` | Install Docker Desktop |
| Port 3000 in use | Change in next.config.js or kill process |
| Port 5000 in use | Change PORT in .env or kill process |
| MongoDB connection refused | Run `docker-compose up -d` |
| PostgreSQL connection refused | Run `docker-compose up -d` |

---

## Support

For issues:
1. Check this guide's troubleshooting section
2. Review error messages carefully
3. Check GitHub issues
4. Create new issue with:
   - OS (Windows/Mac/Linux)
   - Node version
   - Error message
   - Steps to reproduce
