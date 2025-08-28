# TierFlow – Creator Tiers, Revenue Analytics, and Content Platform

A full-stack demo app for the creator economy that showcases tiered subscriptions, revenue analytics with optional payout smoothing, and gated content uploads. It includes a React + Vite frontend and a FastAPI backend with mock endpoints so the project runs locally end-to-end.

## Features

- Tier management (create, edit, delete) with live updates across the app
- Creator dashboards with real-time totals and 3-month revenue trends
- Revenue smoothing (optional) to defer payouts with a 6% uplift example
- Consumer dashboard with plan/benefits derived from live tiers
- Creator profile with subscription actions (increments tier subscribers)
- Video upload flow with content library (mocked storage) and tier gating
- Fully local mock backend to keep everything self-contained for demos

## Problem Statement (Context)

Creators often lack integrated tools to:

- Offer differentiated, tiered subscription plans with clear benefits
- Understand monthly revenue patterns and simulate payout smoothing
- Manage content access based on subscriber tier
- React to product changes (like plan edits) across all user-facing pages

TierFlow demonstrates how a platform can unify tier management, analytics, and content gating with a cohesive UX and a clean developer experience.

## Tech Stack (Development Tools / Libraries)

Frontend

- Vite + React + TypeScript
- Tailwind CSS
- shadcn/ui component primitives
- TanStack Query (React Query)
- Recharts (charts)
- Lucide React (icons)

Backend

- FastAPI
- Uvicorn (with reload)
- Watchfiles (autoreload)
- CORS Middleware

Tooling

- Bun/NPM (package managers supported)
- ESLint
- Vite Dev Server

## APIs (Mock Backend Endpoints)

Membership & Tiers

- GET `/tiers/{creator_id}` → list tiers
- POST `/tiers/` → create tier
- PUT `/tiers/{tier_id}` → update tier
- DELETE `/tiers/{tier_id}` → delete tier
- POST `/subscribe/` (form) / POST `/subscribe_json` (JSON) → increment `subscriberCount`

Creator Content

- POST `/content/` → upload content (multipart: file, title, description, minTier, tags, creator_id). Adds `created_at`.
- GET `/content/creator/{creator_id}` → list creator videos

Other Demo Endpoints

- GET `/dashboard/{creator_id}` → aggregated demo stats
- POST `/payout/{creator_id}` → demo payout smoothing response
- KYC: POST `/kyc/verify/{creator_id}`, GET `/kyc/status/{creator_id}`

## Assets

- `src/assets/hero-creator.jpg` (demo imagery)
- Lucide icons via `lucide-react`
- Favicon and public placeholders under `public/`

## Project Structure (Highlights)

- `backend/main.py` → FastAPI app with mock data and endpoints
- `src/` → React app
  - `pages/` → Route pages (CreatorDashboard, RevenuePage, ManageTiers, etc.)
  - `components/` → UI components, `RevenueChart` (Recharts)
  - `hooks/use-tiers.ts` → shared hook (React Query) to load tiers across pages
  - `lib/api.ts` → API client with retry + timeouts (fetchWithRetry)
  - `integrations/supabase/` → placeholder (not required for local demo)

## Quick Start (Local Development)

Prerequisites

- Node.js 18+ (or Bun 1.1+)
- Python 3.10+

1. Clone the repo

```bash
git clone https://github.com/your-team/tierflow.git
cd tierflow
```

2. Frontend setup

```bash
# install deps (npm or bun)
npm install
# or
bun install

# create .env (frontend)
cat > .env << 'EOF'
VITE_MEMBERSHIP_API_URL=http://127.0.0.1:8001
# Optional
# VITE_CONTENT_API_URL=http://127.0.0.1:8000
# VITE_API_TOKEN=
EOF
```

3. Backend setup

```bash
# from project root, run FastAPI with reload watching only the backend dir
uvicorn backend.main:app --host 0.0.0.0 --port 8001 --reload --reload-dir backend
```

Notes

- If you see “Address already in use”, stop any previous server or use another port, e.g. `--port 8002`.
- Keep the backend running in a terminal tab.

4. Run the frontend

```bash
# in another terminal
npm run dev
# or
bun dev
```

Open the app at the URL shown by Vite (typically `http://localhost:5173`).

## How Data Stays in Sync

- `use-tiers` hook centralizes tier loading via React Query. Pages use the same query key `['tiers', creatorId]`.
- `ManageTiers` mutations call `invalidateQueries(['tiers', creatorId])`, updating Creator Dashboard, Revenue Page, Creator Profile, and Consumer Dashboard.
- Uploads in `UploadVideo` call `invalidateQueries(['content', creatorId])` so the “Your Content Library” refreshes immediately.
- Subscribe actions in `CreatorProfile` hit `/subscribe_json` and invalidate the `tiers` query, bumping `subscriberCount` by 1.

## Development Notes

- Dashboard Revenue Trends (Jan–Mar) shows creator post-split revenue; Revenue Page supports optional smoothing with area overlay.
- The backend uses in-memory data for demo purposes. Restarting the server resets state.
- The API client has retry/timeouts to smooth over brief backend reloads.

## Available Scripts

Frontend

- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview production build

Backend

- `uvicorn backend.main:app --reload --port 8001` – start API server

## Public Repository

Team GitHub (replace with your public repo URL):

- https://github.com/your-team/tierflow
