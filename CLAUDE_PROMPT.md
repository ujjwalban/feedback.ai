# Feedback.ai — Full-Stack Audit & Implementation Prompt

You are an expert full-stack engineer working on **Feedback.ai**, a SaaS platform for collecting, managing, and showcasing client testimonials. Your job is to **analyze every file**, **identify all gaps and issues**, **prioritize them**, and then **fix each one** — working through the codebase methodically until the app is production-ready.

---

## Project Overview

**Feedback.ai** lets freelancers and businesses collect testimonials via shareable links, display them on a public "Wall of Love" page, embed them on external websites, and manage everything from a dashboard.

### Tech Stack
- **Framework:** Next.js 16 (App Router) with React 19
- **Language:** TypeScript (strict mode)
- **Auth & Database:** Supabase (Auth, Postgres, Storage, RLS)
- **Payments:** Stripe (subscriptions, checkout sessions)
- **Styling:** Tailwind CSS v4, shadcn/ui components, Framer Motion animations
- **Forms:** React Hook Form + Zod validation
- **Charts:** Recharts
- **Package Manager:** npm

### Deployed Structure
```
src/
├── app/
│   ├── api/checkout/route.ts          # Stripe checkout session creation
│   ├── auth/callback/route.ts         # OAuth callback handler
│   ├── dashboard/
│   │   ├── layout.tsx                 # Dashboard shell (sidebar + navbar)
│   │   ├── page.tsx                   # Overview with stats + recent testimonials
│   │   ├── analytics/page.tsx         # Charts, conversion rates, trends
│   │   ├── billing/page.tsx           # Subscription plans & Stripe integration
│   │   ├── embed/page.tsx             # Embed widget code snippets
│   │   ├── public-page/page.tsx       # Wall of Love page settings
│   │   ├── settings/page.tsx          # Profile, notifications, security tabs
│   │   └── testimonials/page.tsx      # List, delete, "AI improve" testimonials
│   ├── embed/[username]/page.tsx      # Embeddable carousel widget
│   ├── login/page.tsx                 # Email/password login
│   ├── signup/page.tsx                # Email/password signup
│   ├── onboarding/page.tsx            # Username selection (single step)
│   ├── submit/testimonial/[token]/page.tsx  # Testimonial submission form
│   ├── t/[slug]/page.tsx              # Legacy submission route
│   ├── thank-you/page.tsx             # Post-submission confirmation
│   ├── u/[username]/page.tsx          # Public Wall of Love profile
│   ├── layout.tsx                     # Root layout (Inter font, Toaster)
│   └── page.tsx                       # Landing page (hero, features, pricing)
├── components/
│   ├── dashboard/
│   │   ├── CreateLinkModal.tsx        # Dialog to create testimonial request links
│   │   ├── DashboardStats.tsx         # Reusable stats card grid
│   │   ├── Navbar.tsx                 # Top bar with user menu
│   │   ├── ProfileForm.tsx            # Profile editing with avatar upload
│   │   ├── Sidebar.tsx                # Navigation sidebar
│   │   ├── TestimonialCard.tsx        # Individual testimonial display
│   │   └── TestimonialList.tsx        # Testimonial grid with search
│   ├── landing/
│   │   ├── AnimatedBrand.tsx          # Animated logo component
│   │   └── LandingHero.tsx            # Hero section with CTA
│   └── ui/                            # shadcn/ui primitives
├── lib/
│   ├── stripe.ts                      # Stripe client initialization
│   └── utils.ts                       # cn() utility
├── types/index.ts                     # TypeScript interfaces
├── utils/supabase/
│   ├── client.ts                      # Browser Supabase client
│   └── server.ts                      # Server Supabase client
└── middleware.ts                       # Auth guard for /dashboard, /onboarding
```

