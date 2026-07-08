# Cordial Platform Foundation

The production-ready foundation for the Cordial community platform. This phase
ships the platform every future feature sits on — authentication, authorization,
feature flags, background jobs, email, search, logging, monitoring, and a strict,
testable architecture — without building the product features themselves yet.

Built with Next.js (App Router), TypeScript, Supabase (Postgres + Edge
Functions + Realtime), Tailwind, shadcn/ui, TanStack Query, Jotai, Upstash
Redis, Inngest, Resend, PostHog, and Sentry.

## Architecture at a glance

```
Browser:  Component → use<Feature> hook → TanStack Query
          → frontend/services → Edge Function (handler → service → model) → Postgres
SSR:      server/loaders → Supabase server client (session/roles only)
Jobs:     emit AppEvent → Inngest → function handler → providers/DB
```

- No Server Actions. No domain `/api` routes. The Supabase Edge Functions are
  the API; the only Next.js API route is the Inngest jobs webhook.
- Business logic lives in services (`supabase/functions/_services`), table access
  in models (`_models`), HTTP concerns in handlers — never in UI or SQL.
- Every third-party service sits behind a swappable provider interface under
  `src/lib/providers/` and runs on a free tier by default.
- Security follows OWASP Top 10:2025 and lays SOC2 groundwork (audit logs,
  access control, environment separation, structured logging).

See `AGENTS.md` for binding agent rules and `.cursor/rules/` for scoped Cursor
rules. Full onboarding with diagrams and examples is in `ARCHITECTURE.md`.

## Prerequisites

