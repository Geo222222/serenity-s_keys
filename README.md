# Serenity's Keys Hub

Workspace for the Serenity's Keys typing program. Each app can ship independently while sharing a common product plan.

## What ships today
- **Marketing site (pps/serenitys-keys-landing)** – Vite/React build with multi-page routing, contact + waitlist forms, booking CTAs that respect BOOKING_BASE_URL, a downloadable 12-week roadmap, and the new Typing Playground for quick WPM/accuracy trials.
- **Booking portal (pps/booking-portal)** – Next.js App Router experience covering program discovery, availability lookups, and admin CSV tools. Stripe and full automation remain on the backlog.
- **Backend skeleton (services/backend/serenitys-keys-backend)** – FastAPI service with stubs for availability, enrollment capture, and integrations (Stripe, Google Calendar, Resend). Uses SQLite for dev, ready to swap to Postgres.
- **Docs & infra** – Architecture, phased roadmap, privacy commitments, and infrastructure plans live in docs/ and infra/. They mirror the current state and the next set of priorities.

## Recent additions
- Shared config (src/config.js) so landing pages pull booking and API base URLs from VITE_* env vars.
- Roadmap PDF at /roadmap.pdf plus a dedicated /roadmap page with inline preview and download CTA.
- Typing Playground available at /try-typing, with navigation links and a home-page callout so parents can test WPM and accuracy in 30/60 second runs.
- Updated pricing copy, program benchmarks, policy quick answers, Launchpad gallery, and contact form acknowledgements to reflect what the team is telling families today.

## Folder map
- pps/serenitys-keys-landing – Marketing frontend (Vite + React).
- pps/booking-portal – Operational web app for parents/admins (Next.js).
- services/backend/serenitys-keys-backend – FastAPI API layer, integrations, background jobs (scaffolded).
- services/ai – Placeholder for future AI pipelines (LLM summaries, co-teacher, etc.).
- pps/parent-dashboard – Reserved for the future dashboard once data contracts are ready.
- infra/ – Database schemas, job specs, and deployment notes.
- docs/ – Living documentation (architecture, roadmap, privacy, prompt experiments).

## Quick start
`ash
# Marketing site
cd apps/serenitys-keys-landing
npm install
npm run dev
# Optional: VITE_BOOKING_BASE_URL=http://localhost:3000 npm run dev

# Booking portal
cd ../booking-portal
npm install
npm run dev

# Backend (FastAPI)
cd ../../services/backend/serenitys-keys-backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8080
`
Use docker compose -f docker-compose.dev.yml up if you prefer the full stack. Populate .env files with Stripe, Resend, and Google credentials when they are ready.

## Roadmap snapshot
| Area | Status |
| ---- | ------ |
| Marketing site refresh (roadmap, typing test, copy) | **Done** |
| Booking automation (Stripe live keys, reminders) | In progress |
| Metrics ingestion (Typing.com CSV + analytics) | Staged (admin tooling exists; automation pending) |
| AI progress engine + parent dashboard | Planned |
| Ops automation (waitlists, no-show handling) | Planned |

See docs/roadmap.md for detailed phases and dates.

## Reference docs
- docs/architecture.md – Current system diagram plus future-state notes.
- docs/roadmap.md – Phased delivery plan with status tags.
- docs/privacy-and-compliance.md – Consent, retention, and policy requirements.
- docs/prompts.md – Prompt experiments for future AI-driven progress reports.

Questions or updates? Open an issue or ping the team in the #serenitys-keys channel.
