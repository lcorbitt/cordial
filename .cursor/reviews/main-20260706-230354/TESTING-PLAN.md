# Testing Plan

## Metadata

| Field | Value |
|-------|-------|
| Branch | main (uncommitted) |
| Base | main |
| Reviewed at | 2026-07-06T23:03:54Z |

## Scope

- `.github/workflows/ci.yml` — job graph, concurrency, deploy gating
- Deleted `.github/workflows/deploy.yml`
- `ARCHITECTURE.md`, `README.md`

## Automated Tests

### Commands Run

- `npm run lint` — pass
- `npm run typecheck` — pass
- `npm run test` — pre-existing failures unrelated to this diff (workflow/docs only)

### Results

No automated coverage exists for workflow YAML. Application test failures are not caused by this change.

## Manual Checklist

- [ ] Open a PR to `main`: confirm `verify` runs and must pass before `Deploy to Vercel` starts
- [ ] On PR, confirm `Deploy Supabase Edge Functions` is **skipped** (not failed)
- [ ] Push a second commit quickly: confirm in-flight `verify` is cancelled; new verify completes and preview deploy runs
- [ ] Confirm `Deploy to Vercel` can start after `verify` alone while `e2e` is still running
- [ ] Push to `main`: confirm both deploy jobs run after `verify`, **in parallel** (separate concurrency groups)
- [ ] Push two commits to `main` quickly: confirm first deploy is not cancelled; second queues per target
- [ ] Break lint on a PR: confirm deploy jobs do not run
- [ ] After merge, update GitHub branch protection required checks

## Edge Cases

- `verify` fails → deploy jobs must not run
- `verify` cancelled → deploy jobs for that run must not run
- `e2e` fails while `verify` passed → deploy may still succeed (intentional)
- Missing secrets → deploy fails after verify passes

## Regression Areas

- Vercel preview URL timing (later relative to old parallel deploy)
- GitHub required status checks / merge blocking
- CI cost from overlapping e2e runs after verify cancellation

## Coverage Gaps

- No `actionlint` or workflow YAML validation in CI
- No automated test for GitHub Actions job graph behavior
