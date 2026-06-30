import type { HandlerContext } from "@http/context.ts";
import { apiResponse } from "@http/response.ts";
import {
  listCommunitiesAdminPaginated,
  listCommunitiesForExportAdmin,
} from "@services/community/community.service.ts";
import { createServiceClient } from "@services/db.ts";
import type { PaginatedListQuery } from "@shared/dto/pagination.dto.ts";

function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseQuery(
  url: string | undefined,
): PaginatedListQuery & { exportAll?: boolean } {
  const params = url ? new URL(url).searchParams : new URLSearchParams();

  const sortDirection = params.get("sortDirection");
  return {
    page: parsePositiveInt(params.get("page"), 1),
    pageSize: parsePositiveInt(params.get("pageSize"), 20),
    sortColumn: params.get("sortColumn") ?? "name",
    sortDirection: sortDirection === "desc" ? "desc" : "asc",
    exportAll: params.get("export") === "true",
  };
}

/**
 * HTTP adapter for paginated admin community listing.
 */
export async function handle(ctx: HandlerContext): Promise<Response> {
  if (ctx.req.method !== "GET") {
    return apiResponse.error(405, "validation_error", "Method not allowed.");
  }
  if (!ctx.user) return apiResponse.unauthorized();

  const query = parseQuery(ctx.req.url);
  const serviceClient = createServiceClient();

  if (query.exportAll) {
    const items = await listCommunitiesForExportAdmin(serviceClient, {
      sortColumn: query.sortColumn,
      sortDirection: query.sortDirection,
    });
    return apiResponse.ok({
      items,
      total: items.length,
      page: 1,
      pageSize: items.length,
    });
  }

  const result = await listCommunitiesAdminPaginated(serviceClient, query);
  return apiResponse.ok(result);
}
