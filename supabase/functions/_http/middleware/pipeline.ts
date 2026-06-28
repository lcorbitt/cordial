import type { Handler, HandlerContext, Middleware } from "../context.ts";

/**
 * Composes middleware into a single handler, applied left-to-right: the first
 * middleware in the list is the outermost. Lightweight and dependency-free —
 * the Kong-like gateway pattern without an external gateway.
 */
export function createPipeline(...middleware: Middleware[]) {
  return (handler: Handler): Handler => {
    return middleware.reduceRight((next, mw) => mw(next), handler);
  };
}

/**
 * Builds the initial context for a request. Called by each function's entry
 * before the pipeline runs.
 */
export function createContext(req: Request): HandlerContext {
  return {
    req,
    requestId: crypto.randomUUID(),
    url: new URL(req.url),
    user: null,
    userClient: null,
    permissions: [],
    roleSlugs: [],
  };
}
