# Code Review

## Metadata

| Field | Value |
|-------|-------|
| Branch | cord-003/lint-edge-functions |
| Base | develop |
| Commit range | uncommitted working tree |
| Reviewed at | 2026-07-06T23:55:27 local |
| Verdict | Request Changes |

## Executive Summary

CORD-003 correctly wires `deno lint` (via existing `supabase/functions/deno.json`, `recommended` tags) into local `npm run lint`, lint-staged, and the CI `verify` job, with two semantically equivalent `require-await` fixes and clear documentation of the ESLint/Deno split. All specialists agree the main CI path is sound and `deno lint` passes on 97 files at negligible runtime cost. One confirmed merge blocker remains: `promote-develop-manual.yml` runs `npm run lint` without `denoland/setup-deno`, so manual promote will fail with `deno: command not found` after merge. Secondary gaps are developer onboarding (Deno absent from README Prerequisites, bare exit 127 on missing binary) and toolchain completeness (no `deno check`, floating `v2.x`).

## Merge Blockers

| Location | Finding | Recommendation |
|----------|---------|----------------|
| `.github/workflows/promote-develop-manual.yml:117` | Runs `npm run lint` (which now chains `lint:edge` -> `deno lint`) but the workflow has no `denoland/setup-deno` step. After merge, manual promote fails with `deno: command not found`. `ci.yml` is correctly updated; `promote-develop.yml` does not run lint. | Add `denoland/setup-deno@v2` with `deno-version: v2.x` (or pinned version) before the Lint step, matching `ci.yml`. |

## Findings

### Blockers

| Location | Finding | Recommendation |
|----------|---------|----------------|
| `.github/workflows/promote-develop-manual.yml:117` | Missing Deno setup on a workflow that invokes `npm run lint`. | Add `setup-deno` step before Lint, consistent with `ci.yml`. |

### High

| Location | Finding | Recommendation |
|----------|---------|----------------|
| `README.md` (Prerequisites) | Deno is not listed as a prerequisite; only a Scripts footnote mentions it. Local `npm run lint` and lint-staged will fail with bare `deno: command not found` (exit 127) and no hint. | Add Deno to Prerequisites with cross-platform install links (not macOS-only `brew`). Consider a short Linting section explaining the dual ESLint + Deno model. |
| `npm run lint` / `lint:edge` | No friendly failure when Deno is missing; error is opaque for non-technical contributors. | Prominent docs and/or a thin wrapper script that prints install guidance before invoking `deno lint`. |

### Medium

| Location | Finding | Recommendation |
|----------|---------|----------------|
| `.github/workflows/ci.yml` + local | `deno-version: v2.x` floats. New `recommended` rules can redden CI on unrelated PRs; tool-cache keys drift. | Pin an exact Deno version (e.g. `2.1.x` or current patch) in CI, document the same in README, and align `lint:edge` expectations. |
| `supabase/functions/**` + CI | Edge code is excluded from root `tsc` and has no `deno check` in CI. Type errors in the deploy surface can slip through lint-only gating. | Follow-up ticket: add `deno check` (or equivalent) to `lint:edge` and CI. |
| `ARCHITECTURE.md` | "CI verify runs the same lint gates" overstates parity: CI lints the full project; pre-commit lints staged files only. | Rephrase to distinguish full-project CI vs staged pre-commit. |
| `package.json` / `lint-staged` | `deno lint` config path duplicated between `lint:edge` and lint-staged glob command. | Extract to a shared script or env var to avoid drift. |
| `supabase/functions/_services/community/tokens.ts` | `hashInviteToken` / `generateInviteToken` have no direct unit tests (low risk; hashing path unchanged). | Optional follow-up: unit tests for token helpers. |
| `denoland/setup-deno@v2` | Cold install ~5-10s per job; dominates `deno lint` (~0.09s on 97 files). Acceptable for `verify` only. | Accept for merge; pin version for stable cache keys. Optional `cache: true` once `deno.lock` exists. |

