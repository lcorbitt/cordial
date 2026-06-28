/**
 * Standardized HTTP responses for Edge Function handlers. Every handler returns
 * through these helpers so success and error shapes are consistent and errors
 * never leak internals (OWASP A10).
 */
const baseHeaders = {
  "Content-Type": "application/json",
};

export type ErrorCode =
  | "validation_error"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "rate_limited"
  | "conflict"
  | "internal_error";

export const apiResponse = {
  ok<T>(data: T): Response {
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: baseHeaders,
    });
  },

  created<T>(data: T): Response {
    return new Response(JSON.stringify(data), {
      status: 201,
      headers: baseHeaders,
    });
  },

  noContent(): Response {
    return new Response(null, { status: 204 });
  },

  error(
    status: number,
    code: ErrorCode,
    message: string,
    details?: Record<string, unknown>,
  ): Response {
    return new Response(JSON.stringify({ error: { code, message, details } }), {
      status,
      headers: baseHeaders,
    });
  },

  badRequest(message: string, details?: Record<string, unknown>): Response {
    return apiResponse.error(400, "validation_error", message, details);
  },

  unauthorized(message = "Please sign in to continue."): Response {
    return apiResponse.error(401, "unauthorized", message);
  },

  forbidden(message = "You do not have permission to do that."): Response {
    return apiResponse.error(403, "forbidden", message);
  },

  notFound(message = "We could not find what you were looking for."): Response {
    return apiResponse.error(404, "not_found", message);
  },

  rateLimited(
    message = "You are doing that too quickly. Please wait a moment.",
  ): Response {
    return apiResponse.error(429, "rate_limited", message);
  },

  internal(): Response {
    return apiResponse.error(
      500,
      "internal_error",
      "Something went wrong on our end. Please try again shortly.",
    );
  },
};
