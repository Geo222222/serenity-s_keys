# Serenity's Keys Landing App

This Vite + React app hosts the public-facing Serenity's Keys experience while the broader hub evolves into a modular platform.

## Quickstart

```bash
npm install
npm run dev
```

By default the app expects a backend running at `http://localhost:8000`. Override with `VITE_API_BASE_URL` in a `.env` file when integrating the FastAPI/NestJS service. Optional Formspree fallbacks can be configured via:

```
VITE_FORMSPREE_ENROLLMENT_ID=
VITE_FORMSPREE_CONTACT_ID=
```

## Next Steps

- Wire the enrollment/contact forms to the new backend endpoints once they are available.
- Replace fallback Formspree IDs with production credentials or disable by leaving them empty.
- Share UI primitives via `packages/shared` as other apps (booking portal, parent dashboard) come online.