### Low

| Location | Finding | Recommendation |
|----------|---------|----------------|
| `supabase/functions/deno.json` | `fmt` block unused; Prettier governs formatting. Two sources of truth. | Remove unused `fmt` block or document intentional split in a follow-up. |
| `supabase/functions/deno.json` vs root `package.json` | Dual-runtime drift possible (`zod@3` in Deno vs `zod@^4` in Node). | Monitor; align versions if shared `_shared` types diverge. |
| `eslint.config.mjs` + `lint-staged` | Staged edge files match both Deno glob and `*.{ts,tsx}` ESLint glob; ESLint is a no-op due to `globalIgnores`. | Optional lint-staged glob negation to skip redundant ESLint spawn on edge-only commits. |
| `.cursor/rules/edge-functions.mdc` | Does not mention `lint:edge`. | Add one line pointing contributors to `npm run lint:edge`. |
| `supabase/functions/_services/events/publisher.ts` | `ConsoleEventPublisher` has no Vitest coverage. | Follow-up if publisher behavior grows. |
| CI / tooling | No automated test asserting lint gate wiring (scripts, lint-staged, workflow steps). | Optional smoke test or CI assertion in a follow-up. |
| `denoland/setup-deno@v2` | Action major tag not SHA-pinned (SOC2 change-control note). | Consistent with repo norms (`checkout@v4`, etc.); pin SHA only if org policy requires. |
| Docs | "edge functions" vs "Edge Functions" casing inconsistency. | Normalize in README/ARCHITECTURE on next docs pass. |
| Ticket CORD-003 | Literal wording was "remove from ESLint ignore"; pragmatic keep-ignore + Deno lint is documented and acceptable. | Update ticket wording on close. |
| Working tree | Changes uncommitted at review time. | Commit before opening PR. |

## Cross-Cutting Themes

- **Workflow coverage gap** - `ci.yml` is updated; `promote-develop-manual.yml` is not. Any workflow invoking `npm run lint` must install Deno.
- **Developer onboarding** - Deno missing from Prerequisites, opaque `command not found`, dual-toolchain model not discoverable in one place.
- **Version pinning / reproducibility** - Floating `v2.x` affects CI stability, cache keys, and SOC2 change-control; specialists uniformly recommend pinning.
- **Edge toolchain completeness** - Lint gate is the right first step; typechecking (`deno check`) and dual-runtime dependency alignment remain gaps.
- **Pragmatic ESLint/Deno split** - Keeping `supabase/functions/**` in ESLint `globalIgnores` with an explanatory comment is the correct tradeoff; docs should make the model explicit.

## Specialist Reports

### Senior Engineer

**Summary:** No blockers on the main CI path. `require-await` fixes are behaviorally equivalent. Promote-manual workflow gap is the standout operational risk.

| Severity | Location | Finding | Recommendation |
|----------|----------|---------|----------------|
| Medium | `promote-develop-manual.yml` | No `setup-deno` before `npm run lint`. | Mirror `ci.yml`. |
| Low | `README.md` | Deno not in Prerequisites. | Add to Prerequisites. |
| Low | `package.json` / lint-staged | Deno config path duplicated. | Deduplicate. |
| Low | lint-staged | Edge files hit both Deno and ESLint globs. | Optional negation. |

### Backend Engineer

**Summary:** `deno lint` with root `deno.json` is the correct gate (97 files across slugs, `_services`, `_models`, `_http`, `_shared`). No backend blockers.

| Severity | Location | Finding | Recommendation |
|----------|----------|---------|----------------|
| Medium | CI / edge surface | No `deno check`; edge excluded from `tsc`. | Follow-up: add `deno check`. |
| Low | `deno.json` vs root | Possible `_shared` zod version drift. | Monitor alignment. |
| Low | `deno.json` | Unused `fmt` block. | Remove or document. |
| Low | CI | `v2.x` floats. | Pin version. |

