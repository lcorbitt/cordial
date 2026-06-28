import type { Handler, Middleware } from "../context.ts";
import { apiResponse } from "../response.ts";

/**
 * Rate limiting (OWASP A07: abuse / brute force). Uses Upstash Redis over REST
 * when configured; when it is not, requests are allowed so local development is
 * unblocked. Production must configure Upstash.
 *
 * Identifier preference: authenticated user id, else client IP.
 */
const REDIS_URL = Deno.env.get("UPSTASH_REDIS_REST_URL");
const REDIS_TOKEN = Deno.env.get("UPSTASH_REDIS_REST_TOKEN");

async function incrementWindow(
  key: string,
  windowSeconds: number,
): Promise<number | null> {
  if (!REDIS_URL || !REDIS_TOKEN) return null;

  // Pipeline INCR + EXPIRE via the Upstash REST API.
  const res = await fetch(`${REDIS_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", key],
      ["EXPIRE", key, String(windowSeconds), "NX"],
    ]),
  });

  if (!res.ok) return null;
  const results = (await res.json()) as Array<{ result: number }>;
  return results[0]?.result ?? null;
}

export function withRateLimit(options: {
  name: string;
  limit: number;
  windowSeconds: number;
}): Middleware {
  return (next: Handler) => async (ctx) => {
    const ip =
      ctx.req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const identifier = ctx.user?.id ?? ip;
    const key = `rl:${options.name}:${identifier}`;

    const count = await incrementWindow(key, options.windowSeconds);
    if (count !== null && count > options.limit) {
      return apiResponse.rateLimited();
    }

    return next(ctx);
  };
}
