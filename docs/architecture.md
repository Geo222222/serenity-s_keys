# Platform Architecture

```
Parents / Students
     ¦
     ?
Booking Portal (Next.js App Router)
     ¦
     ?
Backend (FastAPI or NestJS)
     +-- Google Calendar (service account; auto Meet links)
     +-- Stripe (Checkout, webhooks, billing logic)
     +-- Typing.com (CSV uploads ? future API integration)
     +-- Postgres (students, sessions, enrollments, metrics, reports, webhooks)
     +-- Redis / queue (scheduler, reminders, waitlist automation)
     +-- AI Services
           +-- Progress analyzer (Pandas, rules engine)
           +-- Feedback writer (LLM prompts)
           +-- TTS voice co-teacher

Parent Dashboard (Next.js or shared UI package)
Notifications (Resend/SendGrid for email, Twilio optional for SMS)
```

## Service Boundaries

- **Booking Portal (apps/booking-portal)**
  - App Router, server actions for booking flow, Stripe Checkout integration.
  - Uses shared UI tokens/components from `packages/shared`.
  - Calls backend availability and checkout endpoints via typed client.

- **Backend API (services/backend)**
  - FastAPI (Python) for Pandas-native data pipelines or NestJS (Node) for full TypeScript stack.
  - Owns domain logic: availability, capacity caps, waitlists, payment reconciliation.
  - Manages Google Calendar service account, Meet link creation, and webhook ingestion (Stripe, notifications).

- **AI Services (services/ai)**
  - Batch jobs: weekly progress analysis, report generation, email templating.
  - Real-time aids: mini-challenge generator, co-teacher interaction cues.
  - Uses OpenAI (LLMs), ElevenLabs/Coqui (TTS), Pandas/NumPy for metrics trends.

- **Parent Dashboard (apps/parent-dashboard)**
  - Auth (Clerk/Auth.js) gating parent role.
  - Surfaces metrics graphs, AI comments, package balance, upcoming sessions, certificates.

- **Infrastructure (infra/)**
  - `db/` tracks schema definitions, migrations, and ERD snapshots.
  - `jobs/` schedules Celery/RQ/BullMQ workers and automation playbooks (no-shows, reminders, report cadence).
  - `notifications/` manages provider configs (Resend templates, Twilio messaging services).

## Data Model Snapshot

| Table | Key Fields |
| ----- | ---------- |
| parents | id, name, email, phone |
| students | id, parent_id (FK), name, dob, level, notes |
| courses | id, name, age_min, age_max |
| sessions | id, course_id, start_ts, end_ts, mode, capacity, location, status, meet_link |
| enrollments | id, student_id, session_id, status, payment_status |
| metrics | id, student_id, date, wpm, accuracy, time_spent, source, raw_blob |
| reports | id, student_id, period_start, period_end, summary_text, pdf_url |
| webhooks | id, provider, payload, created_at |

Roles: admin (you), coach (assistants), parent (portal access).

## API Surface (Initial)

- `POST /api/booking/availability` – filter by course, cohort size, delivery mode.
- `POST /api/booking/checkout` – create Stripe checkout + provisional seat hold.
- `POST /api/booking/confirm` – Stripe webhook finalizes seat, issues Meet link.
- `GET /api/parent/dashboard` – aggregated dashboard data for authenticated parent.
- `POST /api/typing/import` – CSV upload of Typing.com exports (admin only).
- `POST /api/reports/generate` – weekly job trigger for AI summaries.
- `POST /api/sessions/cancel` – parent cancellation with waitlist backfill.
- `POST /api/waitlist/join` – register interest when capacity is full.

Build thin clients for these endpoints in `packages/shared` so every app stays synchronized with backend contracts.