### Performance Engineer

**Summary:** `setup-deno` cold install (~5-10s) dominates; `deno lint` sub-second. Only `verify` pays the cost.

| Severity | Location | Finding | Recommendation |
|----------|----------|---------|----------------|
| Medium | CI | Pin exact Deno version for cache keys / reproducibility. | Pin patch version. |
| Low | CI | `v2.x` floats. | Same as above. |
| Low | `setup-deno` | No `cache: true`; no `deno.lock` yet. | Add when lockfile exists. |
| Low | lint-staged | Optional glob negation for edge-only commits. | Reduce redundant ESLint spawn. |

### Security Engineer

**Summary:** No security blockers. Token hashing and event publisher paths unchanged; CI permissions and secrets surface unchanged.

| Severity | Location | Finding | Recommendation |
|----------|----------|---------|----------------|
| Low | CI | `v2.x` floats (change-control). | Pin version. |
| Low | `setup-deno@v2` | Major tag not SHA-pinned. | Consistent with repo norms. |

**Verdict:** No security blockers for merging after promote-workflow fix.

### QA Engineer

**Summary:** Existing unit tests pass. Manual promote failure is the primary regression risk.

| Severity | Location | Finding | Recommendation |
|----------|----------|---------|----------------|
| Blocker | `promote-develop-manual.yml:117` | Missing Deno setup, promote fails. | Add `setup-deno`. |
| Medium | `README.md` | Deno not in Prerequisites. | Document install. |
| Medium | CI | `v2.x` can introduce new lint failures on unrelated PRs. | Pin version. |
| Medium | `tokens.ts` | No direct unit tests for token helpers. | Optional coverage. |
| Low | `publisher.ts` | No Vitest coverage. | Follow-up. |
| Low | Tooling | No automated lint-wiring test. | Optional CI assertion. |
| Low | lint-staged | Pre-commit lints staged files only. | Document vs CI. |

### PM

**Summary:** Intent met. Edge functions linted in CI, local, and pre-commit. Pragmatic ESLint-ignore deviation is documented. Clean scope; ship after promote fix and commit.

| Severity | Location | Finding | Recommendation |
|----------|----------|---------|----------------|
| Low | Ticket | Wording vs implementation ("remove from ignore"). | Update on close. |
| Low | `README.md` | Deno not in Prerequisites. | Add install note. |
| Low | Working tree | Uncommitted at review. | Commit before PR. |

### Frontend/UX Engineer

**Summary:** No DX blockers on CI path itself; onboarding and failure messaging are the gaps.

| Severity | Location | Finding | Recommendation |
|----------|----------|---------|----------------|
| High | `README.md` | Deno missing from Prerequisites; bare exit 127. | Prerequisites + cross-platform install. |
| High | `npm run lint` | No friendly missing-Deno guidance. | Wrapper or prominent docs. |
| Medium | Docs | Dual-toolchain model not in one place. | Short Linting section. |
| Medium | `ARCHITECTURE.md` | Overstates CI vs pre-commit parity. | Rephrase. |
| Medium | Docs | macOS-only install note. | Cross-platform links. |
| Low | Docs / rules | Casing; `edge-functions.mdc` omits `lint:edge`. | Minor doc updates. |
| Low | lint-staged | Triple-tool appearance on edge files. | Optional negation. |

### Accessibility Engineer

**Summary:** No accessibility impact. All seven changed files are CI/tooling, docs, or backend lint fixes. No blockers.

### Principal Engineer

**Verdict:** Request Changes

One merge blocker: `promote-develop-manual.yml` must install Deno before `npm run lint`. The CORD-003 implementation is otherwise sound and meets ticket intent; after the workflow fix, residual highs (README Prerequisites, missing-Deno DX) warrant **Approve with Changes** on a follow-up pass. Pinning Deno and adding `deno check` are the highest-value post-merge follow-ups.
