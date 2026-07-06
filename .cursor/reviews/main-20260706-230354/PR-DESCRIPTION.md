# PR Description

## Related Documents

- [Code Review](./CODE-REVIEW.md)
- [Testing Plan](./TESTING-PLAN.md)

## Summary

Gate Vercel and Supabase Edge deploys on CI `verify` by consolidating deploy jobs into `ci.yml`, removing the standalone `deploy.yml` workflow, and applying job-level concurrency so deploys are not cancelled mid-flight.

## What Changed

- Moved `deploy-vercel` and `deploy-edge-functions` into `.github/workflows/ci.yml` with `needs: verify`
- Deleted `.github/workflows/deploy.yml`
- Replaced workflow-level concurrency with job-level groups: verify/e2e cancel-in-progress; deploy-vercel and deploy-edge queue without cancel
- Updated `README.md` and `ARCHITECTURE.md` deployment docs and diagrams

## Why

Broken code could reach production when `deploy.yml` ran in parallel with CI. Deploy now waits for lint, format check, typecheck, unit tests, and build to pass.

## How to Test

- Push a PR and confirm deploy starts only after `verify` succeeds
- Push to `main` and confirm production deploy runs after verify, with edge and Vercel deploys in parallel
- Rapid-push to confirm verify cancels but in-flight deploys complete

See [Testing Plan](./TESTING-PLAN.md) for the full checklist.

## Risks and Notes

- Deploy does not wait for `e2e` (intentional per CORD-001)
- Update GitHub branch protection required checks after merge (old Deploy workflow names will not apply)
- PR previews arrive later than before (wait for full verify job)

## Review Verdict

**Approve with Changes**

No code blockers. Update branch protection after merge.

## Pre-merge Checklist

- [ ] Update GitHub branch protection required status checks for new CI job names
- [ ] Run manual CI checklist from TESTING-PLAN.md on first PR after merge
