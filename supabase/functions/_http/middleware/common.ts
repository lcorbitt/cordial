import type { Handler, Middleware } from "../context.ts";
import { apiResponse } from "../response.ts";

const ALLOWED_ORIGINS = (Deno.env.get("CORS_ALLOWED_ORIGINS") ?? "*")
  .split(",")
  .map((o) => o.trim());

function corsHeaders(origin: string | null): Record<string, string> {
  const allowAll = ALLOWED_ORIGINS.includes("*");
  const allowedOrigin =
    allowAll || (origin && ALLOWED_ORIGINS.includes(origin))
      ? (origin ?? "*")
      : ALLOWED_ORIGINS[0];

  return {
    "Access-Control-Allow-Origin": allowAll ? "*" : allowedOrigin,
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
  };
}

/**
 * Handles CORS preflight and attaches CORS + security headers to responses.
 * OWASP A02 (Security Misconfiguration): conservative defaults, no wildcard
 * credentials.
 */
export const withCors: Middleware = (next: Handler) => async (ctx) => {
  const origin = ctx.req.headers.get("Origin");
  const headers = corsHeaders(origin);

  if (ctx.req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  const response = await next(ctx);
  for (const [k, v] of Object.entries(headers)) response.headers.set(k, v);
  return response;
};

/**
 * Security headers applied to every response.
 */
export const withSecurityHeaders: Middleware =
  (next: Handler) => async (ctx) => {
    const response = await next(ctx);
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("X-Request-Id", ctx.requestId);
    return response;
  };

/**
 * Top-level error boundary: converts unexpected throws into a safe 500 and logs
 * the detail server-side (OWASP A09/A10).
 */
export const withErrorBoundary: Middleware = (next: Handler) => async (ctx) => {
  try {
    return await next(ctx);
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        requestId: ctx.requestId,
        message: error instanceof Error ? error.message : "unknown error",
      }),
    );
    return apiResponse.internal();
  }
};

/**
 * Structured request logging for correlation (OWASP A09).
 */
export const withRequestLogging: Middleware =
  (next: Handler) => async (ctx) => {
    const start = Date.now();
    const response = await next(ctx);
    console.log(
      JSON.stringify({
        level: "info",
        requestId: ctx.requestId,
        method: ctx.req.method,
        path: ctx.url.pathname,
        status: response.status,
        durationMs: Date.now() - start,
        userId: ctx.user?.id ?? null,
      }),
    );
    return response;
  };
