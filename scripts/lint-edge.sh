#!/usr/bin/env bash
# Lint Supabase Edge Functions with the Deno linter.
#
# Usage:
#   scripts/lint-edge.sh                 # lint the whole supabase/functions tree
#   scripts/lint-edge.sh <file> [<file>] # lint specific files (used by lint-staged)
#
# Edge Functions run on Deno and are intentionally excluded from Node ESLint
# (see eslint.config.mjs). This is the single source of truth for the Deno lint
# config path so `npm run lint:edge` and lint-staged stay in sync.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONFIG="$ROOT/supabase/functions/deno.json"

if ! command -v deno >/dev/null 2>&1; then
  echo "error: 'deno' is required to lint Edge Functions but was not found on PATH." >&2
  echo "Install Deno (see README Prerequisites): https://docs.deno.com/runtime/getting_started/installation/" >&2
  echo "  macOS:        brew install deno" >&2
  echo "  Linux/macOS:  curl -fsSL https://deno.land/install.sh | sh" >&2
  exit 1
fi

if [ "$#" -eq 0 ]; then
  exec deno lint --config "$CONFIG" "$ROOT/supabase/functions"
fi

exec deno lint --config "$CONFIG" "$@"