### Database Schema (Supabase / Postgres)
- **`public.users`** — extends `auth.users` with `email`, `username`, `plan` (free|pro)
- **`public.profiles`** — `full_name`, `avatar_url`, `bio`, `headline`, `skills[]`, `website`, `social_links` (JSONB)
- **`public.testimonial_requests`** — shareable links with `slug`, `title`, `description`, `view_count`, `submission_count`
- **`public.testimonials`** — `client_name`, `client_company`, `rating` (1-5), `message`, `original_text`, `improved_text`, `type` (text|audio|video), `is_featured`, media URLs
- **`public.analytics_events`** — `event_type` (link_open|submission|page_view), `metadata` (JSONB)
- **`public.subscriptions`** — Stripe subscription mirror with `status`, `price_id`, period dates, cancellation fields
- **Storage bucket:** `profiles` (public, for avatars)

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_PRICE_ID
NEXT_PUBLIC_URL
```

---

## Phase 1: Audit — Analyze Every File

Read every file in the project. For each file, check for the issues listed below. Produce a structured report organized by severity.

### What to Check

**Security:**
- Exposed secrets in `.env.local` or `.env.example` (real keys should never be in example files)
- RLS policies that are too permissive (especially `WITH CHECK (true)` on INSERT)
- Missing backend input validation (client-side Zod only is not enough)
- No CSRF protection on forms
- No rate limiting on auth endpoints or public submission forms
- Missing Stripe webhook signature verification
- User enumeration via public routes (`/u/[username]`)
- Unsafe type casts (`as any`) that bypass validation
- `window.location.origin` usage vulnerable to DOM-based XSS

**Missing Features (claimed on landing page but not implemented):**
- Stripe webhook handler (`/api/webhooks/stripe`) — subscriptions never sync after payment
- Video/audio testimonial recording (buttons exist but are disabled)
- AI-powered testimonial improvement (currently a mock that appends a string)
- Email notification system (Settings tab says "In development")
- PDF export of testimonials
- Testimonial image card generator
- Stripe customer portal link for managing subscriptions
- Testimonial search, filter, and pagination
- Testimonial approval/moderation workflow
- Bulk actions on testimonials

**Database:**
- Missing indexes on foreign keys and frequently queried columns (`testimonials.user_id`, `testimonials.created_at`, `analytics_events.user_id`, `testimonial_requests.slug`)
- No CHECK constraints preventing negative `view_count`/`submission_count`
- `testimonials.message` allows NULL but should be required for text type
- No soft delete support (no `deleted_at` column)
- No audit log table
- No testimonial tags/categories table

**Code Quality:**
- No error boundary (`app/error.tsx`) or 404 page (`app/not-found.tsx`)
- No custom hooks — data fetching logic duplicated across pages
- Monolithic components (landing page 277 lines, dashboard 206 lines)
- Duplicate testimonial card rendering in multiple files
- Missing loading/error states on many pages
- `any` types in analytics and metadata fields
- Raw `<img>` tags instead of Next.js `<Image>` for optimization
- No pagination — `testimonials/page.tsx` fetches all records with `.select("*")`
- No client-side caching (React Query or SWR)

**Accessibility:**
- Icon-only buttons missing `aria-label`
- Modals missing `aria-labelledby` and focus trapping
- Star ratings use only color to indicate state
- Tab order not managed in dialogs

**Infrastructure:**
- Zero tests (no Jest, no Playwright, no test files at all)
- No CI/CD configuration (no GitHub Actions, no `vercel.json`)
- No error tracking (Sentry, LogRocket)
- No ESLint rules configured (empty `eslint.config.mjs`)
- No Prettier config
- Basic `package.json` scripts (missing `test`, `type-check`, `build:analyze`)
- README is the default Next.js boilerplate

**UX Gaps:**
- Footer links to Terms of Service and Privacy Policy point to `#`
- No password reset flow
- No account deletion
- Onboarding is a single step (username only) — should include profile setup
- Settings Notifications and Security tabs are placeholders
- Public page layout/theme customization options are disabled
- No confirmation dialog before deleting testimonials
- Embed widget missing mobile responsiveness

---

## Phase 2: Prioritize — Create an Ordered Task List

After the audit, organize findings into this priority structure:

