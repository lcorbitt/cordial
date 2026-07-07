/**
 * Shared configuration for k6 load tests.
 *
 * Local defaults target the standard Supabase + Next dev stack.
 * Override via environment variables for staging stress runs.
 */
export const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";
export const SUPABASE_URL = __ENV.SUPABASE_URL || "http://127.0.0.1:54321";
export const SUPABASE_ANON_KEY = __ENV.SUPABASE_ANON_KEY || "";
export const LOAD_TEST_EMAIL = __ENV.LOAD_TEST_EMAIL || "member@local.test";
export const LOAD_TEST_PASSWORD = __ENV.LOAD_TEST_PASSWORD || "password123";

export function functionsUrl(slug) {
  return `${SUPABASE_URL}/functions/v1/${slug}`;
}
