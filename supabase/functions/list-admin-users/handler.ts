import type { HandlerContext } from "@http/context.ts";
import { apiResponse } from "@http/response.ts";
import {
  listAdminUsers,
  listAdminUsersForExport,
} from "@services/admin/admin-users.service.ts";
import type { AdminUserListQuery } from "@shared/dto/admin.dto.ts";

function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseQuery(
  url: string | undefined,
): AdminUserListQuery & { exportAll?: boolean } {
  const params = url ? new URL(url).searchParams : new URLSearchParams();

  const sortDirection = params.get("sortDirection");
  const search = params.get("search")?.trim();

  return {
    page: parsePositiveInt(params.get("page"), 1),
    pageSize: parsePositiveInt(params.get("pageSize"), 20),
    sortColumn: params.get("sortColumn") ?? "updated_at",
    sortDirection: sortDirection === "asc" ? "asc" : "desc",
    search: search || undefined,
    exportAll: params.get("export") === "true",
  };
}

/**
 * HTTP adapter for paginated admin platform user listing.
 */
export async function handle(ctx: HandlerContext): Promise<Response> {
  if (ctx.req.method !== "GET") {
    return apiResponse.error(405, "validation_error", "Method not allowed.");
  }
  if (!ctx.user) return apiResponse.unauthorized();

  const query = parseQuery(ctx.req.url);

  if (query.exportAll) {
    const items = await listAdminUsersForExport({
      sortColumn: query.sortColumn,
      sortDirection: query.sortDirection,
      search: query.search,
    });
    return apiResponse.ok({
      items,
      total: items.length,
      page: 1,
      pageSize: items.length,
    });
  }

  const result = await listAdminUsers(query);
  return apiResponse.ok(result);
}
