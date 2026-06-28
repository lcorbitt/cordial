import type { HandlerContext } from "@http/context.ts";
import { apiResponse } from "@http/response.ts";
import type { PermissionsResponse } from "@shared/dto/access-control.dto.ts";

/**
 * HTTP adapter returning the caller's roles and permissions. The access context
 * is already populated by withAccessContext, so this is a pure projection.
 */
export function handle(ctx: HandlerContext): Promise<Response> {
  if (ctx.req.method !== "GET") {
    return Promise.resolve(
      apiResponse.error(405, "validation_error", "Method not allowed."),
    );
  }
  if (!ctx.user) return Promise.resolve(apiResponse.unauthorized());

  const body: PermissionsResponse = {
    roles: ctx.roleSlugs,
    permissions: ctx.permissions,
  };
  return Promise.resolve(apiResponse.ok(body));
}
