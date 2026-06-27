#!/usr/bin/env bash
# Start everything needed for local development in one terminal:
# Supabase (if not running), Next.js, Edge Functions, and Inngest dev server.
set -euo pipefail

if ! supabase status >/dev/null 2>&1; then
  echo "Starting local Supabase stack…"
  supabase start
fi

export INNGEST_DEV="${INNGEST_DEV:-1}"
export INNGEST_EVENT_KEY="${INNGEST_EVENT_KEY:-local}"

echo "Starting Next.js, Edge Functions, and Inngest…"
echo "  App:        http://localhost:3000"
echo "  Functions:  supabase functions serve"
echo "  Inngest:    http://localhost:3000/api/inngest"
echo ""

exec concurrently -n next,functions,inngest -c blue,magenta,yellow \
  "next dev" \
  "supabase functions serve" \
  "npx --yes inngest-cli@latest dev -u http://localhost:3000/api/inngest"
