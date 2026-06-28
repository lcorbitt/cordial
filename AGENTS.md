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

1. Migration (if schema/RLS changes).
2. `_models/<table>.ts` (if new table access).
3. `supabase/functions/_shared/dto/<feature>.dto.ts`.
4. `_services/<domain>/<domain>.service.ts`.
5. `functions/<slug>/index.ts` + `handler.ts`; register in `config.toml`.
6. Add slug to `src/config/edge-function-slugs.ts`.
7. `frontend/services/<domain>.service.ts`.
8. `hooks/queries/<domain>.keys.ts` + `use<Domain>.ts` and/or
   `hooks/mutations/use<Domain>.ts`.
9. `server/prefetch/<domain>.ts` + wire `page.tsx` with `PrefetchBoundary`.
10. Colocated `use<Feature>.ts` + `index.tsx` (JSX only).

## Deep reference

For diagrams, worked examples, and onboarding: read [ARCHITECTURE.md](ARCHITECTURE.md)
(sections 4–17). Do not guess layer placement. Scoped Cursor rules live in
`.cursor/rules/` and load when editing matching paths.
