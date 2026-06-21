# 🚀 Production Deployment Guide - Renovation Connect

This document outlines the commands and steps to build and deploy the Renovation Connect platform in a production environment.

---

## 🏗️ 1. Compiling the Builds

In a production environment, you compile the TypeScript and Next.js frontend code rather than running in JIT/development mode.

### Clean and Build (Unified Command)
Run this command at the root folder:
```bash
npm run build
```
This script triggers:
1. `npm run build --workspace=frontend` (Compiles Next.js into highly optimized production static chunks and server routes inside the `.next` directory).
2. `npm run build --workspace=backend` (Runs any build actions configured for backend, or verifies code compiles).

---

## 🗄️ 2. Production Database Setup

Run database initialization and schema migration scripts to prepare the target production MySQL database:
```bash
# Set up tables
node database/setup_db.js

# Run data structural migrations
node database/migrate.js
node database/migrate_images.js
```

---

## ⚙️ 3. Environment Variables configuration

Ensure your production environment has the proper configuration. **Never check in production `.env` files to git.** Use environment registers or a secure vault.

### Backend Configurations
- `NODE_ENV=production`
- `PORT=3001`
- `DB_HOST=your-production-db-host`
- `DB_USER=prod_db_user`
- `DB_PASSWORD=prod_secure_password`
- `DB_NAME=renovation_connect`

### Frontend Configurations
- `NEXT_PUBLIC_API_URL=https://api.yourdomain.com`

---

## 🐳 4. Docker Production Startup

To spin up the system in a production container environment, run:
```bash
docker compose -f docker-compose.yml up -d --build
```
This builds production-grade, optimized Docker images for both services and runs them in detached (`-d`) background daemon mode.
