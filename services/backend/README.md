# Serenity''s Keys Backend

FastAPI + SQLAlchemy service providing the booking, payment, and typing metrics spine for Serenity''s Keys.

## Prerequisites

- Python 3.11
- pip (or uv/poetry if you prefer)
- SQLite for local dev (bundled with Python)

## Getting Started

```bash
cp .env.example .env
python -m venv .venv
. .venv/Scripts/activate            # Windows PowerShell `& .venv/Scripts/Activate.ps1`
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
```

The API serves OpenAPI docs at `http://localhost:8080/docs`.

Set `RESEND_API_KEY` + `FROM_EMAIL` for transactional email, Stripe keys for live checkout, and Google service account details for real Meet links. `LAUNCHPAD_BASE_URL` controls the link used in confirmation emails.

# Database Migrations

We use Alembic for schema changes. After installing dependencies set `DATABASE_URL` and run:

```bash
alembic upgrade head
```

To create a new migration:

```bash
alembic revision -m "message" --autogenerate
```
## Database

- Default `DATABASE_URL` uses `sqlite+aiosqlite:///./serenitys_keys.db`.
- Tables are created automatically at startup (Alembic migrations will follow in a later phase).

## Admin Access

- `ADMIN_API_TOKEN` is used as the password when calling `/api/admin/login` (defaults to `dev` for local use).
- Tokens are issued as JWTs signed with `ADMIN_JWT_SECRET`. Send the JWT in the `X-Admin-Token` header for protected endpoints.
- Stripe webhook requests are rate limited to 10/minute; adjust the limiter in `app/main.py` for production needs.

## Seeding Sessions

Populate the next 14 days of sessions (Mini Movers Mon/Wed/Fri at 3:30pm CT, core groups at 4pm CT, and daily private slots):

```bash
python scripts/seed_sessions.py
```

## Handy Endpoints

```bash
# Health check
curl http://localhost:8080/health

# Availability (next 30 days by default)
curl -X POST http://localhost:8080/api/availability -H "Content-Type: application/json" -d "{}"

# Fetch a single session (Launchpad use-case)
curl http://localhost:8080/api/sessions/1

# Save or update parent/student profile
curl -X POST http://localhost:8080/api/profile/upsert \
  -H "Content-Type: application/json" \
  -d '{
        "parent_name": "Jordan Smith",
        "parent_email": "parent@example.com",
        "student_name": "Skylar",
        "parent_phone": "555-555-5555",
        "typing_username": "typingKid123"
      }'

# Begin checkout (Stripe keys optional; returns placeholder URL in dev)
curl -X POST http://localhost:8080/api/booking/checkout \
  -H "Content-Type: application/json" \
  -d '{
        "session_id": 1,
        "student_id": 1,
        "amount_cents": 8900,
        "success_url": "http://localhost:3000/success",
        "cancel_url": "http://localhost:3000/cancel",
        "typing_username": "typingKid123"
      }'

# Upload Typing.com CSV
curl -X POST http://localhost:8080/api/typing/import \
  -F "file=@../../docs/typing_metrics_example.csv"

# Admin login for JWT
curl -X POST http://localhost:8080/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"password": "dev"}'

# Admin session creation
curl -X POST http://localhost:8080/api/admin/session \
  -H "Content-Type: application/json" \
  -H "X-Admin-Token: <JWT_FROM_LOGIN>" \
  -d '{
        "course": "group:9-11",
        "start_ts": "2025-09-25T21:00:00-05:00",
        "end_ts": "2025-09-25T21:45:00-05:00",
        "capacity": 4
      }'
```

Stripe and Google integrations fall back to safe placeholders when credentials are not configured. When Stripe webhooks succeed, the service now emails parents a confirmation with Meet + Launchpad links and an inline calendar invite.

