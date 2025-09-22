# Booking Portal (Next.js)

Planned App Router project for program selection, scheduling, and payments.

## MVP Scope
- Program selection landing with pricing (trial, private, group, package).
- Availability view fed by `/api/booking/availability`.
- Stripe Checkout integration (trial, packages, memberships) with provisional seat lock.
- Confirmation screen + ICS download + Meet link summary.

## Tech Stack
- Next.js 14 App Router + Tailwind + shadcn/ui.
- Server Actions for backend calls where possible.
- Clerk/Auth.js for parent authentication.
- Lucide icons + React Hook Form for form experiences.

Use this folder to bootstrap the Next.js project (`npx create-next-app@latest`).