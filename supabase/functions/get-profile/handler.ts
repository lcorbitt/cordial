import type { HandlerContext } from "@http/context.ts";
import { apiResponse } from "@http/response.ts";
import { getProfile } from "@services/user/profile.service.ts";

/**
 * HTTP adapter for reading the current user's profile.
 */
export async function handle(ctx: HandlerContext): Promise<Response> {
  if (ctx.req.method !== "GET") {
    return apiResponse.error(405, "validation_error", "Method not allowed.");
  }
  if (!ctx.user || !ctx.userClient) return apiResponse.unauthorized();

  const profile = await getProfile(ctx.userClient, ctx.user.id);
  if (!profile) return apiResponse.notFound("Your profile was not found.");

  return apiResponse.ok(profile);
}
