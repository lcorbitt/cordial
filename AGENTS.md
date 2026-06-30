# GoverNerds — Agent Rules

These rules are binding for all generated code. They encode the platform
architecture. When in doubt, prefer the most literal, boring, explicit option.

## One-line mental model

Slugs = HTTP doors · Services = use cases · Models = tables · DTOs = contracts.

## Hard rules (never violate)

- NO Server Actions. No `"use server"`. All mutations and client reads go
  through Supabase Edge Functions (handler → service → model).
- NO domain `/api` routes in Next.js. The only allowed API route is
  `src/app/api/inngest/route.ts` (jobs webhook). The only allowed non-domain
  route handler is `src/app/auth/callback/route.ts` (auth bridge).
- NO PostgREST / `.from("table")` in frontend code. Table access lives only in
  `supabase/functions/_models/*`.
- Browser Supabase client: **auth + Realtime** (+ Storage signed upload) only.
  Domain reads/writes go through Edge Functions (`frontend/services`).
- Use `@tanstack/react-query`, never the legacy `react-query` package.
- Never put domain/server data in Jotai atoms. Jotai is for ephemeral UI state
  only (open/closed, active step). Server state belongs to TanStack Query.
- Never show raw errors or stack traces to users. Every user-facing message is
  plain language for a non-technical, 35–70 audience.

## Data flow

Browser (mutations + client navigations): Component → colocated `use<Feature>`
hook → TanStack hook (`hooks/queries` | `hooks/mutations`) →
`frontend/services/*` → Edge Function → `_services` → `_models` → Postgres.

SSR auth bootstrap: `server/loaders/*` read session/roles via the Supabase server
client directly (auth exception only).

SSR page prefetch: `page.tsx` (async Server Component) → `server/prefetch/*` →
`edgeFunctionFetchServer` → Edge Function → `PrefetchBoundary` dehydrates →
client hooks hydrate warm cache. Still Edge Functions — never PostgREST.

## Security (OWASP Top 10:2025 + SOC2)

- A01 Broken Access Control: `withAuth` + `withPermission`/`withAccessContext` +
  `withResourceOwnership` on every protected Edge handler; RLS as defense in depth.
- A02 Misconfiguration: validated env (`src/lib/env/*`), security headers.
- A05 Injection: Zod validation on all inputs; parameterized queries only.
- A07 Auth failures: rate limiting on auth-adjacent endpoints.
- A09 Logging: structured logs with request id; append-only `audit_logs`.
- A10 Exceptional conditions: never leak internals; `AppError` + safe responses.

## New feature checklist

Each step defers detail to scoped rules — do not duplicate conventions here.

1. Migration (if schema/RLS changes) → `database-migrations.mdc`
2. `_models/<table>.ts` (if new table access)
3. `supabase/functions/_shared/dto/<feature>.dto.ts`
4. `_services/<domain>/<domain>.service.ts`
5. `functions/<slug>/index.ts` + `handler.ts`; register in `config.toml`
   → `edge-functions.mdc`
6. Add slug to `src/config/edge-function-slugs.ts`
7. `frontend/services/<domain>.service.ts`
8. `hooks/queries/<domain>.keys.ts` + `use<Domain>.ts` and/or
   `hooks/mutations/use<Domain>.ts` → `frontend-patterns.mdc`
9. `server/prefetch/<domain>.ts` + wire `page.tsx` with `PrefetchBoundary`
10. Colocated `use<Feature>.ts` + `index.tsx` (JSX only)
    → `component-colocation.mdc`, UI rules below
11. Realtime (if needed): publication migration + RLS, `*RealtimeSync.tsx` via
    `useRealtimeChannel`, merge helpers in `hooks/queries/use<Domain>.ts`
    → `realtime-patterns.mdc`

## Deep reference

- **Onboarding, diagrams, worked examples:** [ARCHITECTURE.md](ARCHITECTURE.md)
  (sections 4–17).
- **Layer detail:** `.cursor/rules/*.mdc` (load automatically when editing
  matching paths). Do not guess layer placement.

### What lives where (avoid drift)

| Document | Holds |
|----------|--------|
| `AGENTS.md` | Global invariants, data flow, checklist, rule index |
| `.cursor/rules/*.mdc` | Scoped how-to, examples, anti-patterns |
| `ARCHITECTURE.md` | Human onboarding, diagrams, narrative |

Put new **hard rules** here. Put new **folder conventions** in the matching
`.mdc`. Link from here; do not copy prose both places.

### Scoped rules index

**Backend** (start at `backend-patterns.mdc`):

| File | When |
|------|------|
| [`backend-patterns.mdc`](.cursor/rules/backend-patterns.mdc) | Backend hub — Edge Functions, migrations, Realtime, providers |
| [`edge-functions.mdc`](.cursor/rules/edge-functions.mdc) | `supabase/functions/**` handlers, services, models |
| [`database-migrations.mdc`](.cursor/rules/database-migrations.mdc) | `supabase/migrations/**`, rollbacks, Realtime publication |
| [`realtime-patterns.mdc`](.cursor/rules/realtime-patterns.mdc) | Realtime transport, TanStack merge, `*RealtimeSync.tsx` |
| [`providers.mdc`](.cursor/rules/providers.mdc) | `src/lib/providers/**`, Inngest job handlers |

**Frontend** (start at `frontend-patterns.mdc`):

| File | When |
|------|------|
| [`frontend-patterns.mdc`](.cursor/rules/frontend-patterns.mdc) | App routes, hooks, services, prefetch, loaders |
| [`component-colocation.mdc`](.cursor/rules/component-colocation.mdc) | Feature folders: `index.tsx`, `use<Name>.ts`, `constants.ts` |
| [`ui-copy-title-case.mdc`](.cursor/rules/ui-copy-title-case.mdc) | Buttons, links, headings, toasts — Title Case |
| [`ui-spacing.mdc`](.cursor/rules/ui-spacing.mdc) | Padding, margin, gap on 2px grid |
| [`ui-classnames.mdc`](.cursor/rules/ui-classnames.mdc) | Tailwind `*_CLASS` exports in `constants.ts` |
