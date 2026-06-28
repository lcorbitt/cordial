import type { HandlerContext } from "@http/context.ts";
import { apiResponse } from "@http/response.ts";
import type { FeatureFlagResponse } from "@shared/dto/feature-flag.dto.ts";
import { evaluateFlagForUser } from "@services/feature-flag/feature-flag.service.ts";
import { createServiceClient } from "@services/db.ts";

/**
 * HTTP adapter for evaluating a single feature flag for the caller. Optional
 * auth: anonymous callers get the default/anonymous evaluation.
 */
export async function handle(ctx: HandlerContext): Promise<Response> {
  if (ctx.req.method !== "GET") {
    return apiResponse.error(405, "validation_error", "Method not allowed.");
  }

  const key = ctx.url.searchParams.get("key");
  if (!key) return apiResponse.badRequest("A flag key is required.");

  // Flag rows and targets are readable with the service client; user identity
  // comes from the validated session, never from client input.
  const client = createServiceClient();
  const enabled = await evaluateFlagForUser(client, {
    key,
    environment: Deno.env.get("APP_ENV") ?? "local",
    userId: ctx.user?.id ?? null,
  });

  const body: FeatureFlagResponse = { key, enabled };
  return apiResponse.ok(body);
}
