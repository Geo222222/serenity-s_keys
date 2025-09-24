# Delivery Roadmap

| Phase | Scope | Timeline | Status |
| ----- | ----- | -------- | ------ |
| Foundations | Service accounts, FastAPI skeleton, dev envs, marketing site baseline | Complete | ? |
| Booking & Meet Automation | Booking wizard, Stripe checkout, Meet link automation, reminder emails | 2025 Q4 | ?? In progress |
| Typing Metrics | Typing.com CSV ingestion, metrics persistence, analytics dashboards | 2026 Q1 | ?? Planned |
| AI Progress Engine | Rules engine, LLM narratives, weekly PDF/email delivery | 2026 Q2 | ?? Planned |
| AI Co-Teacher | Live companion, TTS cues, operator shortcuts | 2026 Q3 | ?? Planned |
| Parent Dashboard | Metrics graphs, AI insights, package management, rescheduling | 2026 Q3 | ?? Planned |
| Ops Automation | Waitlists, no-show handling, job queues, ops dashboards | 2026 Q4 | ?? Planned |

## Phase details

### Foundations (complete)
- Vite marketing site with updated CTA copy, roadmap PDF, and Typing Playground.
- Shared config module for booking/API base URLs.
- FastAPI skeleton with contact endpoint and integration stubs.

### Booking & Meet Automation (in progress)
- Finish Stripe checkout handoff (test and live keys, product mapping, webhooks).
- Automate Google Calendar event creation and reminders via Resend.
- Harden admin tools for session creation, cancellation, and notifications.

### Typing Metrics (planned)
- Automate Typing.com ingestion (API or headless) and normalize metrics.
- Persist aggregates (WPM, accuracy, time spent) and expose API endpoints.
- Surface benchmarks inside parent dashboard and internal reporting.

### AI Progress Engine (planned)
- Implement deterministic rules (plateaus, accuracy dips, consistency flags).
- Use prompt blueprints (`docs/prompts.md`) for parent + kid messaging.
- Store generated PDFs and email weekly summaries.

### AI Co-Teacher (planned)
- Build sidecar experience for live Meet sessions with chat + TTS.
- Implement hotkeys for praise, challenges, accuracy nudges, and breaks.

### Parent Dashboard (planned)
- Authentication (Clerk/Auth.js) with parent role gating.
- Metrics graphs, AI insights, package balance, schedule management.

### Ops Automation (planned)
- Waitlist auto-fill, series scheduling, no-show follow-ups.
- Queue workers (Celery/RQ/BullMQ) and audit logging.

Revisit this roadmap monthly to reflect delivery progress and reprioritize as new insights arrive.
