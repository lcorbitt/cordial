import type { HandlerContext } from "@http/context.ts";
import { apiResponse } from "@http/response.ts";
import { getHealth } from "@services/health/health.service.ts";

/**
 * HTTP adapter for the health check. No business logic — delegates to the
 * service and shapes the response.
 */
export async function handle(ctx: HandlerContext): Promise<Response> {
  if (ctx.req.method !== "GET") {
    return apiResponse.error(405, "validation_error", "Method not allowed.");
  }

  const health = await getHealth();
  const status = health.status === "ok" ? 200 : 503;
  return new Response(JSON.stringify(health), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
