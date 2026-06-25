# AVS Legal Associates — Technical Summary

> Last updated: May 2026  
> Written for: Incoming senior developers  
> Covers: `/landing-page` + `/admin-panel`

---

## Project Overview

### Purpose
AVS Legal Associates is an **online legal consultation booking platform** for Adv. R. Abirami, a practising advocate at the Madras High Court, Chennai. It allows members of the public to discover, book, and pay for legal consultations online — entirely without phone calls.

### Business Goals
- Convert website visitors into paying clients via frictionless booking
- Accept online payments (Razorpay) for consultation slots
- Automatically schedule confirmed sessions in the advocate's Cal.com calendar
- Send branded confirmation emails with meeting links
- Give the advocate a private admin dashboard to track revenue and bookings

### Main Features
- Three-tier consultation pricing with "Book Now" flows
- Multi-step booking modal: details form → Cal.com slot picker → Razorpay payment
- Automatic Cal.com booking creation via API after payment
- Supabase persistence of every booking and payment
- Resend-powered HTML email confirmation with meeting link
- Admin dashboard: revenue stats, filterable booking table, CSV export, meeting link column
- Razorpay webhook for async payment capture fallback

### Target Users
| User Type | Access |
|-----------|--------|
| Public (clients) | Landing page, booking modal, payment |
| Advocate / Admin | Admin panel (authenticated) |

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.2.6 (Turbopack) | Full-stack React framework (App Router) |
| TypeScript | ~5.x | Type safety across both apps |
| Tailwind CSS | v4 | Utility-first styling |
| Urbanist | Google Font | Landing page typography |

### Backend
- **Next.js Route Handlers** (App Router) — all API logic lives inside the same repo
- **Node.js** standard crypto module — HMAC signature verification

### Database
- **Supabase** (hosted PostgreSQL) — single `bookings` table, accessed via `@supabase/supabase-js` with service role key

### Authentication
- **NextAuth.js** — credentials provider, JWT sessions, single hardcoded admin user

### Third-Party Services
| Service | Purpose |
|---------|---------|
| Razorpay | Payment processing (orders, checkout, webhook) |
| Cal.com API v2 | Calendar scheduling and booking creation |
| Resend | Transactional email delivery |
| Supabase | PostgreSQL database + client SDK |

### Deployment Infrastructure
- **No CI/CD configured** — apps run locally with `npm run dev`
- Both apps use Next.js Turbopack dev server
- Landing page: port 3000 (or 3001 if 3000 is busy)
- Admin panel: port 3001 (or next available)
- No production deployment configuration found (Vercel/Docker/etc. not yet set up)

---

## Repository Structure

```
avs-legal/                          ← Monorepo root (no package.json at root)
├── landing-page/                   ← Public-facing website + booking API
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/ ← NextAuth catch-all handler
│   │   │   ├── create-order/       ← Razorpay order creation
│   │   │   ├── verify-payment/     ← Payment verification + Cal.com + email
│   │   │   ├── webhook/razorpay/   ← Razorpay async webhook
│   │   │   └── dashboard/          ← Internal dashboard API routes (bookings, stats, cal-bookings) — mostly empty
│   │   ├── dashboard/              ← Protected admin-lite pages (within landing-page app)
│   │   ├── login/                  ← Login page
│   │   ├── globals.css
│   │   ├── layout.tsx              ← Root HTML, fonts, Razorpay script tag
│   │   └── page.tsx                ← Single-page landing app (all sections)
│   ├── components/                 ← All UI components
│   ├── lib/
│   │   ├── auth.ts                 ← NextAuth authOptions
│   │   ├── cal.ts                  ← Cal.com v2 API booking helper
│   │   ├── supabase.ts             ← Supabase client factory
│   │   └── utils.ts                ← Amount + date formatters
│   ├── supabase/                   ← DB migrations / schema SQL
│   ├── .env.local                  ← All secrets (do NOT commit)
│   ├── next.config.ts              ← CSP headers, config
│   └── proxy.ts                    ← Dev-only proxy config
│
└── admin-panel/                    ← Private admin dashboard
    ├── app/
    │   ├── api/auth/               ← NextAuth handler
    │   ├── dashboard/
    │   │   ├── bookings/           ← Full bookings list with filters
    │   │   ├── calendar/           ← Calendar view page
    │   │   ├── payments/           ← Payments view page
    │   │   ├── layout.tsx          ← Sidebar + auth guard
    │   │   └── page.tsx            ← Overview: stats + recent bookings
    │   ├── login/                  ← Admin login form
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx                ← Redirect → /dashboard
    ├── components/
    │   ├── BookingsTable.tsx        ← Client component: filterable table, CSV export
    │   └── Sidebar.tsx             ← Navigation sidebar
    └── lib/
        ├── auth.ts                 ← NextAuth authOptions (same pattern as landing)
        └── supabase.ts             ← Supabase client (service role, always-on)
```

