# ConstWare Enterprise Monorepo

ConstWare is a high-performance, modern construction management SaaS platform built for contractors, site supervisors, and enterprise clients. This repository is structured as a Turborepo monorepo using npm workspaces for type safety, visual components sharing, and build caching.

## Directory Structure

```text
Root
├── apps/
│   ├── web/                 # Next.js frontend (deployed to Vercel)
│   ├── api/                 # Express.js REST API (deployed to Render / Docker)
│   ├── mobile/              # Capacitor wrapper for Android & iOS
│   └── desktop/             # Electron wrapper for macOS, Windows & Linux
│
├── packages/
│   ├── ui/                  # Reusable Radix/Tailwind styled components
│   ├── shared/              # Common helpers (Cloudflare R2 Client, Site ID generator)
│   ├── types/               # TypeScript interfaces shared between frontend & backend
│   ├── constants/           # Business rules, pricing configurations & Stages
│   ├── config/              # Shared Tailwind & TSConfig presets
│   └── eslint-config/       # Unified code styling configuration rules
│
├── prisma/                  # Database management & seed scripts
└── infrastructure/          # Docker, Nginx, deployment manifests
```

## Setup & Local Development

### 1. Requirements
Ensure you have Node.js v20+ and npm installed.

### 2. Installation
Install all package dependencies and link workspace modules:
```bash
npm install
```

### 3. Setup Database schema (Prisma + Supabase)
Setup environment variables in a root `.env` file (copied from `.env.example`):
```bash
npx prisma db push
```

### 4. Running the Development environment
Fire up all services simultaneously using Turborepo:
```bash
npm run dev
```
- **Next.js Web App**: http://localhost:3001
- **Express REST API**: http://localhost:3002

### 5. Build and Linting
To build all applications and packages:
```bash
npm run build
```

To run ESLint and typescript validation:
```bash
npm run lint
```
