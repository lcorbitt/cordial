import type { Handler } from "../context.ts";
import { createContext, createPipeline } from "./pipeline.ts";
import {
  withCors,
  withErrorBoundary,
  withRequestLogging,
  withSecurityHeaders,
} from "./common.ts";
import { withAuth, withOptionalAuth } from "./auth.ts";
import { withRateLimit } from "./rate-limit.ts";
import { withAccessContext, withPermission } from "./access-control.ts";

export type RateLimitOpts = {
  name: string;
  limit: number;
  windowSeconds: number;
};

const coreStack = [
  withErrorBoundary,
  withRequestLogging,
  withSecurityHeaders,
  withCors,
] as const;

function serve(
  handler: Handler,
  ...middleware: Parameters<typeof createPipeline>
): void {
  const pipeline = createPipeline(...coreStack, ...middleware)(handler);
  Deno.serve((req) => pipeline(createContext(req)));
}

/** Public endpoints — optional rate limit, no auth. */
export function servePublic(
  handler: Handler,
  opts?: { rateLimit?: RateLimitOpts },
): void {
  const extra = opts?.rateLimit ? [withRateLimit(opts.rateLimit)] : [];
  serve(handler, ...extra);
}

/** Optional auth — for endpoints that serve both anonymous and signed-in callers. */
export function serveOptionalAuth(
  handler: Handler,
  rateLimit: RateLimitOpts,
): void {
  serve(handler, withRateLimit(rateLimit), withOptionalAuth);
}

/** Authenticated endpoints — JWT required, RLS-bound user client. */
export function serveAuthenticated(
  handler: Handler,
  rateLimit: RateLimitOpts,
): void {
  serve(handler, withRateLimit(rateLimit), withAuth);
}

/** Authenticated endpoints with roles and permissions loaded into context. */
export function serveWithAccessContext(
  handler: Handler,
  rateLimit: RateLimitOpts,
): void {
  serve(handler, withRateLimit(rateLimit), withAuth, withAccessContext);
}

/** Authenticated endpoints that require a specific permission. */
export function serveWithPermission(
  handler: Handler,
  rateLimit: RateLimitOpts,
  permission: string,
): void {
  serve(
    handler,
    withRateLimit(rateLimit),
    withAuth,
    withAccessContext,
    withPermission(permission),
  );
}
