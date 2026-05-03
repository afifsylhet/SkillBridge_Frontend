# SkillBridge — Frontend

The web client for the SkillBridge tutor-marketplace platform. Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **TanStack Query v5**, with end-to-end type safety, server-rendered routes, and a cohesive design system.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Routing & Pages](#routing--pages)
- [Authentication](#authentication)
- [Data Fetching & State](#data-fetching--state)
- [Design System](#design-system)
- [Forms & Validation](#forms--validation)
- [Seed Credentials](#seed-credentials)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Overview

The SkillBridge frontend delivers the public marketplace, the authenticated student / tutor experiences, and the admin console. It pairs server-rendered marketing and detail pages with client-driven dashboards, sharing a single typed API client against the [SkillBridge backend](../skillbridge-backend/README.md).

**Highlights**

- App Router with server components for fast first paint and SEO-friendly tutor pages
- HttpOnly-cookie session reused on both server (RSC) and client (TanStack Query)
- Tailwind v4 CSS-first config with a tokenized theme (brand, ink, surface, semantic)
- Strict TypeScript with shared Zod validators mirrored from the backend contracts
- Role-aware layouts and middleware-protected routes

---

## Tech Stack

| Layer            | Technology                                |
| ---------------- | ----------------------------------------- |
| Framework        | Next.js 16 (App Router, RSC)              |
| UI runtime       | React 19                                  |
| Language         | TypeScript 5 (strict)                     |
| Styling          | Tailwind CSS v4 (CSS-first config)        |
| Data fetching    | TanStack Query v5 + native `fetch`        |
| Validation       | Zod (mirrored with backend)               |
| Utilities        | `clsx`, `tailwind-merge`                  |
| Tooling          | ESLint 9, `eslint-config-next`            |

> ⚠️ **Note on Next.js 16:** This project uses Next.js 16, which contains breaking changes from earlier versions. Refer to the in-tree docs at `node_modules/next/dist/docs/` and project guidance in [`AGENTS.md`](AGENTS.md) before touching framework code.

---

## Getting Started

### Prerequisites

- Node.js **20+** (22 recommended to match the backend)
- A running [SkillBridge backend](../skillbridge-backend/README.md) (default `http://localhost:4000`)

### Installation

```bash
npm install
cp .env.local.example .env.local        # then fill API URLs
npm run dev                              # → http://localhost:3000
```

The dev server starts on port `3000` and proxies API calls to the backend defined by `NEXT_PUBLIC_API_URL`.

---

## Environment Variables

Configured in `.env.local`. Required:

| Variable               | Required | Description                                                                 | Dev example                   | Production example                            |
| ---------------------- | :------: | --------------------------------------------------------------------------- | ----------------------------- | --------------------------------------------- |
| `NEXT_PUBLIC_API_URL`  |    ✓     | Base URL the **browser** uses for API calls. Use a **relative** path in production so requests flow through the Next.js proxy and cookies land on this origin. | `http://localhost:4000/api`   | `/api`                                        |
| `API_URL_INTERNAL`     |    ✓     | Absolute backend URL used by server components, server actions, and the `/api/[...path]` proxy route. Must point at the real backend. | `http://localhost:4000`       | `https://skillbridge-backend-three.vercel.app` |

> `NEXT_PUBLIC_*` values are inlined into the client bundle. Never put secrets behind that prefix.

### Why the proxy?

In production the frontend and backend live on different `*.vercel.app` subdomains. Because `vercel.app` is on the [Public Suffix List](https://publicsuffix.org/), a backend cookie can never be scoped to the frontend's domain. To fix this, [src/app/api/[...path]/route.ts](src/app/api/[...path]/route.ts) is a catch-all proxy that forwards every `/api/*` request to the real backend (via `API_URL_INTERNAL`) and pipes the response — `Set-Cookie` headers and all — back to the browser. The browser only ever sees the frontend origin, so cookies are stored on the frontend domain and the RSC `cookies()` API can read them.

The trade-off: every API call is one extra network hop on Vercel. For local development you can set `NEXT_PUBLIC_API_URL=http://localhost:4000/api` to bypass the proxy entirely (cookies "just work" because both ports share the `localhost` host).

---

## Scripts

| Script           | Purpose                                                |
| ---------------- | ------------------------------------------------------ |
| `npm run dev`    | Start the Next.js dev server (port 3000)               |
| `npm run build`  | Production build → `.next/`                            |
| `npm start`      | Serve the production build                             |
| `npm run lint`   | Run ESLint with the Next.js shareable config           |

---

## Project Structure

```
skillbridge-frontend/
├── public/                       # static assets
└── src/
    ├── app/                      # App Router tree
    │   ├── layout.tsx            # root layout (providers, fonts)
    │   ├── page.tsx              # marketing home
    │   ├── error.tsx             # global error boundary
    │   ├── loading.tsx           # global suspense fallback
    │   ├── not-found.tsx
    │   ├── (auth)/               # login • register
    │   ├── tutors/               # public browse + detail
    │   ├── dashboard/            # student-protected
    │   ├── tutor/                # tutor-protected
    │   └── admin/                # admin-protected
    ├── components/
    │   ├── ui/                   # Button, Input, Card, Badge, Dialog, …
    │   ├── layout/               # Navbar, Footer, DashboardSidebar, RoleGuard
    │   ├── home/                 # landing-page sections
    │   ├── tutors/               # browse + detail UI
    │   ├── booking/              # booking flow widgets
    │   ├── forms/                # composed form blocks
    │   ├── ErrorBoundary.tsx
    │   └── LoadingSkeletons.tsx
    ├── lib/
    │   ├── api/                  # typed client + per-resource modules
    │   ├── auth/                 # server + client auth helpers
    │   ├── validators/           # Zod schemas (mirror backend)
    │   ├── hooks/                # reusable client hooks
    │   ├── constants/
    │   ├── utils/
    │   └── env.ts                # env access (validated)
    ├── providers/                # Query, Toast, Theme providers
    ├── types/
    └── proxy.ts
```

---

## Routing & Pages

### Public

| Path             | Description                                                        |
| ---------------- | ------------------------------------------------------------------ |
| `/`              | Marketing home (Hero, Categories, Featured Tutors, How It Works)   |
| `/tutors`        | Browse and filter tutors by category, rate, and rating             |
| `/tutors/[id]`   | Tutor detail with bio, availability, and reviews                   |

### Auth

| Path                  | Description                                  |
| --------------------- | -------------------------------------------- |
| `/(auth)/login`       | Email + password sign-in                     |
| `/(auth)/register`    | Account creation with role selection         |

### Protected — Student (`STUDENT`)

| Path                     | Description                          |
| ------------------------ | ------------------------------------ |
| `/dashboard`             | Overview                             |
| `/dashboard/bookings`    | Manage upcoming and past bookings    |
| `/dashboard/profile`     | Edit student profile                 |

### Protected — Tutor (`TUTOR`)

| Path                       | Description                                |
| -------------------------- | ------------------------------------------ |
| `/tutor/dashboard`         | Sessions overview                          |
| `/tutor/profile`           | Edit tutor profile and categories          |
| `/tutor/availability`      | Weekly recurring availability editor       |

### Protected — Admin (`ADMIN`)

| Path                  | Description                       |
| --------------------- | --------------------------------- |
| `/admin`              | Platform stats                    |
| `/admin/users`        | User management & moderation      |
| `/admin/bookings`     | Booking oversight                 |
| `/admin/categories`   | Category CRUD                     |

---

## Authentication

- **Transport:** JWT delivered as an `HttpOnly` cookie (`sb_token`) by the backend.
- **Server side:** [`lib/auth/server.ts`](src/lib/auth/server.ts) exposes `getCurrentUser()` for use in server components and server actions.
- **Client side:** Hooks `useCurrentUser()`, `useLogin()`, `useRegister()`, and `useLogout()` wrap the API client and integrate with TanStack Query's cache.
- **Protected routes:** Enforced both at the middleware layer and via per-segment layout guards (`<RoleGuard role="…">`).
- **Cookies on requests:** Every API call uses `credentials: 'include'`. Configure CORS / cookie flags accordingly on the backend.

---

## Data Fetching & State

- **Server fetches** — native `fetch` from RSC against `API_URL_INTERNAL`, with cache directives chosen per-route (e.g. `no-store` for personalized data, ISR for tutor lists).
- **Client fetches** — TanStack Query v5 keyed per-resource, with `invalidateQueries` after every mutation that affects a list view.
- **API client** — [`lib/api/client.ts`](src/lib/api/client.ts) wraps `fetch` with cookie credentials, JSON parsing, and a uniform error envelope.
- **Resource modules** — `auth`, `tutors`, `bookings`, `reviews`, `categories`, `admin` each export typed call signatures.
- **Toasts** — `providers/ToastProvider` + `useToast()` for success / error notifications.
- **Errors** — `components/ErrorBoundary.tsx` captures render-time failures; the App Router `error.tsx` handles route-level crashes.

---

## Design System

- **Tailwind v4** with the CSS-first configuration in [`src/app/globals.css`](src/app/globals.css)
- **Theme tokens:** brand, ink, surface, and semantic colors; shadows; motion
- **Plugins:** `@tailwindcss/forms`, `@tailwindcss/typography`
- **UI primitives** (`components/ui/`): `Button`, `Input`, `Card`, `Badge`, `Skeleton`, `Spinner`, `Dialog`, `EmptyState`, …
- **Layout** (`components/layout/`): `Navbar`, `Footer`, `DashboardSidebar`, `RoleGuard`
- **Class composition:** `clsx` + `tailwind-merge` for safe class merging

---

## Forms & Validation

- **Schemas:** Zod definitions in `lib/validators/` mirror the backend's Zod schemas — change them together.
- **Submission:** Forms call typed API modules from `lib/api/`; server-side validation errors are surfaced inline using the structured error envelope.

---

## Seed Credentials

Use these accounts after running `npm run seed` in the [backend](../skillbridge-backend/README.md):

| Role    | Email                                            | Password      |
| ------- | ------------------------------------------------ | ------------- |
| Admin   | `admin@skillbridge.dev`                          | `Admin@12345` |
| Student | `student@skillbridge.dev`                        | `Student@123` |
| Tutor   | `tutor1@skillbridge.dev` … `tutor6@skillbridge.dev` | `Tutor@123`   |

---

## Deployment

### Vercel (recommended)

1. **Import project** from this repository.
2. **Root directory:** `skillbridge-frontend`.
3. **Environment variables:**
   - `NEXT_PUBLIC_API_URL` — public backend URL (e.g. `https://api.skillbridge.dev/api`)
   - `API_URL_INTERNAL` — same URL or an internal-only origin if available
4. **Build command:** `npm run build` _(default)_
5. **Output:** `.next` _(default — Vercel handles it automatically)_

### Production checklist

- [ ] `NEXT_PUBLIC_API_URL` and `API_URL_INTERNAL` point to the production backend
- [ ] Backend `FRONTEND_URL` matches this deployment's origin (single-origin CORS)
- [ ] Backend cookies issued with `sameSite=none; secure=true`
- [ ] No secrets behind the `NEXT_PUBLIC_*` prefix
- [ ] Custom domain configured with HTTPS
- [ ] Lint and build pass on the deployment branch

---

## Troubleshooting

| Symptom                                                | Likely cause / fix                                                                                |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `401 Unauthorized` after login                         | Cookie not being sent — verify `credentials: 'include'` and that the API URL matches CORS origin |
| Login succeeds but redirect to dashboard bounces back to `/login` (Vercel) | Cross-subdomain cookie problem. Set `NEXT_PUBLIC_API_URL=/api` and `API_URL_INTERNAL=<backend>` so requests flow through the proxy |
| Tutor list is empty in production but works locally    | Backend not seeded, or `NEXT_PUBLIC_API_URL` points to a different environment                    |
| RSC fetch hangs                                        | `API_URL_INTERNAL` unreachable from the server runtime — check VPC / firewall                     |
| Tailwind classes not applied                           | Verify the file is included by the v4 content scan in `globals.css`                               |
| `Hydration failed` warnings                            | Ensure server and client render the same content; avoid `Date.now()` / `Math.random()` in RSC    |

---

## License

Private — internal project. All rights reserved.
