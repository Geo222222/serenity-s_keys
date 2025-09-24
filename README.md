# Serenity’s Keys — Calm Typing Classes for Kids

Live Google Meet typing classes starting at age 3. We blend Typing.com drills with warm coaching, a simple Launchpad, clear progress emails, and parent-friendly policies. Browse programs, book, and get a predictable 12-week roadmap.

**Website**: https://serenitykeys.com  
**Brand**: Serenity’s Keys (domain shortened to “Serenity Keys” for web)  
**Stack**: React + Vite, plain CSS design tokens, optional Stripe + Google Calendar rollout

---

## Features (mapped to pages)

- **Home** — Programs preview, proof points, “How it works,” AI Mentor waitlist, testimonials.  
- **Programs** — Age-grouped classes (3–5, 6–8, 9–11, 12–14) + Private; Typing.com-aligned drills; weekly goals. 
- **Pricing** — Three clear plans, Stripe checkout rolling out, scholarships info.  
- **How It Works** — Timeline (Book → Launchpad → Coach-led class → Progress email), parent checklist, safety & privacy.  
- **Why Typing** — Research-framed benefits, myth-vs-reality, success stats; clear next steps.  
- **Policies** — Refunds, rescheduling, session rules, minimal data policy. 
- **Contact** — 24-hour weekday response, simple form (sendContactMessage).  
- **Typing Playground** — (Component provided in docs) On-site demo test for WPM/Accuracy.

---

## Quick start

```bash
# 1) install
pnpm i        # or npm i / yarn

# 2) env
cp .env.example .env.local
# set BOOKING_BASE_URL, STRIPE keys (when ready), etc.

# 3) run dev
pnpm dev      # vite dev server

# 4) build & preview
pnpm build
pnpm preview
