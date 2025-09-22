# Serenity's Keys Hub

Modular workspace for the Serenity's Keys typing academy. The hub separates UI experiences, backend services, AI utilities, and infrastructure so each deliverable can ship on its own cadence.

## Layout

- `apps/serenitys-keys-landing` – extracted React marketing and onboarding experience (Vite) for parents and students.
- `apps/booking-portal` – placeholder for the Next.js App Router flow that will power program selection, scheduling, and payments.
- `apps/parent-dashboard` – placeholder for the authenticated dashboard that will surface metrics, reports, and AI feedback to parents.
- `services/backend` – FastAPI or NestJS service exposing booking, enrollment, metrics ingestion, and report generation endpoints.
- `services/ai` – data and LLM tooling (Pandas pipelines, prompt blueprints, TTS choreography) shared across the hub.
- `packages/shared` – future home for shared UI kits, hooks, schema definitions, and API clients.
- `infra/` – declarative infrastructure (Postgres schema, queues, schedules, notification providers).
- `docs/` – architecture notes, prompts, and roadmap artifacts.

## Getting Started

1. Install the landing app dependencies:
   ```bash
   cd apps/serenitys-keys-landing
   npm install
   npm run dev
   ```
2. Spin up the backend or mock the critical endpoints listed in `docs/architecture.md`.
3. Configure `.env` files per app – see the individual READMEs for hints.

## Deployment Path

Deliver in phases – shipping a self-serve booking portal with automated Meet links and Stripe checkout first, then layering data ingestion and AI services. Each phase is documented in `docs/roadmap.md` along with integration callouts (Google Workspace, Stripe, SendGrid/Resend, Twilio, Typing.com).