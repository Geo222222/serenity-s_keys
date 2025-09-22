# Serenity's Keys Backend (FastAPI)

Drop-in FastAPI service that powers the Serenity's Keys hub. It exposes the
minimal endpoints the landing site and upcoming booking portal need while
leaving clear seams for future Stripe, Google Calendar, and AI upgrades.

## Quickstart

```bash
cd serenitys-keys-backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:api --reload
```

SQLite is the default development database (`DATABASE_URL`). Swap in Postgres by
updating `.env` and installing the appropriate driver.

## Endpoints

- `GET /health` – service heartbeat.
- `POST /api/availability` – list upcoming sessions with remaining seats.
- `POST /api/booking/checkout` – create Stripe Checkout stub + ensure Meet link.
- `POST /api/booking/confirm` – mark enrollment as paid (Stripe webhook placeholder).
- `POST /api/typing/import` – upload Typing.com CSVs and persist metrics.
- `POST /api/reports/generate` – run lightweight AI summary and store report rows.

## Future Hooks

- Replace `utils/stripe_payments.py` with real Stripe client calls and webhook validation.
- Swap `utils/google_calendar.py` stub for service-account powered Meet link generation.
- Expand `reports_ai.py` to call OpenAI/Anthropic and render React Email templates.
- Wire Alembic migrations from `models.py` once schema stabilizes.

The structure mirrors the wider monorepo so additional routers or background
workers can be added without reshuffling directories.