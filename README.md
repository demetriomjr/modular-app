# Modular App (POS & ERP Ecosystem)

A modern, highly scalable modular application built with a micro-frontend architecture using **Module Federation** and a microservices-inspired backend with **NestJS**.

## 🏗️ Architecture

This project follows a "Core vs Module" architecture designed for extensibility:

- **Shell (Core)**: The main entry point that handles authentication, user management, and dynamic module loading.
- **Remotes (Modules)**: Pluggable business features (like POS or Inventory) that are developed and deployed independently.

### Project Structure

```text
modular-app/
├── core-backend/      # NestJS service for Auth, Users, and Module registry
├── core-frontend/     # React shell application (Module Federation host)
├── module-backend/    # NestJS service for specific business logic (Sales/POS)
├── module-frontend/   # React remote module (Exposes POS & Products)
├── docker-compose.yml # Infrastructure (PostgreSQL)
└── manifest.json      # Module Federation configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20 or higher
- **Docker**: For running the PostgreSQL database
- **npm**: Package manager

### 1. Setup Infrastructure

Start the database using Docker Compose:

```bash
docker-compose up -d
```

### 2. Configure Environment

Each sub-project contains or requires a `.env` file. Ensure you configure the `DATABASE_URL` in both `core-backend` and `module-backend`.

### 3. Install Dependencies

Run `npm install` in each directory:

```bash
cd core-backend && npm install
cd ../core-frontend && npm install
cd ../module-backend && npm install
cd ../module-frontend && npm install
```

### 4. Database Migrations

Run Prisma migrations for both backends:

```bash
# In core-backend
npx prisma migrate dev

# In module-backend
npx prisma migrate dev
```

### 5. Running the Application

For a full development environment, run each service in a separate terminal:

- **Core Backend**: `npm run start:dev` (Port 3000)
- **Module Backend**: `npm run start:dev` (Port 3002)

#### 🛑 Frontend (IMPORTANT)
**Do NOT use `npm run dev` for the frontend projects.** Due to Module Federation requirements, they must be built and served via preview mode:

- **Module Frontend (Remote)**: 
  ```bash
  cd module-frontend && npm run build && npm run preview
  ```
- **Core Frontend (Host)**: 
  ```bash
  cd core-frontend && npm run build && npm run preview
  ```

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Material UI (MUI), Module Federation.
- **Backend**: NestJS, Prisma ORM, Passport (JWT).
- **Database**: PostgreSQL.
- **Communication**: REST API, Module Federation Hooks.
