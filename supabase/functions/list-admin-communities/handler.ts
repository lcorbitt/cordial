import type { HandlerContext } from "@http/context.ts";
import { apiResponse } from "@http/response.ts";
import { listAllCommunitiesAdmin } from "@services/community/community.service.ts";
import { createServiceClient } from "@services/db.ts";

/**
 * HTTP adapter for listing all communities in the admin area.
 */
export async function handle(ctx: HandlerContext): Promise<Response> {
  if (ctx.req.method !== "GET") {
    return apiResponse.error(405, "validation_error", "Method not allowed.");
  }
  if (!ctx.user) return apiResponse.unauthorized();

  const result = await listAllCommunitiesAdmin(createServiceClient());
  return apiResponse.ok(result);
}