> **Note:** Both apps share the same Supabase project and admin credentials via env vars, but are completely separate Next.js applications with no shared `node_modules`.

---

## Application Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Public Browser                      │
│   Landing Page (Next.js) → Booking Modal            │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS
         ┌───────────▼──────────────────┐
         │   Next.js Route Handlers     │
         │   /api/create-order          │
         │   /api/verify-payment        │
         │   /api/webhook/razorpay      │
         └──┬──────────┬───────┬───────┘
            │          │       │
     ┌──────▼─┐  ┌─────▼──┐  ┌▼──────────┐
     │Razorpay│  │Supabase│  │ Cal.com   │
     │Checkout│  │  DB    │  │  API v2   │
     └────────┘  └────────┘  └───────────┘
                     │
              ┌──────▼──────┐
              │   Resend    │
              │  (email)    │
              └─────────────┘

┌──────────────────────────┐
│  Admin Panel (Next.js)   │  ← Separate app, same Supabase
│  /dashboard/*            │
└──────────────────────────┘
```

### Data Flow (Booking)

```
User fills form (Step 1)
        │
        ▼
Cal.com iframe loads (Step 2) — user picks slot
        │
        ▼ (bookingSuccessful postMessage OR manual click)
User clicks "Pay with Razorpay"
        │
        ▼
POST /api/create-order → Razorpay order created → orderId returned
        │
        ▼
Razorpay checkout opens in browser overlay
        │
        ▼ (on payment success)
Razorpay calls handler(response) with payment_id + signature
        │
        ▼
POST /api/verify-payment
  ├── HMAC signature verified
  ├── Cal.com booking resolved (from embed data OR API call)
  ├── Record upserted in Supabase bookings table
  ├── Confirmation email sent via Resend
  └── Success screen shown to user
        │
        ▼ (async fallback)
POST /api/webhook/razorpay — payment.captured event → upsert to Supabase
```

---

## Frontend Analysis

### Routing Structure

**Landing Page (Single Page Application)**
```
/              → Home (all sections rendered in page.tsx)
/login         → Admin login
/dashboard/*   → Protected admin-lite view (within landing-page app)
```

**Admin Panel**
```
/              → Redirect to /dashboard
/login         → Admin login
/dashboard     → Overview (stats + recent bookings)
/dashboard/bookings   → Full bookings table with filters
/dashboard/calendar   → Calendar view
/dashboard/payments   → Payments view
```

### Layout System
- Landing page: Single `RootLayout` with Urbanist font + Razorpay `<script>` preloaded globally
- Admin panel: `DashboardLayout` wraps all `/dashboard/*` routes with `Sidebar` + auth session guard
- Both use Tailwind CSS with custom color tokens (`navy-950`, `gold-400`, `navy-800`)

### State Management
- **No global state library** — all state is React `useState`/`useRef`
- Modal open state lives in `app/page.tsx` (`modalOpen`, `selectedPlan`)
- `BookingModal` manages its own multi-step form state locally
- Admin dashboard pages are Server Components fetching directly from Supabase

### Major Pages

| Page | Type | Description |
|------|------|-------------|
| `/` | Client Component | Full landing page with all sections |
| `BookingModal` | Client Component | 2-step booking flow (details → Cal.com iframe + payment) |
| `/dashboard` | Server Component | Stats cards + recent 5 bookings |
| `/dashboard/bookings` | Server + Client | Filterable bookings table with CSV export |

### Reusable Components (Landing Page)

| Component | Purpose |
|-----------|---------|
| `Navbar` | Fixed top nav with "Book Consultation" CTA; scroll-aware blur |
| `Hero` | Hero section with headline and CTA buttons |
| `Stats` | Social proof numbers |
| `Plans` | 3 pricing cards; each "Book Now" opens `BookingModal` with pre-selected plan |
| `HowItWorks` | Step-by-step process explanation |
| `Testimonials` | Client testimonials |
| `About` | Advocate bio section |
| `FAQ` | Accordion-style FAQ |
| `FinalCTA` | Bottom conversion section |
| `MobileCTA` | Sticky bottom bar on mobile (`pb-[88px]` on `<main>` to avoid overlap) |
| `Footer` | Site footer |
| `BookingModal` | Main booking + payment modal |

---

## Backend Analysis

### API Routes

#### `POST /api/create-order`
- Creates a Razorpay order for the selected consultation plan
- Maps plan name → paise amount via regex matching
- Stores client metadata in Razorpay order `notes` (name, email, phone, plan, query, date, time)
- Returns: `{ orderId, amount, currency, key }`

#### `POST /api/verify-payment`
- Primary payment verification endpoint called by Razorpay's `handler` callback
- Verifies HMAC-SHA256 signature (`orderId|paymentId` signed with key secret)
- If `calBookingData` present → extracts uid/videoCallUrl from Cal.com embed event data
- Else if `date` + `time` present → calls `createCalBooking()` in `lib/cal.ts`
- Upserts booking to Supabase (conflict on `payment_id`)
- Sends branded HTML email via Resend with meeting link or scheduling fallback link
- Returns: `{ success: true, meetingUrl }`

#### `POST /api/webhook/razorpay`
- Receives Razorpay webhook events (async, server-to-server)
- Verifies `x-razorpay-signature` header HMAC
- Handles only `payment.captured` event
- Upserts minimal booking record to Supabase
- Acts as **fallback** if client-side verify-payment call fails

#### `GET|POST /api/auth/[...nextauth]`
- Standard NextAuth.js catch-all route
- Handles signin, signout, session, CSRF

### Services / Lib Layer

| File | Exports | Purpose |
|------|---------|---------|
| `lib/auth.ts` | `authOptions` | NextAuth config: credentials provider, JWT, redirect to `/login` |
| `lib/cal.ts` | `createCalBooking()` | Creates Cal.com booking via REST API v2; handles IST→UTC conversion |
| `lib/supabase.ts` | `supabaseAdmin()` | Returns Supabase client or `null` if env missing |
| `lib/utils.ts` | `formatAmount()`, `formatDate()`, `formatDateTime()` | Locale-aware formatters |

### Middleware / Validation
- No custom `middleware.ts` — route protection done via `getServerSession` inside pages/layouts
- Input validation in `BookingModal`: regex-based for name, phone, email
- Payment signature verified with `crypto.createHmac` on every `/api/verify-payment` call

---

## Database Analysis

### Database Type
**Supabase** (managed PostgreSQL), accessed exclusively with the **service role key** (bypasses RLS).

### Main Table: `bookings`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key, auto-generated |
| `payment_id` | text | **Unique** — Razorpay payment ID (`pay_xxx`) |
| `order_id` | text | Razorpay order ID (`order_xxx`) |
| `name` | text | Client full name |
| `email` | text | Client email |
| `phone` | text | Client phone number |
| `plan` | text | Consultation type name |
| `amount` | integer | Amount in **paise** (divide by 100 for ₹) |
| `query` | text | Optional legal query description |
| `date` | text | Appointment date `YYYY-MM-DD` |
| `time` | text | Time slot string e.g. `"10:00 AM"` |
| `cal_booking_uid` | text | Cal.com booking UUID |
| `meeting_url` | text | Cal.com video call URL |
| `status` | text | `"paid"` / `"pending"` / `"failed"` |
| `created_at` | timestamptz | Auto-set by Supabase |

### Upsert Strategy
All writes use `.upsert({ ... }, { onConflict: "payment_id" })` — idempotent, safe for webhook retries.

---

## Authentication & Authorization

### Login Flow
1. User visits `/login`
2. Submits email + password form
3. NextAuth CredentialsProvider checks against `ADMIN_EMAIL` + `ADMIN_PASSWORD` env vars
4. On match: JWT session token issued, user redirected to `/dashboard`

### User Roles
**Single role: Admin.** No RBAC.

### Permission System
- Dashboard layout reads `getServerSession(authOptions)` server-side
- If no session → redirects to `/login`

### Session / Token Management
- Strategy: **JWT** (no database sessions)
- Secret: `NEXTAUTH_SECRET` env var
- Default expiry: 30 days (NextAuth default)

---

## Integrations

### Razorpay

| Detail | Value |
|--------|-------|
| SDK | `razorpay` npm (server), CDN script (client) |
| Mode | Test keys configured (need live keys for production) |
| Flow | Create order → Checkout overlay → Verify signature |
| Webhook | `POST /api/webhook/razorpay` for `payment.captured` |
| Client Script | Loaded globally in `layout.tsx` |

### Cal.com

| Detail | Value |
|--------|-------|
| API Version | v2 (`cal-api-version: 2024-08-13`) |
| Account | `abiramiadvocate` |
| Event Types | 15min (ID: 5807967), 30min (ID: 5807966) |
| Integration | Iframe embed in BookingModal + API booking via `lib/cal.ts` fallback |
| Booking Detection | `bookingSuccessful` `window.postMessage` from iframe |

**Plan → Cal.com Event Mapping:**

| Plan | Amount | Cal.com Event | Event ID |
|------|--------|--------------|---------|
| Legal Doubt Clearance | ₹300 | `15min` | 5807967 |
| Quick Legal Consultation | ₹500 | `15min` | 5807967 |
| Detailed Legal Consultation | ₹2,000 | `30min` | 5807966 |

> Note: No 10min or 45min event types exist. Closest available are used.

### Resend

| Detail | Value |
|--------|-------|
| SDK | `resend` npm package |
| From | `noreply@avslegal.in` |
| Trigger | After successful Razorpay payment verification |
| Content | Booking details + meeting link (green "Join Meeting" if Cal confirmed, fallback link otherwise) |

---

## Environment Variables

### Landing Page

| Variable | Purpose | Required |
|----------|---------|---------|
| `RAZORPAY_KEY_ID` | Razorpay API key (server) | ✅ |
| `RAZORPAY_KEY_SECRET` | Razorpay secret for HMAC signing | ✅ |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook signature verification | ⚠️ (empty = webhook unprotected) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay key sent to client | ✅ |
| `SUPABASE_URL` | Supabase project URL | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin access key | ✅ |
| `NEXTAUTH_SECRET` | JWT signing secret | ✅ |
| `NEXTAUTH_URL` | Base URL for auth callbacks | ✅ |
| `ADMIN_EMAIL` | Admin login email | ✅ |
| `ADMIN_PASSWORD` | Admin login password (plain text) | ✅ |
| `RESEND_API_KEY` | Resend email API key | ✅ |
| `CAL_API_KEY` | Cal.com live API key | ✅ |
| `CAL_EVENT_TYPE_ID_10MIN` | Cal.com event ID for ₹300 plan | Optional (default: 5807967) |
| `CAL_EVENT_TYPE_ID_15MIN` | Cal.com event ID for ₹500 plan | Optional (default: 5807967) |
| `CAL_EVENT_TYPE_ID_45MIN` | Cal.com event ID for ₹2,000 plan | Optional (default: 5807966) |
| `CAL_LINK_10MIN` | Fallback scheduling URL for ₹300 | Optional |
| `CAL_LINK_15MIN` | Fallback scheduling URL for ₹500 | Optional |
| `CAL_LINK_45MIN` | Fallback scheduling URL for ₹2,000 | Optional |

### Admin Panel

| Variable | Purpose | Required |
|----------|---------|---------|
| `SUPABASE_URL` | Same Supabase project | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Same service role key | ✅ |
| `NEXTAUTH_SECRET` | JWT secret (must match landing) | ✅ |
| `NEXTAUTH_URL` | Admin panel URL | ✅ |
| `ADMIN_EMAIL` | Admin login email | ✅ |
| `ADMIN_PASSWORD` | Admin login password | ✅ |
| `CAL_API_KEY` | Cal.com API key | Optional |

---

## Business Logic

### Core Workflows

#### 1. Plan → Amount Mapping
```
"Legal Doubt Clearance"     → ₹300   → 30,000 paise
"Quick Legal Consultation"  → ₹500   → 50,000 paise
"Detailed*" (regex)         → ₹2,000 → 200,000 paise
```
Determined by regex matching (`/detailed/i`, `/quick/i`, `/doubt/i`) in both `create-order` and `verify-payment`. Fragile — changing plan names requires updating regex in two places.

#### 2. Booking Modal (2-Step Flow)
**Step 1:** Name, Phone, Email, Plan, Query → validated → Continue
**Step 2:** Cal.com iframe (prefilled URL params) → `bookingSuccessful` postMessage → button turns green → user clicks Pay → Razorpay → verify → save → email → success screen

#### 3. Cal.com Timezone Conversion (`lib/cal.ts`)
```
IST slot "10:00 AM" on "2026-06-01"
→ Date.UTC(2026, 5, 1, 10, 0, 0) - 330min (5h30m)
→ UTC ISO string for Cal.com API
```

#### 4. Payment Verification
- HMAC-SHA256: `orderId + "|" + paymentId` signed with `RAZORPAY_KEY_SECRET`
- Must match `razorpay_signature` in request body

#### 5. Email Decision Tree
```
calBookingUid exists?
  YES → "Join Meeting →" (green) + confirmed appointment time
  NO  → "Book Appointment →" (dark) with scheduling link
```

---

## Admin Panel

### Main Modules
| Module | Route | Description |
|--------|-------|-------------|
| Overview | `/dashboard` | Revenue, booking counts, 5 recent bookings |
| Bookings | `/dashboard/bookings` | Full filtered table with CSV export |
| Calendar | `/dashboard/calendar` | Calendar view |
| Payments | `/dashboard/payments` | Payments view |

### Management Features
- Filter bookings by: plan name, status, date range
- View meeting links directly in the table ("Join Meeting" link)
- Export filtered bookings to CSV (includes all fields + Cal UID + meeting URL)

### Reporting
- Total Revenue (sum of paid amounts)
- Total bookings count
- This month count
- Upcoming sessions count

---

## API Documentation

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/create-order` | POST | None | Create Razorpay order |
| `/api/verify-payment` | POST | None | Verify payment + save + email |
| `/api/webhook/razorpay` | POST | HMAC header | Async payment capture fallback |
| `/api/auth/[...nextauth]` | GET/POST | NextAuth | Auth endpoints |

---

## Security Review

### ⚠️ Concerns

| Issue | Severity | Description |
|-------|----------|-------------|
| Plain-text admin password | 🔴 High | `ADMIN_PASSWORD` plain text in env. No hashing |
| Test-mode Razorpay keys | 🔴 High | `rzp_test_*` keys — no live payments possible |
| Missing webhook secret | 🟡 Medium | `RAZORPAY_WEBHOOK_SECRET` is empty — endpoint unprotected |
| No rate limiting | 🟡 Medium | `/api/create-order` has no rate limiting |
| Supabase service role | 🟡 Medium | Bypasses RLS — full DB access if key leaks |
| CSP `unsafe-inline` + `unsafe-eval` | 🟢 Low | Required for Razorpay/Cal.com |

### Recommended Improvements
1. Hash admin password with bcrypt
2. Switch to Razorpay live keys
3. Set `RAZORPAY_WEBHOOK_SECRET`
4. Add rate limiting on `/api/create-order`
5. Add Supabase RLS policies as defence-in-depth

---

## Performance Review

### Bottlenecks
- `/api/verify-payment` makes 3 sequential async calls (Supabase → Cal.com → Resend)
- Cal.com iframe is an external dependency in the booking modal — adds load time
- No image optimization (`next/image` not used)

### Optimization Opportunities
- Parallelize Supabase upsert + Resend email with `Promise.all()`
- Use `next/image` for all images
- Pre-warm Cal.com iframe while user is on Step 1
- Add `export const revalidate = 30` to admin dashboard pages

---

## Known Issues

### Bugs
- Cal.com slot booked in Cal.com **before** Razorpay payment completed (ordering issue — slot reserved, payment is optional from Cal.com's perspective)
- `RAZORPAY_WEBHOOK_SECRET` is empty — webhook endpoint accepts any POST request without signature verification

### Technical Debt
- `app/api/dashboard/bookings/` and `app/api/dashboard/stats/` directories exist but are **empty** — never implemented
- Plan names are string-matched by regex in two separate API files — brittle coupling
- No unit tests, integration tests, or E2E tests
- No error monitoring (Sentry, etc.)
- Cal.com event type IDs hardcoded as fallback defaults in `lib/cal.ts`

### Missing Features
- Appointment reminder emails
- Cancellation / rescheduling flow
- Admin ability to manually create/edit bookings
- Analytics integration
- Production deployment configuration (Vercel, Dockerfile, etc.)

---

## Deployment

### Build Commands
```bash
cd landing-page && npm run build && npm start
cd admin-panel  && npm run build && npm start
```

### Pre-Production Checklist
- [ ] Switch Razorpay to live keys
- [ ] Set `NEXTAUTH_URL` to production domain
- [ ] Set `RAZORPAY_WEBHOOK_SECRET` + register webhook in Razorpay dashboard
- [ ] Change `ADMIN_EMAIL` / `ADMIN_PASSWORD` from defaults
- [ ] Verify Cal.com event types exist and IDs are correct
- [ ] Configure custom domain + SSL

### Recommended Hosting
**Vercel** (zero-config for Next.js). Deploy both apps as separate Vercel projects. Set all env vars in Vercel dashboard — never commit `.env.local`.

---

## Developer Notes

### Critical Files

| File | Why It Matters |
|------|---------------|
| `landing-page/components/BookingModal.tsx` | Core UX — entire booking + Cal.com + Razorpay flow |
| `landing-page/app/api/verify-payment/route.ts` | Most critical API — verification + Cal.com + email + DB |
| `landing-page/lib/cal.ts` | Cal.com API integration + IST→UTC conversion |
| `landing-page/next.config.ts` | CSP headers — update if adding new external services |
| `landing-page/components/Plans.tsx` | Plan names/prices — changes here require matching API regex updates |
| `admin-panel/components/BookingsTable.tsx` | All admin booking management UI |

### Areas Requiring Caution

1. **Plan name strings** — must match regex in `create-order` and `verify-payment`. Renaming plans requires updating both files.

2. **Razorpay amount is paise** — all internal amounts are paise (×100). Display code must divide by 100.

3. **Cal.com timezone** — `lib/cal.ts` subtracts 330 minutes for IST→UTC. Safe for India (no DST); revisit for international clients.

4. **Cal.com postMessage format** — if Cal.com changes their embed event format, `bookingSuccessful` detection breaks silently. Manual pay button is the safety net.

5. **Service role key is server-only** — never expose in client-side code or `NEXT_PUBLIC_*` variables.

6. **Single admin user** — no user management system exists. Adding multiple admins requires building proper auth.
