import type { HandlerContext } from "@http/context.ts";
import { apiResponse } from "@http/response.ts";
import {
  listAuditLogsAdmin,
  listAuditLogsForExportAdmin,
} from "@services/admin/admin-audit.service.ts";
import type { AuditLogListQuery } from "@shared/dto/admin.dto.ts";

function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseQuery(
  url: string | undefined,
): AuditLogListQuery & { exportAll?: boolean } {
  const params = url ? new URL(url).searchParams : new URLSearchParams();

  const sortDirection = params.get("sortDirection");
  const action = params.get("action")?.trim();
  const resourceType = params.get("resourceType")?.trim();
  const search = params.get("search")?.trim();
  const dateRange = params.get("dateRange")?.trim();

  return {
    page: parsePositiveInt(params.get("page"), 1),
    pageSize: parsePositiveInt(params.get("pageSize"), 20),
    sortColumn: params.get("sortColumn") ?? "created_at",
    sortDirection: sortDirection === "asc" ? "asc" : "desc",
    search: search || undefined,
    action: action || undefined,
    resourceType: resourceType || undefined,
    dateRange:
      dateRange === "7d" || dateRange === "30d" || dateRange === "90d"
        ? dateRange
        : "all",
    exportAll: params.get("export") === "true",
  };
}

/**
 * HTTP adapter for paginated audit log listing.
 */
export async function handle(ctx: HandlerContext): Promise<Response> {
  if (ctx.req.method !== "GET") {
    return apiResponse.error(405, "validation_error", "Method not allowed.");
  }
  if (!ctx.user) return apiResponse.unauthorized();

  const query = parseQuery(ctx.req.url);

  if (query.exportAll) {
    const items = await listAuditLogsForExportAdmin({
      sortColumn: query.sortColumn,
      sortDirection: query.sortDirection,
      search: query.search,
      action: query.action,
      resourceType: query.resourceType,
      dateRange: query.dateRange,
    });
    return apiResponse.ok({
      items,
      total: items.length,
      page: 1,
      pageSize: items.length,
    });
  }

  const result = await listAuditLogsAdmin(query);
  return apiResponse.ok(result);
}
