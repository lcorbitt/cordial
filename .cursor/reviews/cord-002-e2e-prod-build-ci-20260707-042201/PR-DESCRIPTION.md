# PR Description

## Related Documents

- [Code Review](./CODE-REVIEW.md)
- [Testing Plan](./TESTING-PLAN.md)

## Summary

Playwright CI now builds and serves the production app (`next build && next start`) instead of `next dev`, matching what Vercel deploys. Local `npm run test:e2e` still uses the dev server for fast iteration.

## What Changed

- `playwright.config.ts`: conditional `webServer` — CI runs `npm run build && npm run start` with 240s timeout; local runs `npm run dev` with 120s timeout
- Updated config comment to accurately describe local vs CI behavior
- Fixes a prior mismatch on `develop` where the comment claimed CI build fidelity but the config always started the dev server

## Why

E2E tests should exercise the same optimized bundles, SSR paths, and build-time env inlining that users get after deploy. `next dev` can hide production-only failures (hydration, minification, static generation) that `verify`'s standalone build step never catches at runtime.

## How to Test

- Locally (dev server): `npm run test:e2e`
- Locally (CI parity): `CI=true npm run test:e2e` with CI placeholder env vars (see [Testing Plan](./TESTING-PLAN.md))
- CI: confirm **End-to-end + accessibility** job passes; logs should show `next build` before `next start`

See [Testing Plan](./TESTING-PLAN.md) for the full checklist.

## Risks and Notes

- **Duplicate build:** `verify` and `e2e` jobs each run `next build` in parallel (~1-2 min extra e2e wall time). Acceptable for CORD-002; artifact reuse or `.next/cache` is a follow-up.
- **Signed-in E2E skipped in CI:** placeholder Supabase keys still skip `local stack` describes; only public smoke and a11y tests run in CI.
- **240s webServer timeout:** adequate for current app size; monitor for flakes as the app grows.
- **Security:** no new attack surface; keep placeholder-only secrets in e2e job.
- **Deploy gating unchanged:** e2e still runs in parallel and does not block deploy (CORD-001).

## Review Verdict

**Approve with Changes**

No merge blockers. Ship-worthy. Track duplicate-build CI cost and local/CI parity documentation as near-term follow-ups.

## Pre-merge Checklist

- [x] CI **End-to-end + accessibility** job green on PR
- [x] Local `CI=true npm run test:e2e` passes (10 passed, 2 skipped)
- [ ] Confirm e2e job logs show production build path (not `next dev`)
- [ ] Optional: add README note for `CI=true npm run test:e2e` local parity
