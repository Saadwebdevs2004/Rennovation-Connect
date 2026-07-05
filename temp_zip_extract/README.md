# 🛠️ Renovation Connect

A premium, two-sided marketplace platform connecting homeowners with professional renovation workers and contractors. Designed with an elegant, responsive interface and powered by a robust Express backend and Next.js frontend.

---

## 📂 Project Architecture & Restructured Layout

The project is structured as a **Monorepo** using **npm workspaces**, enforcing a clean separation of concerns and a professional, modular hierarchy.

```text
Renovation_Connect/
│
├── frontend/                     # Next.js Frontend Application (UI & Client-Side routing)
├── backend/                      # Express Backend Server (REST API endpoints & Database access)
│   ├── config/
│   │   └── database.js           # Central MySQL connection pool settings
│   ├── routes/                   # Module-specific API routes (auth, bids, payments, etc.)
│   └── server.js                 # Server startup and main routing config
│
├── database/                     # Database Management & Schema files
│   ├── schema.sql                # Complete SQL schema definition (users, jobs, bids, reviews, etc.)
│   ├── setup_db.js               # Database initial table creation script
│   ├── migrate.js                # Database schema migration (v1: progress_status, is_disputed)
│   └── migrate_images.js         # Database schema migration (v2: image/receipt support)
│
├── docs/                         # System Documentation
│   ├── architecture.md           # Visual/Architectural system flow
│   ├── api.md                    # Backend API Endpoint specifications
│   └── deployment.md             # Production compilation and deployment guide
│
├── docker/                       # Containerized Environment Files
│   ├── frontend.Dockerfile       # Docker configuration for Next.js app
│   └── backend.Dockerfile        # Docker configuration for Express API
│
├── scripts/                      # System Automation & Tooling
│   └── Prepare-Submission.ps1    # Automated packaging/ZIP script for evaluation
│
├── shared/                       # Shared validation or type files
│   └── README.md
│
├── tests/                        # Project-wide Automated Testing
│   └── sample.test.js            # Sample integration/unit test suite
│
├── .env.example                  # Centralized configuration variables template
├── docker-compose.yml            # Multi-container local orchestration configuration
├── package.json                  # Root Monorepo configuration and dev scripts
└── README.md                     # Main documentation guide (this file)
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MySQL** (running locally or in a container)

---

### Step-by-Step Local Setup

#### 1. Setup Environment Variables
Clone the `.env.example` file to `.env` in both the root directory and the respective app folders if needed:
- For Backend: Create `backend/.env` containing:
```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=your_secure_password
DB_NAME=renovation_connect
```
- For Frontend: Create `frontend/.env.local` containing:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### 2. Install All Dependencies (Single Command)
Run this command in the project root. npm workspaces will automatically resolve and install dependencies for the root, frontend, and backend apps:
```bash
npm install
```

#### 3. Setup the Database
Ensure your MySQL server is running, then run the database setup scripts:
```bash
# Set up database tables
node database/setup_db.js

# Apply migrations
node database/migrate.js
node database/migrate_images.js
```

#### 4. Run the Dev Servers (Single Command)
Start the frontend Next.js development server and backend Express API server simultaneously:
```bash
npm run dev
```
- Frontend client will be available at: **http://localhost:3000**
- Backend Express API will be running at: **http://localhost:3001**

---

## 🐳 Docker Deployment

To spin up the entire application stack (Next.js app, Express backend, and a dedicated MySQL server) instantly, run:
```bash
docker compose up --build
```
This configuration uses the Dockerfiles defined in the `docker/` folder and links them together via the root `docker-compose.yml`.

---

## 📦 Packaging for Evaluation
When submitting or archiving the project, use the automated PowerShell script. It filters out heavy dependencies (`node_modules`), build caches (`.next`), and builds a lightweight ZIP:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/Prepare-Submission.ps1
```
The ZIP is created directly on your Desktop, complete with setup instructions for evaluators.
