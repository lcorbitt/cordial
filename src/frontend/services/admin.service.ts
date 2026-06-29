import { edgeFunctionFetch } from "@/lib/edge-function-fetch";
import { EDGE_FUNCTION_SLUGS } from "@/config/edge-function-slugs";
import type {
  AdminAuditLogEntry,
  AdminOverviewResponse,
  ListAuditLogsResponse,
} from "@shared/dto/admin.dto";
import type { PaginatedListQuery } from "@shared/dto/pagination.dto";

export function getAdminOverview(): Promise<AdminOverviewResponse> {
  return edgeFunctionFetch<AdminOverviewResponse>(
    EDGE_FUNCTION_SLUGS.getAdminOverview,
  );
}

export function listAuditLogs(
  query: PaginatedListQuery,
): Promise<ListAuditLogsResponse> {
  return edgeFunctionFetch<ListAuditLogsResponse>(
    EDGE_FUNCTION_SLUGS.listAuditLogs,
    {
      query: {
        page: String(query.page),
        pageSize: String(query.pageSize),
        sortColumn: query.sortColumn,
        sortDirection: query.sortDirection,
      },
    },
  );
}

export async function listAuditLogsForExport(
  query: Pick<PaginatedListQuery, "sortColumn" | "sortDirection">,
): Promise<AdminAuditLogEntry[]> {
  const result = await edgeFunctionFetch<ListAuditLogsResponse>(
    EDGE_FUNCTION_SLUGS.listAuditLogs,
    {
      query: {
        export: "true",
        sortColumn: query.sortColumn,
        sortDirection: query.sortDirection,
      },
    },
  );

  return result.items;
}
