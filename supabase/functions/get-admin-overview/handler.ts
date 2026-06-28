import type { HandlerContext } from "@http/context.ts";
import { apiResponse } from "@http/response.ts";
import { getAdminOverview } from "@services/admin/admin-overview.service.ts";

/**
 * HTTP adapter for the superadmin analytics overview.
 */
export async function handle(ctx: HandlerContext): Promise<Response> {
  if (ctx.req.method !== "GET") {
    return apiResponse.error(405, "validation_error", "Method not allowed.");
  }
  if (!ctx.user) return apiResponse.unauthorized();

  const overview = await getAdminOverview();
  return apiResponse.ok(overview);
}
