# skillbridge-frontend

Next.js 16 + React 19 + Tailwind v4 + TanStack Query frontend for SkillBridge.

## Quick start

```bash
npm install
cp .env.local.example .env.local        # API_URL settings
npm run dev                             # http://localhost:3000
```

## Environment Variables

See `.env.local` — required variables:

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (sent to browser) | `http://localhost:4000/api` |
| `API_URL_INTERNAL` | Backend API for RSC server fetches | `http://localhost:4000` |

## Seed Credentials (§12)

Use these accounts when running the backend seed (`npm run seed` in `skillbridge-backend/`):

| Role | Email | Password | Purpose |
|---|---|---|---|
| Admin | `admin@skillbridge.dev` | `Admin@12345` | Platform oversight, ban users, manage categories |
| Student | `student@skillbridge.dev` | `Student@123` | Browse tutors, book sessions, leave reviews |
| Tutor | `tutor1@skillbridge.dev` … `tutor6@skillbridge.dev` | `Tutor@123` | Create profiles, set availability, complete sessions |

## Scripts

| Script | Purpose |
|---|---|
| `dev` | Next.js dev server on port 3000 |
| `build` | Production build → `.next/` |
| `start` | Run production build |
| `lint` | ESLint check |

## Design System

- **Tailwind v4** CSS-first configuration (`src/app/globals.css`)
- **Theme tokens:** color palette (brand, ink, surface, semantic), shadows, animations
- **UI components:** Button, Input, Card, Badge, Skeleton, Spinner, Dialog, EmptyState
- **Layout components:** Navbar, Footer, DashboardSidebar, RoleGuard

## Authentication

- **JWT in HttpOnly cookies** (name: `sb_token`)
- **Server-side authentication:** `lib/auth/server.ts` → `getCurrentUser()` in RSC
- **Client-side hooks:** `useCurrentUser()`, `useLogin()`, `useRegister()`, `useLogout()`
- **Protected routes:** `/dashboard/*`, `/tutor/*`, `/admin/*` via middleware + layout guards

## API Integration

- **Client wrapper:** `lib/api/client.ts` with `credentials: 'include'`
- **API modules:** `auth`, `tutors`, `bookings`, `reviews`, `categories`, `admin`
- **Data fetching:** TanStack Query v5 (client), native `fetch` (server)
- **Validation:** zod schemas mirrored with backend

## Pages

**Public:**
- `/` — Home with 4 sections (Hero, Categories, Featured Tutors, How It Works)
- `/tutors` — Browse & filter tutors
- `/tutors/[id]` — Tutor detail with reviews & availability

**Auth:**
- `/(auth)/login` — Login form
- `/(auth)/register` — Register form with role selection

**Protected:**
- `/dashboard` — Student overview (STUDENT role)
- `/dashboard/bookings` — Manage bookings
- `/dashboard/profile` — Edit student profile
- `/tutor/dashboard` — Tutor sessions overview (TUTOR role)
- `/tutor/profile` — Edit tutor profile & categories
- `/tutor/availability` — Weekly availability editor
- `/admin` — Admin stats (ADMIN role)
- `/admin/users` — User management
- `/admin/bookings` — Booking oversight
- `/admin/categories` — Category CRUD

## State Management

- **TanStack Query:** Data fetching, caching, invalidation
- **React Hook Form + zod:** Form validation
- **Toast context:** `providers/ToastProvider.tsx` + `useToast()` hook
- **Error boundary:** `components/ErrorBoundary.tsx`

## Deployment

### Vercel
1. Create a new project, connect this repo.
2. Environment: Set `NEXT_PUBLIC_API_URL` to the Render backend URL and `API_URL_INTERNAL` to the same.
3. Deploy button → automatic build & deploy.

### Production Checklist
- [ ] `NEXT_PUBLIC_API_URL` points to production Render backend
- [ ] API cookies are `sameSite=none, secure=true` (backend-side)
- [ ] CORS single origin (backend `FRONTEND_URL` env)
- [ ] No secrets in client bundle (only `NEXT_PUBLIC_*`)

See [prd.md](../prd.md) for the full spec — design system (§7), pages (§8), state management (§9).
