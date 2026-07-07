# Code Review

## Metadata

| Field | Value |
|-------|-------|
| Branch | cord-002/e2e-prod-build-ci |
| Base | develop |
| Commit range | a55ab6a Run E2E against production build in CI. |
| Reviewed at | 2026-07-07T04:22:01Z |
| Verdict | Approve with Changes |

## Executive Summary

CORD-002 is a small, focused CI fix that aligns Playwright with a production build (`next build && next start`) instead of `next dev`, closing a prior comment/code mismatch on `develop`. All eight specialists report no merge blockers; QA confirms 10 passed / 2 skipped on the CI path, and Security/Accessibility see net fidelity gains from the production server. The main residual risk is operational: duplicate full builds across parallel `verify` and `e2e` jobs and a longer e2e critical path, not functional correctness of the change itself.

## Merge Blockers

None.

## Findings

### Blockers

None.

### High

| Location | Finding | Recommendation |
|----------|---------|----------------|
| `playwright.config.ts:25` + `.github/workflows/ci.yml:52-53` | CI e2e now runs `npm run build` inside Playwright `webServer` while the parallel `verify` job already runs `npm run build`. Every push/PR pays for two independent Next.js production builds. | Acceptable for CORD-002. Track as CI debt: artifact reuse from verify, `.next/cache` via `actions/cache`, or `e2e` `needs: verify` in a follow-up if duration/cost becomes painful. |

### Medium

| Location | Finding | Recommendation |
|----------|---------|----------------|
| `playwright.config.ts:23-35` | Local `npm run test:e2e` runs against `next dev`; CI runs production build. Prod-only issues (hydration, build-time `NEXT_PUBLIC_*`, minified bundles) can pass locally and fail in CI. | Document `CI=true npm run test:e2e` in README or add a `test:e2e:ci` script for pre-push parity. |
| `playwright.config.ts:25-28` | Build + `next start` is on the e2e job critical path before any test runs. E2e job duration may become the wall-clock bottleneck vs verify. | Measure e2e job duration before/after merge. Consider splitting build into a workflow step with `webServer` running `next start` only. |
| `e2e/communities.spec.ts:17-22`, `e2e/admin-communities.spec.ts:20-25` | Authenticated flows stay skipped in CI (placeholder anon key). Production-build path only validates public/smoke routes. | Acceptable for CORD-002 scope. Document that signed-in flows remain local-stack only. |
| `playwright.config.ts:30-34` | Local `reuseExistingServer: true` can attach to a stale server on port 3000. | Document that e2e expects no server on `:3000` or an intentional local stack. |

### Low

| Location | Finding | Recommendation |
|----------|---------|----------------|
| `playwright.config.ts:28` | `timeout: 240_000` may need headroom as the app grows or on cold GHA runners. | Monitor CI for webServer startup flakes; bump to 300-360s if needed. |
| `README.md:172` | README does not explain local dev vs CI prod server split. | Optional one-line update under Scripts table. |
| `playwright.config.ts:23-35` | Local dev runs include React Query Devtools DOM that CI axe scans will not see. | Document split or add `test:e2e:ci` for pre-push checks. |
| `e2e/accessibility.spec.ts:11-16` | Axe runs immediately after `page.goto` with no explicit readiness wait (pre-existing). | Add stable signal per route before `AxeBuilder.analyze()` if flakes appear post-merge. |
| `playwright.config.ts:25` + `ci.yml:61-72` | CI runs `next start` with `APP_ENV=development`; production-only runtime env checks are not exercised. | Acceptable for smoke tests; document intentional non-production `APP_ENV` in CI. |
| `ci.yml:35,79` | Only npm cache configured; no `.next/cache` persistence. | Add Next.js build cache in a follow-up if duplicate build remains. |
| `promote-develop-manual.yml` | Same duplicate-build pattern on promote runs. | Apply same artifact/cache strategy if promote cadence matters. |

## Cross-Cutting Themes

- **Duplicate `next build` (verify + e2e)** — dominant cross-job concern; acceptable for shipping CORD-002, track as CI debt.
- **CI vs local parity** — `CI=true` gate, optional docs, `reuseExistingServer` stale-server risk; signed-in flows still skipped in CI.
- **E2e critical path length** — build → start → tests; 240s timeout adequate but worth monitoring.
- **Production-build side effects** — `APP_ENV=development` on prod server, `NEXT_PUBLIC_*` inlining, placeholder secrets; pre-existing middleware/Supabase unreachable behavior unchanged.
- **Scope discipline** — CORD-002 delivers promised scope; duplicate build optimization and promote-workflow parity are natural follow-ups.

## Specialist Reports

### Senior Engineer

**Summary:** CORD-002 is a small, focused fix aligning Playwright CI with production output. No blockers.

| Severity | Location | Finding | Recommendation |
|----------|----------|---------|----------------|
| Medium | `playwright.config.ts:25` | Duplicate `next build` in e2e vs verify. | Acceptable; cache `.next` or artifact reuse if painful. |
| Low | `playwright.config.ts:28` | 240s timeout may tighten as builds grow. | Monitor; split build into workflow step if needed. |
| Low | `playwright.config.ts:23-35` | `CI=true` locally mirrors CI path. | Optional README note. |

