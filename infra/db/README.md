# Database Infrastructure

- Postgres 15+ with SQL schema tracked via migrations (`migrations/` placeholder).
- Consider Supabase, Neon, or RDS for managed hosting; ensure HIPAA/FERPA considerations if storing minors' data.
- Document retention policy (Typing.com exports trimmed at ~70 days; store long-term history here).
- Define role-based access: app, analytics, readonly, migration.