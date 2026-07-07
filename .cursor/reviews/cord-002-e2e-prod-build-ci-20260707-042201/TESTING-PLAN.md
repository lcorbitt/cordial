# Testing Plan

## Metadata

| Field | Value |
|-------|-------|
| Branch | cord-002/e2e-prod-build-ci |
| Base | develop |
| Reviewed at | 2026-07-07T04:22:01Z |

## Scope

- `playwright.config.ts` — conditional `webServer` for CI (`build && start`, 240s timeout, `reuseExistingServer: false`) vs local (`dev`, 120s timeout, `reuseExistingServer: true`)
- Downstream consumers: CI `e2e` job (`.github/workflows/ci.yml`), promote workflow `e2e-develop` job (`promote-develop-manual.yml`)
- E2E suite: `e2e/auth.spec.ts`, `e2e/accessibility.spec.ts`, `e2e/communities.spec.ts`, `e2e/admin-communities.spec.ts`

## Automated Tests

### Commands Run

```bash
# CI production path (cold build)
rm -rf .next
CI=true APP_ENV=development NEXT_PUBLIC_APP_ENV=development \
  NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321 \
  NEXT_PUBLIC_SUPABASE_ANON_KEY=ci-anon-key-placeholder \
  SUPABASE_SERVICE_ROLE_KEY=ci-service-role-placeholder \
  EMAIL_PROVIDER=resend JOB_PROVIDER=inngest ANALYTICS_PROVIDER=none \
  POSTHOG_HOST=https://us.i.posthog.com \
  NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com \
  npm run test:e2e

# Local dev path smoke
npm run test:e2e -- --grep "landing page"
```

### Results

| Command | Result |
|---------|--------|
| CI path (`CI=true`, cold `.next`) | **10 passed, 2 skipped** (~28s cold build + run) |
| Local dev path (`--grep "landing page"`) | **1 passed** (~16s) |
| GitHub Actions e2e job (PR #4) | **10 passed, 2 skipped** (~32.5s) |
| Unit tests for `playwright.config.ts` | None (expected) |

Skipped tests: `communities (local stack)` and `admin communities (local stack)` — require real Supabase, skipped when anon key contains `placeholder`.

## Manual Checklist

- [x] Open PR to `develop` and confirm **End-to-end + accessibility** job passes on GitHub Actions
- [ ] In e2e job log, confirm Playwright starts `npm run build && npm run start` (not `npm run dev`)
- [ ] Compare e2e job duration before/after merge; note any regression beyond ~1-2 min
- [ ] On failure, download `playwright-report` artifact and inspect trace/screenshots
- [ ] Run `npm run test:e2e` locally without `CI` set; confirm dev server reuse when port 3000 is already up
- [ ] After merge, confirm promote workflow `e2e-develop` still passes with new config

## Edge Cases

- **Build failure:** `build && start` aborts before `start`; Playwright fails on webServer timeout rather than running tests against nothing
- **Slow GHA runner / cold cache:** webServer may approach 240s on a large app or dependency install lag
- **Port 3000 conflict in CI:** `reuseExistingServer: false` forces fresh server; stray processes could still cause bind failures
- **Placeholder Supabase:** smoke redirects (`/communities` → `/login`) must work without live Supabase
- **Invalid invite token:** `/invite/accept?token=invalid-token` must render heading without backend
- **Production-only bugs:** minification, hydration mismatches, or middleware differences that dev mode hides

## Regression Areas

- Auth-gated redirects (`/communities`, `/admin/communities`)
- Accessibility scans on `/`, `/login`, `/signup`, `/forgot-password` under production bundles
- `next start` startup and env validation with CI placeholder secrets
- CI pipeline duration (duplicate build across `verify` and `e2e` jobs)
- Local developer workflow (`npm run test:e2e` without `CI`)
- Promote workflow e2e gate before merging `develop` → `main`

## Coverage Gaps

- Authenticated E2E flows (`member@local.test`, `admin@local.test`) not exercised in CI
- No automated test for conditional `webServer` config itself (integration check via e2e run is sufficient)
- `accessibility.spec.ts` lacks explicit readiness waits before axe analysis (pre-existing flake risk)
