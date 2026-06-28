import type { EdgeFunctionSlug } from "@/config/edge-function-slugs";

export interface EdgeFetchOptions<TBody> {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: TBody;
  query?: Record<string, string | undefined>;
}

interface EdgeErrorBody {
  error?: {
    code?: string;
    message?: string;
    details?: Record<string, unknown>;
  };
}

export class EdgeFunctionError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: Record<string, unknown>;

  constructor(
    status: number,
    code: string,
    message: string,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "EdgeFunctionError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function buildEdgeFunctionUrl(
  supabaseUrl: string,
  slug: EdgeFunctionSlug,
  query?: Record<string, string | undefined>,
): URL {
  const url = new URL(`${supabaseUrl}/functions/v1/${slug}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) url.searchParams.set(key, value);
    }
  }
  return url;
}

/**
 * Low-level Edge Function HTTP call. Callers supply the Supabase URL, anon key,
 * and optional access token from their runtime (browser or server).
 */
export async function executeEdgeFunctionFetch<TResponse, TBody = unknown>(
  supabaseUrl: string,
  anonKey: string,
  accessToken: string | null | undefined,
  slug: EdgeFunctionSlug,
  options: EdgeFetchOptions<TBody> = {},
): Promise<TResponse> {
  const url = buildEdgeFunctionUrl(supabaseUrl, slug, options.query);

  const response = await fetch(url.toString(), {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    let parsed: EdgeErrorBody = {};
    try {
      parsed = (await response.json()) as EdgeErrorBody;
    } catch {
      // non-JSON error body
    }
    throw new EdgeFunctionError(
      response.status,
      parsed.error?.code ?? "edge_error",
      parsed.error?.message ?? "Something went wrong. Please try again.",
      parsed.error?.details,
    );
  }

  if (response.status === 204) return undefined as TResponse;
  return (await response.json()) as TResponse;
}
