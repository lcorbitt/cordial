# Code Review

## Metadata

| Field | Value |
|-------|-------|
| Branch | main (uncommitted) |
| Base | main |
| Commit range | Uncommitted working tree |
| Reviewed at | 2026-07-06T23:03:54Z |
| Verdict | Approve with Changes |

## Executive Summary

CORD-001 correctly consolidates deploy into `ci.yml`, gates deploy on `verify`, and applies job-level concurrency so verify/e2e cancel on new pushes while in-flight deploys finish and queue. Two code issues found during review (shared deploy concurrency group, inaccurate CI diagram) were fixed before merge. No code-level blockers remain. Primary follow-up is operational: update GitHub branch protection required checks after deleting `deploy.yml`.

## Merge Blockers

None.

## Findings

### Blockers

None.

### High

| Location | Finding | Recommendation |
|----------|---------|----------------|
| GitHub branch protection (ops) | Deleting `deploy.yml` removes separate **Deploy** workflow check names. Required status rules may still reference old names. | Update branch protection to require new CI job names (`Lint, typecheck, test, build`, `End-to-end + accessibility`, `Deploy to Vercel`, etc.). |

### Medium

| Location | Finding | Recommendation |
|----------|---------|----------------|
| `.github/workflows/ci.yml:121-160` | Deploy gated on `verify` only, not `e2e`. Intentional per CORD-001 but weaker than full CI green before ship. | Confirm acceptance. Future work: `needs: [verify, e2e]` for production if desired. |
| `.github/workflows/ci.yml:13-60` | Rapid pushes cancel in-flight `verify` but not in-flight `e2e` (independent concurrency groups). Stale e2e results possible on PRs. | Document as intentional, or add `needs: verify` to `e2e` in a follow-up. |

### Low

| Location | Finding | Recommendation |
|----------|---------|----------------|
| `.github/workflows/ci.yml` | No explicit workflow `permissions` block. | Add `permissions: contents: read` at workflow level. |
| `.github/workflows/ci.yml:121-148` | Fork PRs run deploy job steps (secrets blocked by GitHub). | Add fork guard on deploy jobs if desired. |
| `.github/workflows/ci.yml` | Unpinned `vercel@latest` and Supabase CLI `latest`. | Pin versions in a follow-up. |

## Cross-Cutting Themes

- **Intentional e2e non-blocking** — deploy waits for verify only; e2e runs in parallel. Documented in README.
- **Concurrency model** — verify/e2e cancel-in-progress; deploy-vercel and deploy-edge use separate groups without cancel.
- **Ops drift** — branch protection must be updated after workflow merge.

## Specialist Reports

See individual specialist outputs in the review session. All eight specialists completed; Principal synthesis verdict: **Approve with Changes**.