- Node.js 22+
- Docker (for local Supabase)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- [Deno](https://docs.deno.com/) 2.2.5 (matches the CI pin; required for
  `npm run lint` and pre-commit when staging `supabase/functions/**`; install via
  the [official guide](https://docs.deno.com/runtime/getting_started/installation/),
  `brew install deno` on macOS, or
  `curl -fsSL https://deno.land/install.sh | sh` on Linux/macOS)
- [k6](https://k6.io/) (optional, for load tests)

## Local setup (quick guide)

Complete each step in order. **Save your Supabase keys to `.env.local` before
starting the app** — Next.js reads env at startup, so starting early means an
extra restart after you paste the keys.

### 1. Install and copy env template

```bash
npm install
cp .env.example .env.local
```

### 2. Start Supabase

This repo uses custom local ports (`54521` API, `54523` Studio) — see
[`supabase/config.toml`](supabase/config.toml). Do **not** assume the default
`54321` Supabase port.

```bash
npm run supabase:start
```

### 3. Fill in `.env.local` (before starting the app)

Plain `supabase status` no longer prints the anon and service_role keys in recent
Supabase CLI versions. Use the `-o env` flag (short for `--output env`):

```bash
supabase status -o env | grep -E '^(API_URL|ANON_KEY|SERVICE_ROLE_KEY)='
```

Example output:

```
API_URL="http://127.0.0.1:54521"
ANON_KEY="eyJ..."
SERVICE_ROLE_KEY="eyJ..."
```

Open `.env.local` and paste the values (strip the quotes):

| `.env.local` variable | `supabase status -o env` variable |
| --------------------- | --------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL` | `API_URL` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `ANON_KEY` |
| `SUPABASE_SERVICE_ROLE_KEY` | `SERVICE_ROLE_KEY` |

Save the file. Leave the other variables at their `.env.example` defaults
unless you need a specific integration (see
[Optional services](#optional-services) below).

To dump all local connection vars: `supabase status -o env`. Optional URL rename:
`supabase status -o env --override-name api.url=NEXT_PUBLIC_SUPABASE_URL`.

### 4. Reset database

```bash
npm run db:fresh    # migrations + seed + print test users
```

### 5. Start the app

Only run this after step 3 is saved — not before.

```bash
npm run dev:local   # Next.js + Edge Functions + Inngest (one terminal)
```

`dev:local` starts Supabase if it is not already running, sets
`INNGEST_DEV=1` and `INNGEST_EVENT_KEY=local` for background jobs, and opens:

| Service | URL |
| ------- | --- |
| App | http://localhost:3000 |
| Supabase API | http://127.0.0.1:54521 |
| Supabase Studio | http://127.0.0.1:54523 |
| Inbucket (local email) | http://127.0.0.1:54524 |

Visit http://localhost:3000 and sign in with a [test user](#local-test-users-dev-only).

### Optional services

Most third-party integrations are optional locally — providers fall back to
console logging or no-ops when keys are blank.

| Variable group | Required locally? | If blank |
| -------------- | ----------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | App fails to start |
| `UPSTASH_REDIS_*` | No | Rate limiting / cache disabled |
| `RESEND_API_KEY` | No | Emails logged to console |
| `INNGEST_*` | No | `dev:local` sets `INNGEST_DEV=1` and `INNGEST_EVENT_KEY=local` automatically |
| `POSTHOG_*`, `SENTRY_*` | No | Analytics / monitoring disabled |
| `SUPABASE_AUTH_*` (OAuth) | No | Google / Microsoft login disabled |

Full variable reference: [`.env.example`](.env.example). Deeper onboarding:
[`ARCHITECTURE.md` §14](ARCHITECTURE.md#14-local-development).

### Lighter dev modes

| Command | What runs |
| ------- | --------- |
| `npm run dev:local` | **Recommended** — Supabase check, Next.js, Edge Functions, Inngest |
| `npm run dev:all` | Next.js + Edge Functions only (no Inngest dev server) |
| `npm run dev` | Next.js only (Edge Functions must be running separately) |

Stop the local Supabase stack with `npm run stack:stop`.

### Local test users (dev only)

| Email               | Password      | Roles                    |
| ------------------- | ------------- | ------------------------ |
| `member@local.test` | `password123` | member                   |
| `admin@local.test`  | `password123` | member, admin            |
| `lukas@local.test`  | `password123` | member, super_admin      |
| `sharon@local.test` | `password123` | member, super_admin      |

These are seeded by `supabase/seed.sql` and must never exist in staging/prod.
Super admins land on `/admin/overview` with platform analytics.

## Scripts

| Script                 | Purpose                                            |
| ---------------------- | -------------------------------------------------- |
| `npm run dev:local`    | **Start everything** — Supabase check, Next, Edge Functions, Inngest |
| `npm run dev`          | Next.js dev server only                            |
| `npm run dev:all`      | Next.js + Edge Functions (no Inngest)            |
| `npm run build`        | Production build                                    |
| `npm run typecheck`    | `tsc --noEmit`                                      |
| `npm run lint`         | ESLint (Next.js app) + Deno lint (Edge Functions)  |
| `npm run lint:edge`    | Deno lint for `supabase/functions/**` only         |
| `npm run format`       | Prettier write                                     |
| `npm run test`         | Vitest unit + component tests                       |
| `npm run test:e2e`     | Playwright e2e + a11y (dev server on port 3000)     |
| `npm run test:e2e:ci`  | Same suite against a production build (`CI=true`)   |
| `npm run test:e2e:prebuilt` | GHA parity: `next start` on an existing `.next` build |
| `npm run db:fresh`     | Reset DB → migrations → seed + print test users     |
| `npm run db:reset`     | Same as `db:fresh`                                  |
| `npm run db:rollback`  | Apply latest rollback script(s) to local DB          |
| `npm run stack:stop`   | Stop local Supabase stack                            |
| `npm run load:smoke`   | k6 smoke load test (local, ~100 VUs)                 |
| `npm run load:stress`  | k6 stress test (staging, 25k–50k VUs) — see `load/README.md` |
| `npm run email:dev`    | Preview React Email templates                       |

`npm run lint` requires Deno (see Prerequisites). Both `npm run lint:edge` and the
pre-commit hook call `scripts/lint-edge.sh`, which prints install guidance if Deno
is missing. CI pins Deno 2.2.5 via `denoland/setup-deno`.

### End-to-end tests

- **`npm run test:e2e`** starts `next dev` (or reuses an existing server on port 3000).
  Stop other apps on `:3000` first, or run `npm run dev:local` intentionally. When
  debugging flakes, use a free port or `npm run test:e2e:ci` for a fresh server.
- **`npm run test:e2e:ci`** is CI-like: runs a full production `build && start`.
  It does not reuse the verify artifact (that only happens in GitHub Actions).
- **`npm run test:e2e:prebuilt`** matches GHA after a local build:
  `npm run build` then `npm run test:e2e:prebuilt`.
- **CI** builds once in `verify`, uploads `.next` output (excluding cache), and e2e
  downloads it before `next start`. `APP_ENV` stays `development` with placeholder
  secrets so smoke tests run without real Supabase or production-only env checks.
- **Signed-in flows** (`communities`, `admin`) require a local Supabase stack at
  `http://127.0.0.1:54321` (or `localhost`) with non-placeholder keys. They are
  skipped in CI.

Placeholder env for local CI-parity runs (override `.env.local` for that shell):

```bash
APP_ENV=development \
NEXT_PUBLIC_APP_ENV=development \
NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321 \
NEXT_PUBLIC_SUPABASE_ANON_KEY=ci-anon-key-placeholder \
SUPABASE_SERVICE_ROLE_KEY=ci-service-role-placeholder \
EMAIL_PROVIDER=resend \
JOB_PROVIDER=inngest \
ANALYTICS_PROVIDER=none \
POSTHOG_HOST=https://us.i.posthog.com \
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com \
npm run test:e2e:ci
```

## Project structure

```
src/
  app/
    (public)/            login, signup, reset, landing — minimal chrome
    (authenticated)/     dashboard, profile, admin (nested role gate) + shell
    (member)/ (shared)/  stubs for future shells
    auth/callback/       OAuth + magic-link bridge (only non-domain route handler)
    api/inngest/         jobs webhook (only Next.js API route)
  components/            shared UI + shadcn primitives (components/ui)
  hosts/                 global modals/toasts (ModalHost, Toaster)
  hooks/                 query-provider, queries/, mutations/
  frontend/services/     browser HTTP adapters (edgeFunctionFetch + slugs)
  server/loaders/        SSR session/role loaders
  lib/
    providers/           all swappable third-party adapters (email, jobs, redis, …)
    jobs/functions/        Inngest handlers (orchestration, not providers)
    toast/, modal/        user-facing notification and modal helpers
  config/                edge-function-slugs registry

supabase/
  migrations/            schema, RLS, triggers (up migrations)
  rollback/              paired down migrations (manual via npm run db:rollback)
  functions/
    <slug>/              index.ts (preset serve) + handler.ts (HTTP)
    _models/             one file per table — all .from() lives here
    _services/           business logic (domain use cases + pure evaluators)
    _shared/             cross-runtime contracts + validation (@shared/*)
      dto/               API request/response types
      profile/           validation.ts (display name rules)
      storage/           avatar.ts (bucket, limits, paths)
      notification/      types.ts (stable type IDs)
    _http/               middleware/ (pipeline presets), response.ts, context.ts
  seed.sql               roles, permissions, flags, sample community, test users
  config.toml            per-function config

load/                    k6 load test scripts
emails/                  React Email templates
e2e/                     Playwright tests
tests/                   Vitest unit + component tests
```

## Load testing

See [`load/README.md`](load/README.md). Quick start:

```bash
export SUPABASE_ANON_KEY="your-local-anon-key-from-supabase-status"
npm run load:smoke
```

Stress tests (25k–50k concurrent users) run against staging, not localhost.

## Environments

`local`, `staging`, and `production` are separated by environment variables. No
secrets are committed; `.env.local` is gitignored. CI uses non-secret
placeholders to build, and deploys read secrets from GitHub/Vercel.

## Deployment

### Branch model

| Branch | Role |
|--------|------|
| `develop` | Integration branch. Feature PRs merge here. CI runs on every push and PR. |
| `main` | Production branch. Updated only via **Promote Develop** (or hotfix PR). Push triggers production deploy. |

```text
feature/* ──PR──► develop ──CI pass──► main ──CI──► production
```

### CI and deploy (`.github/workflows/ci.yml`)

- **Production:** Vercel + Supabase Edge Functions deploy on push to `main`, after CI succeeds.
- **`e2e`** runs after `verify` and reuses the production build artifact.

### Promote Develop (`.github/workflows/promote-develop.yml`)

Automatically promotes `develop` to `main` after every **successful push to `develop`** (once CI passes). For a manual rerun with a full CI gate, use **Promote Develop (Manual)**.

```text
push to develop → CI (verify + e2e) → Promote Develop → merge to main → CI on main → production deploy
```

1. Merge a PR (or push) to `develop`
2. CI runs on the push
3. When CI succeeds, **Promote Develop** runs automatically
4. If `develop` is ahead of `main`, it merges `develop` → `main` (merge commit), then fast-forwards `develop` to match `main`
5. The push to `main` triggers CI, then production deploy workflows

**Manual rerun:** Actions → **Promote Develop (Manual)** → type `promote` (re-runs verify + e2e on `develop` before merge).

**Branch sync:** If `main` has promotion commits that `develop` is missing, the workflow merges `main` into `develop` automatically before promoting. After each promote, `develop` is fast-forwarded to `main` so branches stay aligned without manual git commands.

**Approval gate:** The promote job uses the GitHub **`production`** environment. Add required reviewers in repo **Settings → Environments → production**.

**Branch protection on `main`:** Either allow GitHub Actions to bypass push rules, or add a `PROMOTE_GITHUB_TOKEN` secret (PAT with `contents: write`) for the merge push.

### Secrets

`VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `SUPABASE_ACCESS_TOKEN`, `SUPABASE_PROJECT_ID`. Optional: `PROMOTE_GITHUB_TOKEN`.

## What is intentionally NOT built yet

Forums, comments, voting, moderation, memberships, payments, video, CMS,
notifications, DMs, communities UI, and product analytics. The foundation is
designed so each of these slots in without re-architecting.
