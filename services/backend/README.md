# Backend Service

Target stack options:

- **FastAPI**
  - SQLAlchemy or Prisma Client Python for Postgres.
  - Pydantic models for request/response validation.
  - Celery/RQ workers for scheduled jobs (reports, reminders).

- **NestJS**
  - Prisma or TypeORM for Postgres.
  - BullMQ for queueing automation.
  - Guards/interceptors for role-based access (admin, coach, parent).

## Responsibilities

- Booking availability, seat holds, confirmation flows.
- Stripe webhooks ? enrollment creation ? Google Calendar events with Meet links.
- Typing.com ingestion endpoints and raw file storage.
- Metrics aggregation + AI job triggers.
- Notification orchestration (emails, SMS, push).

Expose the endpoints listed in `docs/architecture.md` and generate an OpenAPI spec so the frontends can use typed clients.