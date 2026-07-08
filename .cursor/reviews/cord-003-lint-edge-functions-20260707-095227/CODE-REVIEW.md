# Code Review

## Metadata

| Field | Value |
|-------|-------|
| Branch | cord-003/lint-edge-functions |
| Base | develop |
| Commit range | uncommitted working tree (second-pass review) |
| Reviewed at | 2026-07-07T09:52:27 local |
| Verdict | Approve with Changes |

## Executive Summary

CORD-003 wires `deno lint` into `npm run lint`, lint-staged, and CI with two behavior-preserving `require-await` fixes. The first-pass **Request Changes** verdict is fully addressed: `promote-develop-manual.yml` now installs Deno 2.2.5 before `npm run lint`, both workflows pin an exact Deno version, README Prerequisites documents cross-platform Deno install, and ARCHITECTURE accurately distinguishes staged pre-commit lint from full-project CI verify. All eight specialists confirm no merge blockers; `npm run lint` passes locally (97 edge files) and 81/81 unit tests pass. Residual risk is toolchain completeness and minor local/CI version drift (README `2.2+` vs CI `2.2.5`), not functional correctness of the lint gate.

## Merge Blockers

None.

## Findings

### Blockers

None.

### Resolved (first pass)

| Location | Original finding | Resolution |
|----------|------------------|------------|
| `.github/workflows/promote-develop-manual.yml:116-121` | Ran `npm run lint` without `denoland/setup-deno`; manual promote would fail with `deno: command not found`. | Added `denoland/setup-deno@v2` with `deno-version: 2.2.5` before Lint step. |
| `README.md` (Prerequisites) | Deno absent from prerequisites; macOS-only install implied. | Deno 2.2+ listed with official guide, `brew`, and `curl` install paths; Scripts footnote references Prerequisites and notes CI pins 2.2.5. |
| `.github/workflows/ci.yml` + `promote-develop-manual.yml` | Floating `deno-version: v2.x` risked CI drift and unstable cache keys. | Both workflows pin exact `deno-version: 2.2.5`. |
| `ARCHITECTURE.md` | Overstated CI vs pre-commit parity ("same lint gates"). | Reworded: pre-commit lints staged files only; CI verify runs linters over the full project. |

### High

None (first-pass Highs resolved; see Resolved table).

### Medium

| Location | Finding | Recommendation |
|----------|---------|----------------|
| `supabase/functions/**` + CI | Edge code excluded from root `tsc`; no `deno check` in CI. Type errors in the deploy surface can slip through lint-only gating. | Follow-up ticket: add `deno check` to `lint:edge` and CI. |
| `README.md` (Prerequisites) + `.github/workflows/ci.yml` | Prerequisites say Deno **2.2+**; CI pins **2.2.5**. Contributors on 2.2.0-2.2.4 may pass locally and fail in CI (or vice versa on rule changes). | Align Prerequisites to `2.2.5` (or add `.tool-versions` / `mise` pin) for full local/CI parity. |

### Low

| Location | Finding | Recommendation |
|----------|---------|----------------|
| `package.json` (`lint:edge`) + `lint-staged` | `deno lint --config supabase/functions/deno.json` path duplicated. | Optional: extract shared script or env var to avoid drift. |
| `.cursor/rules/edge-functions.mdc` | Does not mention `npm run lint:edge`. | Add one-line pointer in a docs follow-up. |
| `npm run lint` / pre-commit | Missing Deno still surfaces opaque `command not found` (exit 127); README mitigates but does not wrap the error. | Optional friendly wrapper script with install guidance. |
| `supabase/functions/deno.json` | Unused `fmt` block; Prettier governs formatting. | Remove or document intentional split in follow-up. |
| `supabase/functions/deno.json` vs root `package.json` | Latent dual-runtime drift (`zod@3` in Deno vs `zod@^4` in Node). | Monitor; align if shared `_shared` types diverge. |
| `denoland/setup-deno@v2` | Action major tag not SHA-pinned (SOC2 change-control note). | Consistent with repo norms (`checkout@v4`, etc.); pin SHA only if org policy requires. |
| `README.md` (Scripts) | Casing inconsistency: "edge functions" vs "Edge Functions". | Normalize on next docs pass. |
| `denoland/setup-deno@v2` | No `cache: true`; no `deno.lock` yet. | Accept for merge; add cache when lockfile exists (Performance: negligible for lint-only, manual promote infrequent). |
| Ticket CORD-003 | Literal wording was "remove from ESLint ignore"; pragmatic keep-ignore + Deno lint is documented. | Update ticket wording on close. |
| Working tree | Changes uncommitted at second-pass review. | Commit before opening PR. |

## Cross-Cutting Themes

