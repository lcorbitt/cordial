import type { Handler, Middleware } from "../context.ts";
import { apiResponse } from "../response.ts";
import { getAuthedUser } from "@services/auth.ts";

/**
 * Requires an authenticated session (OWASP A07). Populates ctx.user and the
 * RLS-bound userClient, or returns 401.
 */
export const withAuth: Middleware = (next: Handler) => async (ctx) => {
  const authed = await getAuthedUser(ctx.req);
  if (!authed) return apiResponse.unauthorized();

  ctx.user = authed.user;
  ctx.userClient = authed.userClient;
  return next(ctx);
};

/**
 * Optional auth: populates ctx.user when a session exists but does not reject
 * anonymous callers. Useful for endpoints that personalize when signed in.
 */
export const withOptionalAuth: Middleware = (next: Handler) => async (ctx) => {
  const authed = await getAuthedUser(ctx.req);
  if (authed) {
    ctx.user = authed.user;
    ctx.userClient = authed.userClient;
  }
  return next(ctx);
};
