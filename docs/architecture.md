# Platform Architecture

```
Parents / Students
     |
Landing Site (Vite + React)
     |
Booking Portal (Next.js App Router)
     |
FastAPI Backend
     +-- Google Calendar (service account; Meet links, future automation)
     +-- Stripe (Checkout handoff, webhooks – pending live keys)
     +-- Typing.com (CSV uploads today, API integration later)
     +-- Postgres (planned production datastore; SQLite in dev)
     +-- Redis / queue (planned for reminders, waitlists)
     +-- AI services (planned summaries, co-teacher)

Parent Dashboard (planned)
Notifications (Resend email today, Twilio SMS optional later)
```

## Current components

### Landing site (`apps/serenitys-keys-landing`)
- Vite + React with client-side routing.
- Shared config module exposes `BOOKING_BASE_URL`, `API_BASE_URL`, and Stripe keys from env.
- Pages include programs, pricing, policies, roadmap, and the `/try-typing` playground (timer, accuracy, WPM metrics).
- Contact form hits `sendContactMessage` which posts to backend and falls back to Formspree when offline.

### Booking portal (`apps/booking-portal`)
- Next.js App Router, server actions planned for checkout flow.
- Admin tooling for Typing.com CSV import and session creation.
- Depends on backend JWT auth and `NEXT_PUBLIC_API_BASE_URL`.

### Backend (`services/backend/serenitys-keys-backend`)
- FastAPI scaffold with SQLAlchemy models, Stripe/Google/Resend integration stubs, and Uvicorn dev setup.
- Uses SQLite for local work; migrations and Postgres configuration live in `infra/db`.
- Exposes placeholders for availability, contact capture, enrollments, and metrics ingestion.

### Docs & Infra (`docs/`, `infra/`)
- Architecture, roadmap, privacy, and prompt guidance now reflect the latest site content and upcoming milestones.
- Infra folder houses schema snapshots, job specs, and deployment notes for when Postgres/Redis go live.

## Near-term build targets
- Promote Stripe + Resend credentials to env-managed secrets and finish checkout webhooks.
- Stand up Postgres + Redis in hosted environments and wire migrations/queues.
- Automate Typing.com ingestion (headless or API) and surface metrics in parent dashboard.
- Layer deterministic rules + LLM prompts for weekly progress summaries and PDF exports.
- Deliver parent dashboard with metrics graphs, AI insights, and self-service scheduling.

## Data model (planned baseline)

| Table | Key fields |
| ----- | ---------- |
| parents | id, name, email, phone |
| students | id, parent_id (FK), name, dob, level, notes |
| courses | id, name, age_min, age_max |
| sessions | id, course_id, start_ts, end_ts, mode, capacity, location, status, meet_link |
| enrollments | id, student_id, session_id, status, payment_status |
| metrics | id, student_id, date, wpm, accuracy, time_spent, source, raw_blob |
| reports | id, student_id, period_start, period_end, summary_text, pdf_url |
| webhooks | id, provider, payload, created_at |

Roles include admin, coach, and parent once auth is in place.

## API surface (in development)

- `POST /api/contact` – landing site contact + waitlist capture (live).
- `POST /api/typing/import` – CSV upload for Typing.com exports (admin).
- `POST /api/booking/availability` – fetch open sessions (stubbed).
- `POST /api/booking/checkout` – Stripe checkout session provisioning (stubbed).
- `POST /api/booking/confirm` – webhook to finalize enrollment (planned).
- `GET /api/parent/dashboard` – metrics + schedule aggregation (planned).

Keep clients thin by consuming generated TypeScript/Python SDKs once the backend contracts solidify.
