import { z } from "zod";

import type { HandlerContext } from "@http/context.ts";
import { apiResponse } from "@http/response.ts";
import {
  createAvatarUploadUrl,
  StorageValidationError,
} from "@services/storage/storage.service.ts";
import { createServiceClient } from "@services/db.ts";
import { resolveBrowserSupabaseUrl } from "@shared/storage/avatar.ts";

const bodySchema = z.object({
  contentType: z.enum(["image/jpeg", "image/png", "image/webp"]),
});

/**
 * HTTP adapter for issuing a signed avatar upload URL for the current user.
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
    return apiResponse.badRequest("Please choose a JPEG, PNG, or WebP image.", {
      issues: parsed.error.flatten().fieldErrors,
    });
  }

  const supabaseUrl = resolveBrowserSupabaseUrl((key) => Deno.env.get(key));

  if (!supabaseUrl) {
    throw new Error("Supabase URL is not configured.");
  }

  try {
    const result = await createAvatarUploadUrl(
      createServiceClient(),
      ctx.user.id,
      parsed.data.contentType,
      supabaseUrl,
    );
    return apiResponse.ok(result);
  } catch (error) {
    if (error instanceof StorageValidationError) {
      return apiResponse.badRequest(error.message);
    }
    throw error;
  }
}
