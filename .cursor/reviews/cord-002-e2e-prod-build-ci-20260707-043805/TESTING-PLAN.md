# Testing Plan

## Metadata

| Field | Value |
|-------|-------|
| Branch | cord-002/e2e-prod-build-ci |
| Base | develop |
| Reviewed at | 2026-07-07T04:38:05Z |

## Scope

- `playwright.config.ts` — conditional `webServer`, `E2E_PREBUILT`, timeouts, HTML reporter
- `.github/workflows/ci.yml` — `.next/cache`, artifact upload/download, `e2e` `needs: verify`
- `.github/workflows/promote-develop-manual.yml` — same artifact pattern
- `package.json` — `test:e2e:ci`
- `README.md` — E2E documentation
- `e2e/accessibility.spec.ts` — readiness waits
- `e2e/communities.spec.ts`, `e2e/admin-communities.spec.ts` — skip comments

## Automated Tests

### Commands Run

```bash
npm run test

# GHA-equivalent prebuilt path
APP_ENV=development E2E_PREBUILT=true CI=true \
  NEXT_PUBLIC_APP_ENV=development \
  NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321 \
  NEXT_PUBLIC_SUPABASE_ANON_KEY=ci-anon-key-placeholder \
  SUPABASE_SERVICE_ROLE_KEY=ci-service-role-placeholder \
  EMAIL_PROVIDER=resend JOB_PROVIDER=inngest ANALYTICS_PROVIDER=none \
  POSTHOG_HOST=https://us.i.posthog.com \
  NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com \
  npm run build && npm run test:e2e

npm run test:e2e -- --grep "landing page"
npm run test:e2e:ci
```

### Results

| Command | Result |
|---------|--------|
| `npm run test` | **81 passed** |
| Prebuilt CI path (`E2E_PREBUILT=true`) | **10 passed, 2 skipped** |
| Local dev smoke | **1 passed** |
| `npm run test:e2e:ci` (cold build) | **10 passed, 2 skipped** |
| PR #4 GHA (prior commit only) | **10 passed, 2 skipped** |
| GHA with artifact path (uncommitted) | **Re-validate after push** |

## Manual Checklist

- [ ] Commit uncommitted review-feedback changes
- [ ] Push and confirm **verify** then **End-to-end + accessibility** pass on GHA
- [ ] In e2e job log, confirm `npm run start` only (not `next dev` or second `next build`)
- [ ] Confirm e2e downloads `next-build` artifact before Playwright starts
- [ ] Compare total CI wall clock (serial verify + e2e) vs baseline
- [ ] Update README deployment section (e2e no longer parallel with verify)
- [ ] Refresh PR description to match artifact reuse behavior
- [ ] On failure, download `playwright-report` artifact
- [ ] After merge, confirm promote workflow `e2e-develop` passes

## Edge Cases

- **Missing artifact:** `E2E_PREBUILT=true` without `.next` fails webServer startup
- **Build failure in verify:** e2e skipped via `needs: verify`
- **Placeholder Supabase:** redirects and invite smoke still work without backend
- **Large artifact transfer:** full `.next` including cache
- **`.env.local` drift:** local `test:e2e:ci` may diverge from GHA env inlining
- **Copy drift:** accessibility readiness selectors tied to UI copy

## Regression Areas

- Auth-gated redirects
- Accessibility on public routes under production bundles
- `next start` + env validation with CI placeholders
- CI pipeline duration and artifact reliability
- Local `test:e2e` vs `test:e2e:ci`
- Promote workflow e2e gate

## Coverage Gaps

- Signed-in member/admin flows (local Supabase only)
- Production `APP_ENV` runtime checks
- Edge Function contract tests in CI
- Authenticated accessibility routes