### P0 — Critical (security vulnerabilities, data loss risks, broken core flows)
1. Fix overly permissive RLS policy on `testimonials` INSERT
2. Build Stripe webhook handler (`/api/webhooks/stripe`) for `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
3. Add backend input validation (API route-level Zod validation, not just client-side)
4. Add rate limiting to public submission endpoints and auth routes
5. Clean `.env.example` to remove real credentials

### P1 — High (missing core functionality, significant UX issues)
6. Add database indexes on all foreign keys and query columns
7. Implement real AI testimonial improvement (integrate Claude or OpenAI API)
8. Build email notification system (new testimonial received, welcome email)
9. Add pagination to testimonial list and analytics queries
10. Create `app/error.tsx` error boundary and `app/not-found.tsx`
11. Add Stripe customer portal redirect for subscription management
12. Add testimonial approval/moderation workflow (pending → approved → rejected)

### P2 — Medium (feature completeness, code quality)
13. Implement video/audio testimonial recording (MediaRecorder API + Supabase Storage)
14. Build PDF export for testimonials
15. Build testimonial image card generator (html-to-image is already a dependency)
16. Extract custom hooks: `useTestimonials()`, `useUserProfile()`, `useAnalytics()`
17. Replace raw `<img>` with Next.js `<Image>` component everywhere
18. Add client-side caching with React Query or SWR
19. Write Terms of Service and Privacy Policy pages
20. Implement password reset flow
21. Expand onboarding to multiple steps (username → profile → first link)
22. Add delete confirmation dialogs

### P3 — Low (polish, infrastructure, nice-to-haves)
23. Add Jest + React Testing Library unit tests for components
24. Add Playwright E2E tests for critical flows (signup → create link → submit testimonial → view on Wall of Love)
25. Set up GitHub Actions CI (lint, type-check, test, build)
26. Add Sentry error tracking
27. Configure ESLint and Prettier properly
28. Fix all accessibility issues (aria labels, focus management, keyboard navigation)
29. Add soft deletes and audit logging
30. Refactor monolithic components into smaller pieces
31. Add testimonial tags/categories
32. Update README with actual project documentation

---

## Phase 3: Implement — Fix Everything

Work through the task list in priority order. For each task:

1. **State what you're fixing and why** — one sentence
2. **Show the exact file(s) being modified**
3. **Write production-quality code** that matches the existing patterns:
   - Use the existing Supabase client utilities (`@/utils/supabase/server` and `@/utils/supabase/client`)
   - Use the existing Stripe client (`@/lib/stripe`)
   - Follow the existing shadcn/ui component patterns
   - Use Tailwind CSS v4 classes consistent with the codebase
   - Use React Hook Form + Zod for any new forms
   - Use TypeScript strict mode — no `any` types
   - Use the App Router patterns (server components by default, `'use client'` only when needed)
4. **Don't break existing functionality** — preserve all current behavior while adding to it
5. **After each fix, briefly confirm what changed** so progress is trackable

### Code Style Rules (match the existing codebase)
- Imports: `@/` path alias for `src/`
- Components: Functional components with arrow functions
- Async data fetching: Server components with `await createClient()` pattern
- Client interactivity: `'use client'` directive with `useState`, `useEffect`
- Error handling: `toast.error()` from sonner for user-facing errors, `console.error()` for dev
- Styling: Tailwind utility classes, `cn()` helper from `@/lib/utils`
- Naming: PascalCase components, camelCase functions/variables, kebab-case files

---

## Important Constraints

- **Do NOT delete or rewrite working code** unless it has a bug. Extend and improve.
- **Do NOT change the database schema in breaking ways.** All schema changes must be additive (new columns, new tables, new indexes). Use `IF NOT EXISTS` and `ADD COLUMN IF NOT EXISTS`.
- **Do NOT change environment variable names.** Add new ones if needed, but document them.
- **Do NOT switch libraries** (e.g., don't replace Supabase with Prisma, don't replace Stripe with LemonSqueezy). Work within the existing stack.
- **Do NOT over-engineer.** This is an early-stage SaaS — keep it simple, ship fast, iterate later.
- **Every new API route must validate inputs** with Zod on the server side.
- **Every new database query must use parameterized queries** (Supabase client handles this, but be explicit about it).

---

## Start

Begin by reading every file in the `src/` directory and the three SQL files. Then produce your audit report following the Phase 1 structure above. After the audit, confirm the priority list, then start implementing fixes from P0 downward.
