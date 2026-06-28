import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Request context passed through the middleware pipeline into a handler. Each
 * middleware enriches it (request id, authenticated user, permissions).
 */
export interface HandlerContext {
  req: Request;
  requestId: string;
  url: URL;
  // Populated by withAuth.
  user: { id: string; email: string | null } | null;
  // Supabase client bound to the caller's JWT (RLS applies).
  userClient: SupabaseClient | null;
  // Effective permissions, populated by withAccessControl when used.
  permissions: string[];
  roleSlugs: string[];
}

export type Handler = (ctx: HandlerContext) => Promise<Response>;

export type Middleware = (next: Handler) => Handler;
