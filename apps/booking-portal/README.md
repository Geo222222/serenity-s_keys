# Serenity''s Keys Booking Portal

Minimal Next.js App Router UI for families to pick a program, view availability, and kick off Stripe checkout.

## Getting Started

```bash
npm install
npm run dev
```

Create a `.env.local` if you need overrides:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_ADMIN_TOKEN=dev
```

## Pages

- `/programs` – list of cohorts (group ages 6-8, 9-11, 12-14, private).
- `/availability?course=group:6-8` – fetches `POST /api/availability` and renders bookable sessions.
- `/launchpad?session_id=1&student_id=1` – Meet + Typing.com quick actions for kids/parents.
- `/admin` – lightweight utilities to upload Typing.com CSVs and create sessions (gated by `NEXT_PUBLIC_ADMIN_TOKEN`).
- `/success` and `/cancel` – simple post-checkout messaging.

Checkout kicks the browser to the URL returned by `POST /api/booking/checkout`. In dev, the backend returns a placeholder URL when Stripe keys are missing.
