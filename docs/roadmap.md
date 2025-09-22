# Delivery Roadmap

## Phase 0 – Foundations (Day 1-2)
- Register service accounts (Google Workspace, Stripe, Resend/SendGrid, Twilio if SMS).
- Provision Postgres + Redis; capture schema in `infra/db` migrations.
- Define Auth (Clerk/Auth.js or custom) with roles: admin, coach, parent.
- Stand up FastAPI/NestJS skeleton with health checks and database connectivity.

## Phase 1 – Booking & Meet Automation (Day 2-4)
- Build booking wizard in Next.js: choose program ? select slot ? checkout ? confirmation.
- Integrate Stripe Checkout (trial, packages, memberships); map products to courses.
- Auto-create Google Calendar events with Meet links; cap sessions (capacity = 4) and lock when full.
- Email flows (Resend/SendGrid): confirmation with ICS, 24h reminder, 2h reminder.
- Deliverable: parents self-serve booking, receive Meet link instantly, no manual coordination.

## Phase 2 – Typing.com Data Ingestion (Day 4-9)
- Admin upload workflow for CSV exports ? Pandas parser ? metrics table.
- Persist daily aggregates (WPM, accuracy, time spent) plus raw blob for audit.
- Plan private API/headless scrape for future automated imports; encapsulate in `services/ai`.

## Phase 3 – AI Progress Engine (Day 9-13)
- Encode deterministic rules: plateau (<2 WPM in 14 days), accuracy (<90% for 3 sessions), consistency (<2 sessions/week).
- Generate parent + kid narratives via LLM prompts (see `docs/prompts.md`).
- Store rendered reports; email weekly Sunday 5pm with PDF attachments.

## Phase 4 – AI Co-Teacher (Day 13-20)
- MVP: Sidecar web companion delivering chat + TTS cues alongside Typing.com sessions.
- Stretch: virtual Meet participant ("Serenity AI") or Google Meet Add-on.
- Implement operator hotkeys (Ctrl+1 praise, Ctrl+2 challenge, Ctrl+3 accuracy nudge, Ctrl+4 break, Ctrl+M mute).

## Phase 5 – Parent Dashboard (Day 20-24)
- Surface metrics graphs (WPM, accuracy, time spent; 7/30/90 day filters).
- Display AI insights, package balances, upcoming sessions, reschedule links, milestone certificates.

## Phase 6 – Ops Automation (Day 24-27)
- No-show detection (10 min late ? auto email + reschedule link).
- Waitlist auto-fill, series scheduling (e.g., Tue 4pm for 4 weeks) with credit management.
- Extend queues/jobs for reminders, expirations, and audit logging.

Iterate quickly per phase; keep shipping increments that solve admin bottlenecks while data/AI capabilities mature.