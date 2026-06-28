import { z } from "zod";

import type { HandlerContext } from "@http/context.ts";
import { apiResponse } from "@http/response.ts";
import { acceptCommunityInvite } from "@services/community/community.service.ts";
import { mapCommunityServiceError } from "@services/community/handler-errors.ts";
import { createServiceClient } from "@services/db.ts";

const bodySchema = z.object({
  token: z.string().min(1),
});

/**
 * HTTP adapter for accepting a community invitation.
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
    const result = await acceptCommunityInvite(
      createServiceClient(),
      ctx.user.id,
      ctx.user.email,
      parsed.data.token,
    );
    return apiResponse.ok(result);
  } catch (error) {
    const mapped = mapCommunityServiceError(error);
    if (mapped) return mapped;
    throw error;
  }
}