### PM

**Summary:** CORD-002 delivers promised scope. PR #4 CI green. No blockers.

| Severity | Location | Finding | Recommendation |
|----------|----------|---------|----------------|
| Low | `playwright.config.ts:3-5` | Fixes comment/code mismatch on develop. | Note in PR. |
| Low | `playwright.config.ts:23-35` | Local misses prod-build-only issues until CI. | Optional `test:e2e:prod` script. |
| Low | `ci.yml:52-53` + `playwright.config.ts:25` | Duplicate build out of scope for CORD-002. | Follow-up if runtime concerns. |
| Low | `e2e/*.spec.ts` | Signed-in tests skipped in CI. | Document intentional scope. |
| Low | `README.md:172` | No CI vs local server note. | Optional README update. |

### QA Engineer

**Summary:** 10 passed, 2 skipped on CI path locally. No blockers.

| Severity | Location | Finding | Recommendation |
|----------|----------|---------|----------------|
| Medium | `playwright.config.ts:23-28` | Duplicate build in e2e job. | Acceptable; cache or artifact reuse later. |
| Medium | `e2e/communities.spec.ts`, `e2e/admin-communities.spec.ts` | Auth flows skipped in CI. | Document or add CI-safe auth fixture later. |
| Low | `playwright.config.ts:23` | CI gated on `process.env.CI`. | Fine for GHA. |
| Low | `playwright.config.ts:28` | 240s timeout unvalidated on GHA cold cache. | Watch first CI runs. |

See [Testing Plan](./TESTING-PLAN.md) for full QA testing plan draft.

### Performance Engineer

**Summary:** Duplicate full `next build` per CI run is the main cost.

| Severity | Location | Finding | Recommendation |
|----------|----------|---------|----------------|
| High | `playwright.config.ts:25` + `ci.yml:52-53` | Two independent production builds per push/PR. | Artifact reuse, `.next/cache`, or `needs: verify`. |
| Medium | `playwright.config.ts:25-28` | Build on e2e critical path. | Measure duration; split build from webServer. |
| Medium | `playwright.config.ts:28` | 240s fixes symptoms not duplicate work. | Monitor flakes; prefer eliminating redundant build. |
| Low | `ci.yml:35,79` | No `.next/cache` persistence. | Add Next.js build cache. |
| Low | `promote-develop-manual.yml` | Same duplicate build on promote. | Apply same strategy if needed. |

### Security Engineer

**Summary:** No security blockers. Net improvement vs dev server.

| Severity | Location | Finding | Recommendation |
|----------|----------|---------|----------------|
| Low | `playwright.config.ts` + `ci.yml` | `APP_ENV=development` on prod server; production env checks not exercised. | Acceptable for smoke tests. |
| Low | `playwright.config.ts:25` + `ci.yml` | Second build with placeholder `NEXT_PUBLIC_*`. | Never add real secrets to e2e job. |
| Low | `playwright.config.ts:15` | Trace artifacts on retry (pre-existing). | Restrict if authenticated e2e expands. |

**Verdict:** No security blockers for merging CORD-002.

### Accessibility Engineer

**Summary:** No a11y blockers. Production build improves CI fidelity.

| Severity | Location | Finding | Recommendation |
|----------|----------|---------|----------------|
| Low | `playwright.config.ts:23-35` | Local dev DOM may diverge from CI (React Query Devtools). | Document or add `test:e2e:ci`. |
| Low | `e2e/accessibility.spec.ts:11-16` | No explicit readiness wait before axe (pre-existing). | Add stable signal per route if flakes appear. |

### Frontend/UX Engineer

**Summary:** No blockers. Ship-worthy.

| Severity | Location | Finding | Recommendation |
|----------|----------|---------|----------------|
| Medium | `playwright.config.ts:23-35` | Local cannot reproduce CI without `CI=true`. | Add `test:e2e:ci` or document. |
| Medium | `playwright.config.ts:30-34` | `reuseExistingServer` stale server risk. | Document port 3000 expectations. |
| Low | `playwright.config.ts:28` | Timeout may need bump on cold runners. | Monitor CI. |
| Low | `README.md:172` | No E2E behavior docs. | Extend Scripts table. |

### Backend Engineer

**Summary:** No backend/migration impact. No blockers.

| Severity | Location | Finding | Recommendation |
|----------|----------|---------|----------------|
| Medium | `playwright.config.ts:23-28` | Duplicate build with verify job. | Artifact reuse if CI time painful. |
| Low | `playwright.config.ts:28` | 240s timeout may tighten as app grows. | Monitor and raise if flaky. |
| Low | `playwright.config.ts:25` | `NEXT_PUBLIC_*` inlined at build time. | Keep build env and skip-guard env in sync. |
| Low | `middleware.ts` + `playwright.config.ts` | Auth middleware hits unreachable Supabase in CI (pre-existing). | No action if CI stays green. |

### Principal Engineer

**Verdict:** Approve with Changes

No merge blockers. Main follow-up: duplicate `next build` across verify and e2e (Performance: High; others Medium or out-of-scope). Specialist conflict on duplicate-build severity only affects follow-up priority, not merge decision.
