# Code Review

## Metadata

| Field | Value |
|-------|-------|
| Branch | cord-002/e2e-prod-build-ci |
| Base | develop |
| Commit range | a55ab6a Run E2E against production build in CI. (+ uncommitted review feedback) |
| Reviewed at | 2026-07-07T04:38:05Z |
| Verdict | Approve with Changes |

## Executive Summary

CORD-002 is structurally sound and ready to merge once uncommitted review-feedback changes are committed and GitHub Actions is re-run on the full diff. The branch moves e2e to a production-build path: `verify` builds once, uploads `.next`, and `e2e` downloads the artifact and runs `next start` via `E2E_PREBUILT`. That eliminates the duplicate-build cost from the initial commit and addresses prior review feedback (docs, `test:e2e:ci`, a11y readiness waits, `.next/cache`, promote-workflow parity). All eight specialists report **no merge blockers**. Residual risk is operational and coverage-related: serial CI wall-clock, `APP_ENV=development`, skipped signed-in tests, and README/PR documentation drift.

## Merge Blockers

None.

**Pre-merge gate:** Commit uncommitted changes and re-validate GHA on the complete branch diff before merge.

## Findings

### Blockers

None.

### High

| Location | Finding | Recommendation |
|----------|---------|----------------|
| *(resolved)* | Committed-only state ran duplicate `next build` in verify + Playwright webServer. | **Fixed in uncommitted changes** via artifact reuse + `E2E_PREBUILT`. Merge committed and uncommitted changes together. |

### Medium

| Location | Finding | Recommendation |
|----------|---------|----------------|
| `.github/workflows/ci.yml:73` | `e2e` `needs: verify` serializes jobs. Wall-clock may increase vs parallel layout even though compute drops. | Acceptable tradeoff. Re-measure GHA after push. Split dedicated `build` job if queue time regresses. |
| `README.md:270` | Deployment section still says e2e runs **in parallel** with verify. | Update to reflect e2e runs after verify and reuses the production build artifact. |
| `package.json:16` + `playwright.config.ts:34-36` | `npm run test:e2e:ci` rebuilds locally; GHA e2e only runs `next start` on downloaded artifact. README says it "mirrors CI." | Clarify CI-like vs CI-identical. Optionally add `test:e2e:prebuilt` script. |
| `README.md:186-187` | No copy-paste env block for CI-parity runs; `.env.local` can override placeholders. | Add env example mirroring `ci.yml` and note `.env.local` override risk. |
| `e2e/communities.spec.ts`, `e2e/admin-communities.spec.ts` | Signed-in flows remain skipped in CI (placeholder keys). | Documented in README; track CI-safe auth as future work. |
| `.github/workflows/ci.yml:64-69` | Full `.next` artifact includes `.next/cache`, inflating upload/download size. | Exclude cache from artifact; keep cache in `actions/cache` only. |
| `middleware.ts` + `ci.yml` | Middleware calls `supabase.auth.getUser()` against unreachable Supabase in CI (pre-existing). | Monitor e2e duration/flakes post-merge. |

### Low

| Location | Finding | Recommendation |
|----------|---------|----------------|
| `.github/workflows/ci.yml:45` | Cache key may miss `public/`, Tailwind/PostCSS config changes. | Extend `hashFiles` globs. |
| `promote-develop-manual.yml:128` vs `ci.yml:78-91` | `e2e-develop` relies on workflow-level env; `ci.yml` duplicates env with sync comment. | Mirror explicit env block in promote e2e job for maintainability. |
| `e2e/accessibility.spec.ts:13-20` | Signup/forgot-password wait on headings only; login waits on label (stronger). | Align signup/forgot-password with `getByLabel(/email address/i)`. |
| `.github/workflows/ci.yml` | No explicit workflow `permissions` block. | Add `permissions: contents: read` at workflow level. |
| `.cursor/reviews/.../PR-DESCRIPTION.md` | Stale PR docs describe duplicate build and old webServer command. | Refresh PR description before merge. |
| `ci.yml:113` vs `package.json:16` | CI runs `test:e2e`, not `test:e2e:ci`. | Document implicit `CI` env or switch workflow to `test:e2e:ci`. |
| `e2e/communities.spec.ts:18-20` | `hasLocalStack` uses `127.0.0.1` heuristic, not explicit `CI` flag. | Prefer `test.skip(!!process.env.CI, ...)` for clarity. |
| `ci.yml:16-29` vs `78-91` | Duplicate env blocks between verify and e2e jobs. | Hoist shared env to workflow-level `env:`. |

## Cross-Cutting Themes

- **Commit + CI hygiene** — Merge committed and uncommitted changes as one unit; re-run GHA after push.
- **Serial wall-clock** — Accepted tradeoff for eliminating duplicate build.
- **`APP_ENV=development`** — Intentional smoke-scope compromise; not production-parity.
- **Auth coverage gap** — 2 skipped signed-in tests; known blind spot.
- **Local vs GHA parity** — Script and README drift; risk of false confidence from local green runs.
- **Documentation drift** — README parallel-e2e claim and PR docs lag implementation.

## Specialist Reports

See individual specialist outputs in the review session. All eight specialists completed; Principal synthesis verdict: **Approve with Changes**.
