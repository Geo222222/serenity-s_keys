# Serenity's Keys Hub

Modular workspace for the Serenity's Keys typing academy. The hub separates UI experiences, backend services, AI utilities, and infrastructure so each deliverable can ship on its own cadence.

## Progress Snapshot
- Marketing landing site (`apps/serenitys-keys-landing`) is production-ready: multi-page React experience, SEO metadata hook, and contact/enrollment forms that call the backend with Formspree fallbacks.
- Booking portal (`apps/booking-portal`) delivers program selection, availability lookup, checkout kickoff, and an admin console for Typing.com CSV ingestion and session creation.
- FastAPI backend (`services/backend/serenitys-keys-backend`) exposes availability, profile upsert, checkout handoff with Stripe fallback, contact capture, typing metrics import, and email/Meet integrations with safe dev defaults.
- Developer tooling covers a docker-compose dev stack, `.env` samples, session seeding script, rate limiting on webhooks, and logging that surfaces request IDs for tracing.
- Typing metrics pipeline stores CSV uploads and serves per-student metrics; a weekly scheduler currently sends plain progress nudges while AI summarization remains to be built.
- AI services, shared packages, parent dashboard, and infrastructure automation are still scaffolds awaiting implementation.

## Roadmap Alignment
| Phase | Scope | Status |
| ----- | ----- | ------ |
| Phase 0 - Foundations | FastAPI skeleton, SQLite dev DB, admin JWT stub; Postgres/Redis provisioning still pending | Mostly done |
| Phase 1 - Booking and Meet Automation | Booking portal flow, Stripe checkout handoff, Meet link plus email confirmations | MVP running; reminder jobs and Stripe credentials configuration outstanding |
| Phase 2 - Typing.com Data Ingestion | CSV import, metrics persistence, trend reporting | CSV import and metrics API live; analytics and automation not started |
| Phase 3 - AI Progress Engine | Rules, LLM summaries, PDF reports | Not started (scheduler only sends basic progress email) |
| Phase 4 - AI Co-Teacher | Live co-teacher, TTS cues | Not started |
| Phase 5-6 - Parent Dashboard and Ops Automation | Dashboard, waitlists, reminders, ops workflows | Not started |

## Repo Layout
- `apps/serenitys-keys-landing` React marketing site with reusable sections, email service helper, and `.env` override hooks.
- `apps/booking-portal` Next.js App Router app powering family flows plus admin CSV/session utilities that rely on backend JWT auth.
- `services/backend/serenitys-keys-backend` FastAPI service with SQLAlchemy models, Google Calendar and Resend integrations, Stripe placeholder checkout, and Alembic scaffolding.
- `services/ai` and `packages/shared` currently document planned tooling; implementation is pending once AI features and shared UI kits are prioritized.
- `apps/parent-dashboard` placeholder awaiting design and data contracts from the backend.
- `docs/` and `infra/` capture architecture, roadmap, privacy notes, and future schema or job definitions used during planning.

## Local Development
- Copy any needed env files (`cp services/backend/serenitys-keys-backend/.env.example .env`) and populate Stripe, Resend, and Google credentials when available.
- Backend: `python -m venv .venv && .\\.venv\\Scripts\\activate && pip install -r requirements.txt && uvicorn app.main:app --reload --host 0.0.0.0 --port 8080`.
- Frontend apps: run `npm install && npm run dev` in `apps/serenitys-keys-landing` and `apps/booking-portal`, or start everything via `docker compose -f docker-compose.dev.yml up`.
- Seed sessions with `python scripts/seed_sessions.py` (after activating the backend venv) and unlock admin tools using `NEXT_PUBLIC_ADMIN_TOKEN` / `ADMIN_API_TOKEN`.

## Outstanding Focus Areas
- Migrate persistence from the SQLite default to managed Postgres, introduce Redis, and wire Alembic migrations plus job queue workers.
- Replace Stripe placeholder flow with live keys, webhook signature verification, and product catalog mapping.
- Build the AI progress engine: ingest trend analytics, generate LLM narratives, and produce parent-facing PDFs or emails.
- Stand up the parent dashboard, shared UI kit, and ops automation (waitlists, reminders, no-show handling).

## Reference Docs
- `docs/roadmap.md` for phased delivery plan and remaining milestones.
- `docs/architecture.md` outlining service boundaries and data model.
- `docs/privacy-and-compliance.md` covering policy commitments and controls.
- `services/backend/README.md` for detailed API endpoints, admin flow, and env expectations.
