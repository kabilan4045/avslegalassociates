# AVS Legal Associates — Technical Project Summary

> **Last updated:** 29 June 2026  
> **Audience:** Developers implementing or extending this project  
> **Stack:** Next.js 16 · TypeScript · Tailwind CSS v4 · Razorpay · Cal.com API v2 · Resend · NextAuth.js

---

## Table of Contents

1. [Stack — Specification vs Actual](#1-stack--specification-vs-actual)
2. [Folder Structure](#2-folder-structure)
3. [Routes & Pages](#3-routes--pages)
4. [Data Models](#4-data-models)
5. [API Routes](#5-api-routes)
6. [Component Breakdown](#6-component-breakdown)
7. [State Management](#7-state-management)
8. [Auth Flow](#8-auth-flow)
9. [Booking Logic](#9-booking-logic)
10. [Email Notifications](#10-email-notifications)
11. [Environment Variables](#11-environment-variables)
12. [Third-party Integrations](#12-third-party-integrations)
13. [Edge Cases & Mitigations](#13-edge-cases--mitigations)

---

## 1. Stack — Specification vs Actual

The project diverges from the initial spec in several meaningful ways. This table documents what was requested versus what is in the codebase, so you know exactly what exists and what still needs to be built.

| Category | Spec | Actual | Status |
|---|---|---|---|
| Framework | Next.js 14+ App Router | Next.js **16.2.6** App Router | ✅ Exists |
| Language | TypeScript | TypeScript 5 | ✅ Exists |
| Styling | Tailwind CSS | Tailwind CSS **v4** | ✅ Exists |
| UI Components | shadcn/ui | Custom components (no shadcn) | ⚠️ Gap |
| Database | PostgreSQL + Prisma ORM | **None — stateless architecture** | ⚠️ Gap |
| Auth | NextAuth (email + Google OAuth) | NextAuth — **credentials only (admin)** | ⚠️ Partial |
| Calendar | React Big Calendar or Cal.com | Custom calendar + **Cal.com API v2** | ✅ Exists |
| Email | Resend or Nodemailer | **Resend** | ✅ Exists |
| Payments | Stripe (optional) | **Razorpay** (required — India) | ✅ Exists |
| Deployment | Vercel | Vercel | ✅ Exists |
| Admin Dashboard | Full booking management | **Stub** — links to Cal.com + Razorpay | ⚠️ Gap |

> **⚠️ Stateless architecture:** The app currently stores no booking data. Cal.com is the source of truth for appointments; Razorpay is the source of truth for payments. If you need in-app booking history, reporting, or a custom admin dashboard, a database (Prisma + PostgreSQL) must be added. Section 4 provides a ready-to-use Prisma schema.

---

## 2. Folder Structure

App Router convention. Server Components by default; `"use client"` added only at interaction boundaries. Green-marked entries need to be created to close the gaps in Section 1.

```
avs-legal/
├── app/                          # Next.js App Router root
│   ├── layout.tsx                # Root layout (fonts, global styles, Razorpay <Script>)
│   ├── page.tsx                  # Landing page  [Client Component — modal state]
│   ├── globals.css
│   ├── favicon.ico
│   ├── login/
│   │   └── page.tsx              # NextAuth sign-in redirect target
│   ├── disclaimer/page.tsx
│   ├── privacy-policy/page.tsx
│   ├── refund-policy/page.tsx    # Required by Razorpay
│   ├── terms/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx            # Auth guard  [Server Component]
│   │   ├── login/page.tsx        # Admin login form
│   │   └── page.tsx              # Admin stub (links to Cal.com + Razorpay)
│   └── api/
│       ├── auth/[...nextauth]/
│       │   └── route.ts          # NextAuth handler
│       ├── cal/slots/
│       │   └── route.ts          # Proxy to Cal.com availability API
│       ├── create-order/
│       │   └── route.ts          # Razorpay order creation
│       ├── verify-payment/
│       │   └── route.ts          # HMAC verify → Cal.com booking → email
│       └── webhook/razorpay/
│           └── route.ts          # Razorpay webhook (signature verify)
│
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Stats.tsx
│   ├── Plans.tsx
│   ├── HowItWorks.tsx
│   ├── Testimonials.tsx
│   ├── FAQ.tsx
│   ├── FinalCTA.tsx
│   ├── Footer.tsx
│   ├── MobileCTA.tsx
│   ├── BookingModal.tsx           # Orchestrates the 5-step booking flow
│   ├── SignOutButton.tsx
│   └── booking/
│       ├── StepPlan.tsx           # Step 1: Select consultation type
│       ├── StepDetails.tsx        # Step 2: Name, email, phone, legal query
│       ├── StepCalendar.tsx       # Step 3: Custom calendar + Cal.com time slots
│       ├── StepCountdown.tsx      # Step 4: Booking summary + Razorpay trigger
│       └── StepSuccess.tsx        # Step 5: Confirmation screen
│
├── lib/
│   ├── types.ts                   # All shared TypeScript types + CONSULTATION_PLANS
│   ├── auth.ts                    # NextAuth options
│   ├── cal.ts                     # Cal.com API helpers (slots + booking creation)
│   └── utils.ts
│
├── prisma/                        # ← Add if you want in-app storage
│   └── schema.prisma              # See Section 4 for full schema
│
├── public/
│   ├── advocate.png
│   └── lawyer.png
│
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── .env.local                     # Never commit — see Section 11
└── package.json
```

---

## 3. Routes & Pages

| Route | Component Type | Purpose | Auth |
|---|---|---|---|
| `/` | Client Component | Landing page — hero, plans, how-it-works, testimonials, FAQ, CTA. Manages booking modal state. | Public |
| `/login` | Client Component | NextAuth sign-in redirect target (used when accessing `/dashboard` unauthenticated) | Public |
| `/dashboard` | Server Component | Admin dashboard — currently links to Cal.com and Razorpay external dashboards | Admin only |
| `/dashboard/login` | Client Component | Admin credentials login form | Public |
| `/disclaimer` | Server Component | Legal disclaimer page | Public |
| `/privacy-policy` | Server Component | Privacy policy | Public |
| `/refund-policy` | Server Component | Refund policy (Razorpay requirement) | Public |
| `/terms` | Server Component | Terms of service | Public |

> **Note:** The entire booking flow lives as a modal overlay on `/` — no separate route per step. This keeps the URL clean and avoids reload-on-back issues, but means users cannot deep-link to a specific booking step. If deep-linking matters, consider moving the flow to `/book/[step]`.

---

## 4. Data Models

> **⚠️ Currently no database.** The schema below is a proposed Prisma addition. Install with `npm install prisma @prisma/client` and run `npx prisma migrate dev`. Without it, all booking history lives in Razorpay notes fields and Cal.com's dashboard.

### Proposed Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Booking {
  id                String           @id @default(cuid())
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt

  // Client info
  clientName        String
  clientEmail       String
  clientPhone       String
  legalQuery        String?

  // Consultation
  consultationType  ConsultationType
  amountPaise       Int              // stored in paise (₹ × 100)

  // Appointment
  selectedDate      String?          // "YYYY-MM-DD"
  selectedTime      String?          // "10:00 AM" IST
  meetingUrl        String?
  calBookingUid     String?

  // Payment
  razorpayOrderId   String?          @unique
  razorpayPaymentId String?          @unique
  paymentStatus     PaymentStatus    @default(PENDING)

  // Status
  bookingStatus     BookingStatus    @default(PENDING)
  emailSent         Boolean          @default(false)
  calBookingFailed  Boolean          @default(false)
  webhookVerified   Boolean          @default(false)

  @@index([clientEmail])
  @@index([paymentStatus])
  @@index([bookingStatus])
  @@index([createdAt])
}

enum ConsultationType {
  DOUBT     // ₹300  — 10 min
  QUICK     // ₹500  — 15 min
  DETAILED  // ₹2000 — 45 min
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
}

enum BookingStatus {
  PENDING       // payment not yet received
  CONFIRMED     // paid + Cal.com slot created
  SLOT_PENDING  // paid but Cal.com booking failed
  CANCELLED
  COMPLETED
}
```

### Current TypeScript Types (`lib/types.ts`)

The existing `Booking` interface mirrors this schema exactly. The enum values use lowercase strings (`"doubt"`, `"quick"`, `"detailed"`) — convert to Prisma enum constants at the persistence layer.

### Consultation Plans (defined in `lib/types.ts`)

| Type | Name | Price | Paise | Duration | Cal.com Slug |
|---|---|---|---|---|---|
| `doubt` | Legal Doubt Clearance | ₹300 | 30,000 | 10 min | `abiramiadvocate/15min` |
| `quick` | Quick Legal Consultation | ₹500 | 50,000 | 15 min | `abiramiadvocate/15min` |
| `detailed` | Detailed Legal Consultation | ₹2,000 | 200,000 | 45 min | `abiramiadvocate/30min` |

---

## 5. API Routes

| Method | Path | Purpose | Auth |
|---|---|---|---|
| `POST` | `/api/create-order` | Creates a Razorpay order. Receives consultation type, client details, and selected slot. Stores metadata in Razorpay `notes`. Returns `orderId`, `amount`, `key`. | Public |
| `POST` | `/api/verify-payment` | Verifies Razorpay HMAC signature. On success: creates Cal.com booking, sends Resend confirmation email. Returns `meetingUrl`, `calBookingUid`, `appointmentDisplay`. | Public |
| `GET` | `/api/cal/slots` | Server-side proxy to Cal.com `/v2/slots/available`. Query params: `consultationType`, `date` (YYYY-MM-DD). Returns `{ slots: CalSlot[] }` with IST display times. Cached 60s. | Public |
| `POST` | `/api/webhook/razorpay` | Razorpay webhook receiver. Verifies HMAC signature via `x-razorpay-signature` header. Currently validates and acknowledges only — no DB write yet. | Razorpay signature |
| `GET` / `POST` | `/api/auth/[...nextauth]` | NextAuth.js catch-all handler. Handles sign-in (credentials), sign-out, and session management via JWT. | — |

### `POST /api/create-order` — Request Body

```typescript
{
  consultationType: "doubt" | "quick" | "detailed",
  name:             string,
  email:            string,
  phone:            string,
  query:            string,
  selectedDate:     string,  // "YYYY-MM-DD"
  selectedTime:     string,  // "10:00 AM" IST
}
```

### `POST /api/verify-payment` — Request Body

```typescript
{
  razorpay_payment_id: string,
  razorpay_order_id:   string,
  razorpay_signature:  string,
  name:                string,
  email:               string,
  phone:               string,
  consultationType:    string,
  planName:            string,
  query:               string,
  amount:              number,  // paise
  selectedDate:        string,
  selectedTime:        string,
}
```

### `GET /api/cal/slots` — Response

```typescript
{
  slots: Array<{
    time:        string,  // ISO UTC string from Cal.com
    displayTime: string,  // "10:00 AM" in IST
  }>,
  error?: string,
}
```

---

## 6. Component Breakdown

### Landing Page — `app/page.tsx`

| Component | Type | Purpose |
|---|---|---|
| `Navbar` | Client | Sticky top bar with "Book Now" CTA button |
| `Hero` | Client | Headline, sub-headline, CTA, advocate image |
| `Stats` | Client | Case count, years of experience, satisfaction stats |
| `Plans` | Client | Three consultation tier cards with pricing; each triggers `BookingModal` |
| `HowItWorks` | Server | Three-step process explanation |
| `Testimonials` | Server | Client review cards |
| `FAQ` | Server | Accordion-style Q&A |
| `FinalCTA` | Client | Bottom conversion section |
| `Footer` | Server | Contact info, policy links |
| `MobileCTA` | Client | Fixed bottom bar (mobile only, `pb-[88px]` on `<main>` for clearance) |
| `BookingModal` | Client | Orchestrates all 5 booking steps |

### Booking Modal Steps — `components/booking/`

| Component | Purpose |
|---|---|
| `StepPlan` | Select consultation type: doubt / quick / detailed |
| `StepDetails` | Client details form: name, email, phone, legal query |
| `StepCalendar` | Custom month calendar grid + time slot picker; fetches `/api/cal/slots` on date click |
| `StepCountdown` | Booking summary, 10-minute timer, triggers Razorpay SDK |
| `StepSuccess` | Confirmation screen with meeting link or fallback message |
| `ProgressBar` | Inline inside `BookingModal`; 4-step visual progress indicator (Plan → Details → Schedule → Payment) |

### Admin — `app/dashboard/`

| Component | Type | Purpose |
|---|---|---|
| `DashboardPage` | Server Component | Auth guard + links to Cal.com and Razorpay dashboards |
| `DashboardLayout` | Server Component | Wraps all `/dashboard/*` routes |
| `LoginPage` | Client Component | Credentials form → NextAuth sign-in |
| `SignOutButton` | Client Component | Calls `signOut()` from next-auth/react |

### Shared Lib — `lib/`

| File | Exports | Purpose |
|---|---|---|
| `lib/types.ts` | Types + `CONSULTATION_PLANS` | All shared TypeScript types and the plan definitions array |
| `lib/auth.ts` | `authOptions` | NextAuth configuration |
| `lib/cal.ts` | `fetchCalSlots()`, `createCalBooking()`, IST↔UTC helpers | All Cal.com API interaction |
| `lib/utils.ts` | Utilities | General helpers (cn, formatters) |

---

## 7. State Management

No global state library. Server Components handle data-fetching concerns; React `useState` / `useRef` and prop-drilling handle the booking modal flow.

| State | Lives In | Approach |
|---|---|---|
| Modal open + selected plan | `app/page.tsx` | `useState` — lifted to page, passed down as props |
| Booking step (1–5) | `BookingModal` | `useState<Step>` |
| Consultation type | `BookingModal` | `useState<ConsultationType \| null>` |
| Client form fields | `BookingModal` | `useState<DetailsForm>` |
| Selected slot | `BookingModal` | `useState<SlotSelection \| null>` |
| Calendar view (month/year) | `StepCalendar` | Local `useState` |
| Available time slots | `StepCalendar` | Local `useState`, fetched on date select |
| Payment loading/error | `BookingModal` | `useState` + `useRef` (avoids stale closure in Razorpay handler) |
| Admin session | Server-side JWT cookie | NextAuth `getServerSession()` in Server Components |

> **Refs for Razorpay:** `BookingModal` uses `useRef` mirrors for `form`, `slot`, and `consultationType`. This is intentional — the Razorpay `handler` callback is created once via `useCallback([], [])` and would capture stale state without the refs. Do not remove them.

---

## 8. Auth Flow

Authentication is **admin-only**. There is no client account system — customers book anonymously via payment. NextAuth uses a single Credentials provider checked against environment-variable credentials.

### Admin Login Flow

1. Unauthenticated user visits `/dashboard`
2. Server Component calls `getServerSession(authOptions)` → session is null → `redirect("/dashboard/login")`
3. Admin submits email + password at `/dashboard/login`
4. NextAuth `authorize()` compares against `process.env.ADMIN_EMAIL` and `process.env.ADMIN_PASSWORD`
5. On match: returns `{ id: "1", email, name: "Admin" }` → JWT session cookie set
6. Subsequent `/dashboard` visits: `getServerSession()` returns session → page renders
7. Sign out: `SignOutButton` calls `signOut({ callbackUrl: "/dashboard/login" })`

### NextAuth Config (`lib/auth.ts`)

```typescript
export const authOptions: NextAuthOptions = {
  providers: [CredentialsProvider({ ... })],
  secret:  process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },   // no DB session table needed
  pages:   { signIn: "/login" },  // ⚠️ See known issue below
};
```

> **⚠️ Known config mismatch:** `pages.signIn` is set to `"/login"` but the admin login form lives at `"/dashboard/login"`. The dashboard page manually calls `redirect("/dashboard/login")`, which works — but NextAuth's built-in `callbackUrl` mechanism will point users to `/login` instead. **Fix:** set `pages.signIn` to `"/dashboard/login"` in `lib/auth.ts`.

### Role-Based Access

Currently single-role: one admin. To add roles, extend the JWT callback in `lib/auth.ts` to embed a `role` field, then check `session.user.role` in protected pages. Clients have no accounts — they are identified only by email + payment ID in Razorpay and Cal.com.

---

## 9. Booking Logic

**Core design decision: Cal.com slots are never reserved until payment succeeds.** This eliminates inventory complexity at the cost of a possible slot conflict between slot selection and payment completion.

### End-to-End Flow

```
1. Select Plan  →  2. Fill Details  →  3. Pick Slot  →  4. Razorpay Payment  →  5. Cal.com Booking  →  6. Send Email  →  7. Success Screen
```

### Step 3 — Slot Availability (`StepCalendar`)

- Calendar renders dates from today + 1 to today + 30 (30-day booking window)
- On date click: `GET /api/cal/slots?consultationType=&date=`
- Server route proxies to Cal.com API v2: `GET /v2/slots/available`
- Cal.com returns UTC ISO slots; the proxy converts each to IST `displayTime`
- Response is cached for 60 seconds via `next: { revalidate: 60 }`
- User selects a time → slot is **not held** — next step is payment

### Step 4 — Payment (`StepCountdown` + Razorpay)

- `POST /api/create-order` → Razorpay creates an order; all metadata stored in `notes` fields
- **Amount is authoritative from the server** (`AMOUNT_MAP` in `create-order/route.ts`) — the client cannot manipulate it
- Razorpay JS SDK opens natively in the browser (loaded globally in `app/layout.tsx`)
- On dismiss: `setPayError("Payment was cancelled")`, user stays on Step 4
- On `payment.failed` event: error message shown inline

### Step 5 — Post-Payment Verification (`/api/verify-payment`)

1. Razorpay calls `handler(response)` with `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`
2. Client `POST /api/verify-payment` with payment IDs + booking metadata
3. Server computes `HMAC-SHA256(orderId|paymentId, RAZORPAY_KEY_SECRET)` — rejects on mismatch (400)
4. Converts user's selected IST slot back to UTC ISO via `istSlotToUTC()`
5. `POST https://api.cal.com/v2/bookings` with attendee details + event type ID
6. If Cal.com succeeds: returns `meetingUrl`, `calBookingUid`
7. If Cal.com fails: sets `calBookingFailed = true` — email still sent, user told team will arrange slot
8. Resend confirmation email dispatched (see Section 10)
9. Response returned to client → `setSuccess()` → `setStep(5)`

### IST ↔ UTC Conversion (`lib/cal.ts`)

```typescript
// IST = UTC + 5h30m, so UTC = IST - 330 minutes
function istSlotToUTC(dateISO: string, timeSlot: string): string {
  // Parse "10:00 AM", convert to 24h
  // Build Date.UTC for that IST moment, then subtract 330 * 60 * 1000 ms
  const utcMs = pseudoUtc - 330 * 60 * 1000;
  return new Date(utcMs).toISOString();
}
```

### Cal.com Event Type ID Mapping

| Type | Price | Duration | Env Var | Fallback ID |
|---|---|---|---|---|
| `doubt` | ₹300 | 10 min | `CAL_EVENT_TYPE_ID_10MIN` | 5807967 |
| `quick` | ₹500 | 15 min | `CAL_EVENT_TYPE_ID_15MIN` | 5807967 |
| `detailed` | ₹2,000 | 45 min | `CAL_EVENT_TYPE_ID_45MIN` | 5807966 |

---

## 10. Email Notifications

Emails are sent via **Resend** at a single trigger point: successful payment verification in `/api/verify-payment`. All email logic is inline in that route.

### Trigger Matrix

| Trigger | Recipient | Subject |
|---|---|---|
| Payment verified + Cal.com booking succeeded | Client email | `Consultation Confirmed — AVS Legal Associates` |
| Payment verified + Cal.com booking failed | Client email | `Payment Confirmed — Slot Being Arranged \| AVS Legal Associates` |

### Email Contains

- Firm name + advocate designation header (navy background)
- Green success checkmark
- Data table: Consultation type · Appointment datetime · Amount paid · Payment ID
- "Join Meeting →" button (green) — only when `meetingUrl` exists
- Amber warning box — only when `calBookingFailed` is true
- Footer: `contact@avslegal.in`

### Sender Config

- **From:** `AVS Legal Associates <noreply@avslegal.in>`
- Domain must be verified in Resend dashboard
- SPF + DKIM DNS records required on `avslegal.in`

> **⚠️ No admin notification email.** When a booking is confirmed, only the client receives an email. The admin must check Cal.com and Razorpay dashboards. To fix: add a second `resend.emails.send()` call to `process.env.ADMIN_EMAIL` inside `verify-payment/route.ts`.

---

## 11. Environment Variables

All secrets must be in `.env.local` (never commit this file). On Vercel: add in Project Settings → Environment Variables.

```bash
# ── NextAuth ──────────────────────────────────────────────────────
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://avslegal.in          # Required in production

# ── Admin credentials ─────────────────────────────────────────────
ADMIN_EMAIL=admin@avslegal.in
ADMIN_PASSWORD=strong-password-here

# ── Razorpay ──────────────────────────────────────────────────────
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxx
# NEXT_PUBLIC_ exposes to browser — used by Razorpay SDK
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx

# ── Cal.com API v2 ────────────────────────────────────────────────
# From Cal.com → Settings → Developer → API Keys
CAL_API_KEY=cal_live_xxxxxxxxxxxx
CAL_EVENT_TYPE_ID_10MIN=5807967
CAL_EVENT_TYPE_ID_15MIN=5807967
CAL_EVENT_TYPE_ID_45MIN=5807966
# Browser-safe versions (used in StepCalendar → /api/cal/slots)
NEXT_PUBLIC_CAL_EVENT_TYPE_DOUBT=5807967
NEXT_PUBLIC_CAL_EVENT_TYPE_QUICK=5807967
NEXT_PUBLIC_CAL_EVENT_TYPE_DETAILED=5807966

# ── Resend (email) ────────────────────────────────────────────────
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

# ── Database (add when implementing Prisma) ───────────────────────
# DATABASE_URL=postgresql://user:password@host:5432/avslegal
```

> Use test keys (`rzp_test_*`) in development. The `NEXT_PUBLIC_` prefix makes variables available client-side — only expose non-secret values this way.

---

## 12. Third-party Integrations

### Razorpay

- **Purpose:** Indian payment collection (UPI, cards, net banking)
- **Amount enforcement:** Server-side via `AMOUNT_MAP` — client sends consultation type, server sets amount
- **Client SDK:** Loaded in `app/layout.tsx` via Next.js `<Script>` tag
- **Flow:** Create order (server) → SDK opens in browser → verify HMAC (server) → proceed
- **Signature:** `HMAC-SHA256(orderId + "|" + paymentId, RAZORPAY_KEY_SECRET)`
- **Webhook:** `POST /api/webhook/razorpay` — signature verified, currently no-op (no DB write)
- **Dashboard:** https://dashboard.razorpay.com

### Cal.com

- **Purpose:** Calendar availability + confirmed booking creation
- **API base:** `https://api.cal.com/v2`, version header: `2024-08-13`
- **Two calls per booking:**
  1. `GET /v2/slots/available` — fetch open time slots for a date
  2. `POST /v2/bookings` — create confirmed booking (only after payment verified)
- **Proxy:** Slots are fetched via `/api/cal/slots` to hide the API key from the client
- **Booking timing:** Cal.com booking is created **only after** payment HMAC verification passes
- **Returns:** `meetingUrl` (video call link) + `uid`
- **Account:** `abiramiadvocate`

### Resend

- **Purpose:** Transactional confirmation emails to clients
- **SDK:** `resend` npm package — `new Resend(key).emails.send()`
- **Sender domain:** `avslegal.in` — must be verified in Resend dashboard
- **Required DNS:** SPF record + DKIM CNAME records
- **Currently:** No delivery status tracking in-app

### NextAuth.js

- **Purpose:** Admin session management
- **Strategy:** JWT (no database session table needed)
- **Server Components:** `getServerSession(authOptions)`
- **Client Components:** `useSession()` hook (requires `SessionProvider` in layout)
- **Google OAuth:** Not configured — can be added by installing the Google provider

---

## 13. Edge Cases & Mitigations

| Scenario | Current Behaviour | Mitigation / Recommended Fix |
|---|---|---|
| **Slot taken between selection and payment** | Cal.com booking fails → `calBookingFailed = true` → email says "team will arrange slot" | Acceptable for low-volume practice. For higher volume: place a tentative Cal.com booking before payment, confirm/cancel after. |
| **User pays twice (double-click / back button)** | `loadingRef.current` guard prevents double `triggerRazorpay()` call | Razorpay also deduplicates by `order_id`. Idempotent at both layers. |
| **Forged or replayed payment signature** | HMAC check fails → `400 Invalid signature` | Add Razorpay order ID lookup to verify the order was created by this server before trusting the payload. |
| **Cal.com API down during booking** | `calBookingFailed = true`; email sent without meeting link; user advised team will follow up | Log failed booking params to a persistent queue or DB row with status `SLOT_PENDING` so admin can retry manually. |
| **Resend email fails** | Silently fails — no error propagated to user; booking confirmed in Cal.com | Catch Resend errors, log them. Consider storing `emailSent: false` in DB and running a cron retry. |
| **User closes modal after payment, before verify** | Payment captured; Razorpay `handler` still executes even if modal is dismissed | Close is blocked while `loading === true`. The handler ref pattern ensures `verify-payment` is called regardless of modal state. |
| **IST timezone edge case (midnight slots)** | `istSlotToUTC` subtracts 330 minutes; day boundary computed correctly | India has no DST — this is stable indefinitely. |
| **Admin credentials brute-forced** | No rate limiting on `/dashboard/login` | Add rate-limiting middleware (`next-rate-limit` or Vercel Edge Middleware). Rotate `NEXTAUTH_SECRET` regularly. Use a strong password. |
| **Client manipulates payment amount** | Server re-computes amount from `consultationType` via `AMOUNT_MAP` — client value ignored | Already handled correctly. The client cannot set the price. |
| **Booking outside 30-day window** | Calendar UI prevents selection; server does not validate date range | Add server-side date range validation in `/api/cal/slots` and `/api/verify-payment`. |
| **Duplicate booking on same payment ID** | No idempotency key on Cal.com booking creation | Pass `razorpay_payment_id` as `metadata.paymentId` to Cal.com, or add a DB unique constraint on `razorpayPaymentId`. |
| **`pages.signIn` redirect mismatch** | NextAuth redirects to `/login`; admin form is at `/dashboard/login` | Change `pages: { signIn: "/login" }` to `pages: { signIn: "/dashboard/login" }` in `lib/auth.ts`. |

---

## Pre-Production Checklist

- [ ] Fix `pages.signIn` to `"/dashboard/login"` in `lib/auth.ts`
- [ ] Switch Razorpay to live keys (`rzp_live_*`)
- [ ] Set `NEXTAUTH_URL` to production domain
- [ ] Set `RAZORPAY_WEBHOOK_SECRET` and register webhook URL in Razorpay dashboard
- [ ] Verify `avslegal.in` domain in Resend + configure SPF/DKIM DNS records
- [ ] Verify Cal.com event type IDs match the advocate's actual Cal.com account
- [ ] Confirm `ADMIN_EMAIL` / `ADMIN_PASSWORD` are set to production values
- [ ] Add rate limiting on `/dashboard/login` and `/api/create-order`
- [ ] (Optional) Add Prisma + PostgreSQL for in-app booking history
- [ ] (Optional) Add admin notification email in `verify-payment/route.ts`
- [ ] (Optional) Add server-side date range validation in `/api/cal/slots`
