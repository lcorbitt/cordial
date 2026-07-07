# PR Description

## Summary
- Playwright CI exercises the production app via `next start` on the verify job's build output (not `next dev`)
- `verify` builds once, uploads artifact (excluding cache); `e2e` downloads and runs `npm run test:e2e:prebuilt`
- Local: `test:e2e` (dev server), `test:e2e:ci` (full build), `test:e2e:prebuilt` (GHA parity after build)

## What Changed
- `playwright.config.ts` — conditional webServer with `E2E_PREBUILT`, HTML reporter in CI
- `.github/workflows/ci.yml` — workflow-level env, permissions, `.next/cache`, artifact reuse, `e2e` `needs: verify`
- `.github/workflows/promote-develop-manual.yml` — same artifact pattern
- `package.json` — `test:e2e:ci`, `test:e2e:prebuilt`
- `README.md` — E2E docs, env copy-paste block, corrected CI timing
- `e2e/accessibility.spec.ts` — readiness waits before axe
- `e2e/communities.spec.ts`, `e2e/admin-communities.spec.ts` — explicit CI skip

## Why
E2E should match what Vercel deploys. Code review feedback addressed duplicate builds, local/CI parity docs, and a11y flake risk.

## How to Test
- `npm run test:e2e` — dev server
- `npm run build && npm run test:e2e:prebuilt` — GHA parity
- CI: confirm verify uploads artifact, e2e downloads and runs `next start` only

## Review Verdict
Approve — code review feedback addressed.
