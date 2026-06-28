import type { Handler, HandlerContext, Middleware } from "../context.ts";
import { apiResponse } from "../response.ts";

/**
 * Resource ownership guard (OWASP A01: Broken Access Control / IDOR).
 *
 * Before a mutation on a specific resource, verify the caller owns it OR holds
 * an override permission. The `loadOwnerId` function fetches the resource's
 * owner; if it returns null the resource does not exist. Never trust a
 * client-supplied id without this check.
 */
export function withResourceOwnership(options: {
  loadOwnerId: (ctx: HandlerContext) => Promise<string | null>;
  overridePermission?: string;
}): Middleware {
  return (next: Handler) => async (ctx) => {
    if (!ctx.user) return apiResponse.unauthorized();

    const ownerId = await options.loadOwnerId(ctx);
    if (ownerId === null) return apiResponse.notFound();

    const isOwner = ownerId === ctx.user.id;
    const hasOverride = options.overridePermission
      ? ctx.permissions.includes(options.overridePermission)
      : false;

    if (!isOwner && !hasOverride) return apiResponse.forbidden();

    return next(ctx);
  };
}
