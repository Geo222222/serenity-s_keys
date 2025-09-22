# Shared Packages

Centralize cross-app utilities here:

- Type-safe API client (generated from backend OpenAPI spec).
- UI primitives (buttons, form controls, layout tokens) in collaboration with Tailwind/shadcn.
- Domain models (TypeScript types + Zod validators) shared across booking portal and dashboard.
- Analytics helpers (chart config, formatters) for consistency between dashboard and reports.

Publish as local packages via npm workspaces or Turborepo when the monorepo formalizes.