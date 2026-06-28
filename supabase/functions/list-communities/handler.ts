import type { HandlerContext } from "@http/context.ts";
import { apiResponse } from "@http/response.ts";
import { listCommunitiesForUser } from "@services/community/community.service.ts";

/**
 * HTTP adapter for listing communities the caller belongs to.
 */
export async function handle(ctx: HandlerContext): Promise<Response> {
  if (ctx.req.method !== "GET") {
    return apiResponse.error(405, "validation_error", "Method not allowed.");
  }
  if (!ctx.user || !ctx.userClient) return apiResponse.unauthorized();

  const result = await listCommunitiesForUser(ctx.userClient);
  return apiResponse.ok(result);
}