- **Workflow coverage complete** - Both workflows that invoke `npm run lint` (`ci.yml`, `promote-develop-manual.yml`) now install Deno; `promote-develop.yml` correctly does not run lint.
- **Version pinning / reproducibility** - Exact `2.2.5` pin in CI resolves first-pass floating-version concern; residual gap is README `2.2+` vs CI exact pin (Backend, QA, Frontend).
- **Edge toolchain completeness** - Lint gate is the right first step; `deno check` typechecking and dual-runtime dependency alignment remain post-merge gaps.
- **Pragmatic ESLint/Deno split** - `supabase/functions/**` stays in ESLint `globalIgnores` with explanatory comment; docs now make the dual-toolchain model discoverable.
- **Scope discipline** - CORD-003 delivers ticket intent (CI + local + pre-commit); config dedup, `edge-functions.mdc`, and friendly error wrappers are optional polish.

## Specialist Reports

### Senior Engineer

**Summary:** No blockers. All four first-pass fixes verified. `require-await` fixes behaviorally equivalent. Residual items out of scope or optional.

| Severity | Location | Finding | Recommendation |
|----------|----------|---------|----------------|
| Low | `package.json` + lint-staged | `deno.json` config path duplicated. | Optional shared script. |
| Low | `.cursor/rules/edge-functions.mdc` | Omits `lint:edge`. | Add pointer in follow-up. |

### PM

**Summary:** Ticket intent fully delivered (CI + local + pre-commit). Fixes stayed in scope. No blockers.

| Severity | Location | Finding | Recommendation |
|----------|----------|---------|----------------|
| Low | Ticket CORD-003 | Wording vs implementation. | Update on close. |
| Low | Edge toolchain | No `deno check`. | Follow-up ticket. |
| Low | `.cursor/rules/edge-functions.mdc` | Missing `lint:edge` pointer. | Doc follow-up. |
| Low | Working tree | Changes uncommitted. | Commit before PR. |

### QA Engineer

**Summary:** Prior blocker resolved. Only `ci.yml` and `promote-develop-manual.yml` run `npm run lint`; `promote-develop.yml` correctly unchanged. 81/81 unit tests pass. No blockers.

| Severity | Location | Finding | Recommendation |
|----------|----------|---------|----------------|
| Medium | README + CI | Local `2.2+` vs CI `2.2.5` drift. | Pin Prerequisites or add `.tool-versions`. |
| Low | pre-commit / `lint:edge` | Opaque missing-Deno error. | Docs or wrapper. |
| Low | `package.json` + lint-staged | Config path duplication. | Optional dedup. |
| Low | CI / edge | No `deno check`. | Follow-up ticket. |

### Performance Engineer

**Summary:** Pin 2.2.5 improves reproducibility and tool-cache stability. `deno lint` sub-second on 97 files; `setup-deno` cold install dominates. No blockers.

| Severity | Location | Finding | Recommendation |
|----------|----------|---------|----------------|
| Low | `setup-deno` | `cache: true` not warranted yet (lint-only, no `deno.lock`). | Add when lockfile exists. |
| Low | `promote-develop-manual.yml` | `setup-deno` on infrequent manual workflow. | Negligible cost; accept. |

### Security Engineer

**Summary:** Exact Deno pin resolves change-control concern. Promote workflow adds no secrets or permission changes. No blockers.

| Severity | Location | Finding | Recommendation |
|----------|----------|---------|----------------|
| Low | `denoland/setup-deno@v2` | Major tag not SHA-pinned. | Consistent with repo norms; pin SHA if org policy requires. |

**Verdict:** No security blockers for merging CORD-003.

### Accessibility Engineer

**Summary:** No a11y impact. Lint/CI/tooling changes do not touch UI, routes, or user-facing copy. No blockers.

### Frontend/UX Engineer

**Summary:** All prior High/Medium DX findings resolved (Prerequisites, cross-platform install, ARCHITECTURE parity, discoverability). No new em dashes. No blockers.

| Severity | Location | Finding | Recommendation |
|----------|----------|---------|----------------|
| Low | `README.md` (Scripts) | "edge functions" vs "Edge Functions" casing. | Normalize on docs pass. |
| Low | README + CI | `2.2+` vs `2.2.5` alignment. | Match Prerequisites to CI pin. |
| Low | `.cursor/rules/edge-functions.mdc` | Missing `lint:edge` pointer. | Doc follow-up. |
| Low | `npm run lint` | Optional friendly missing-Deno wrapper. | Nice-to-have. |

### Backend Engineer

**Summary:** `require-await` fixes semantically equivalent. Single-root `deno lint` gate correct. No blockers.

| Severity | Location | Finding | Recommendation |
|----------|----------|---------|----------------|
| Medium | CI / edge surface | No `deno check`; edge excluded from `tsc`. | Follow-up: add `deno check`. |
| Low | README + CI | `2.2+` vs `2.2.5` local/CI drift. | Align Prerequisites or toolchain file. |
| Low | `deno.json` vs root | Possible zod version drift. | Monitor alignment. |
| Low | `deno.json` | Unused `fmt` block. | Remove or document. |

### Principal Engineer

**Verdict:** Approve with Changes

No merge blockers. First-pass blocker and High onboarding gaps are resolved. Meaningful post-merge follow-ups: align README Deno version with CI pin (`2.2.5`), open `deno check` ticket, and commit working tree before PR. Specialist consensus is unanimous; no conflicts on merge decision.
