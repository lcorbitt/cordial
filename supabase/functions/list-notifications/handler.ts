import type { HandlerContext } from "@http/context.ts";
import { apiResponse } from "@http/response.ts";
import { listNotifications } from "@services/notification/notification.service.ts";

/**
 * HTTP adapter for listing the current user's in-app notifications.
 */
export async function handle(ctx: HandlerContext): Promise<Response> {
  if (ctx.req.method !== "GET") {
    return apiResponse.error(405, "validation_error", "Method not allowed.");
  }
  if (!ctx.user || !ctx.userClient) return apiResponse.unauthorized();

  const limitParam = ctx.req.url
    ? new URL(ctx.req.url).searchParams.get("limit")
    : null;
  const limit = limitParam ? Number.parseInt(limitParam, 10) : 20;
  const safeLimit =
    Number.isFinite(limit) && limit > 0 && limit <= 50 ? limit : 20;

  const result = await listNotifications(
    ctx.userClient,
    ctx.user.id,
    safeLimit,
  );
  return apiResponse.ok(result);
}
