import { z } from "zod";

import type { HandlerContext } from "@http/context.ts";
import { apiResponse } from "@http/response.ts";
import { sendCommunityInvite } from "@services/community/community.service.ts";
import { mapCommunityServiceError } from "@services/community/handler-errors.ts";
import { createServiceClient } from "@services/db.ts";

const bodySchema = z.object({
  communityId: z.string().uuid(),
  email: z.string().email(),
});

/**
 * HTTP adapter for sending a community invite email (admin only).
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

  const siteUrl =
    Deno.env.get("NEXT_PUBLIC_SITE_URL") ??
    Deno.env.get("SITE_URL") ??
    "http://localhost:3000";

  try {
    const result = await sendCommunityInvite(
      createServiceClient(),
      ctx.user.id,
      ctx.user.email,
      parsed.data,
      siteUrl,
    );
    return apiResponse.ok(result);
  } catch (error) {
    const mapped = mapCommunityServiceError(error);
    if (mapped) return mapped;
    throw error;
  }
}
