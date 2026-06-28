import { z } from "zod";

import type { HandlerContext } from "@http/context.ts";
import { apiResponse } from "@http/response.ts";
import { createCommunity } from "@services/community/community.service.ts";
import { mapCommunityServiceError } from "@services/community/handler-errors.ts";
import { createServiceClient } from "@services/db.ts";

const bodySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

/**
 * HTTP adapter for creating a community (admin only).
 */
export async function handle(ctx: HandlerContext): Promise<Response> {
  if (ctx.req.method !== "POST") {
    return apiResponse.error(405, "validation_error", "Method not allowed.");
  }
  if (!ctx.user) return apiResponse.unauthorized();

  let json: unknown;
  try {
    json = await ctx.req.json();
  } catch {
    return apiResponse.badRequest("Please send a valid request.");
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return apiResponse.badRequest("Please check the fields and try again.", {
      issues: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const community = await createCommunity(
      createServiceClient(),
      ctx.user.id,
      parsed.data,
    );
    return apiResponse.created(community);
  } catch (error) {
    const mapped = mapCommunityServiceError(error);
    if (mapped) return mapped;
    throw error;
  }
}
