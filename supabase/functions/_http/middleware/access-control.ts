import type { Handler, Middleware } from "../context.ts";
import { apiResponse } from "../response.ts";
import {
  checkPermission,
  loadEffectiveAccess,
} from "@services/access-control/access-control.service.ts";

/**
 * Loads the caller's effective roles/permissions into context. Run after
 * withAuth. Subsequent middleware and handlers can read ctx.permissions.
 */
export const withAccessContext: Middleware = (next: Handler) => async (ctx) => {
  if (!ctx.user || !ctx.userClient) return apiResponse.unauthorized();

  const access = await loadEffectiveAccess(ctx.userClient, ctx.user.id);
  ctx.permissions = access.permissions;
  ctx.roleSlugs = access.roleSlugs;
  return next(ctx);
};

/**
 * Requires a specific permission (OWASP A01: Broken Access Control). Run after
 * withAuth; loads access context if not already present.
 */
export function withPermission(required: string): Middleware {
  return (next: Handler) => async (ctx) => {
    if (!ctx.user || !ctx.userClient) return apiResponse.unauthorized();

    if (ctx.permissions.length === 0 && ctx.roleSlugs.length === 0) {
      const access = await loadEffectiveAccess(ctx.userClient, ctx.user.id);
      ctx.permissions = access.permissions;
      ctx.roleSlugs = access.roleSlugs;
    }

    if (
      !checkPermission(
        { roleSlugs: ctx.roleSlugs, permissions: ctx.permissions },
        required,
      )
    ) {
      return apiResponse.forbidden();
    }

    return next(ctx);
  };
}
