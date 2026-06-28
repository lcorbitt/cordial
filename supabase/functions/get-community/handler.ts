import type { HandlerContext } from "@http/context.ts";
import { apiResponse } from "@http/response.ts";
import { getCommunityBySlugForUser } from "@services/community/community.service.ts";

/**
 * HTTP adapter for reading a community the caller belongs to.
 */
export async function handle(ctx: HandlerContext): Promise<Response> {
  if (ctx.req.method !== "GET") {
    return apiResponse.error(405, "validation_error", "Method not allowed.");
  }
  if (!ctx.user || !ctx.userClient) return apiResponse.unauthorized();

  const slug = ctx.url.searchParams.get("slug");
  if (!slug) return apiResponse.badRequest("A community slug is required.");

  const community = await getCommunityBySlugForUser(
    ctx.userClient,
    ctx.user.id,
    slug,
  );
  if (!community) {
    return apiResponse.notFound("That community was not found.");
  }

  return apiResponse.ok(community);
}
