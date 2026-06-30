import { edgeFunctionFetch } from "@/lib/edge-function-fetch";
import { EDGE_FUNCTION_SLUGS } from "@/config/edge-function-slugs";
import type {
  AdminAuditLogEntry,
  AdminOverviewResponse,
  AdminUserListQuery,
  AuditLogListQuery,
  ListAdminUsersResponse,
  ListAuditLogsResponse,
} from "@shared/dto/admin.dto";

export function getAdminOverview(): Promise<AdminOverviewResponse> {
  return edgeFunctionFetch<AdminOverviewResponse>(
    EDGE_FUNCTION_SLUGS.getAdminOverview,
  );
}

function buildAuditLogsQuery(query: AuditLogListQuery): Record<string, string> {
  const params: Record<string, string> = {
    page: String(query.page),
    pageSize: String(query.pageSize),
    sortColumn: query.sortColumn,
    sortDirection: query.sortDirection,
    dateRange: query.dateRange ?? "all",
  };

  if (query.search) {
    params.search = query.search;
  }
  if (query.action) {
    params.action = query.action;
  }
  if (query.resourceType) {
    params.resourceType = query.resourceType;
  }

  return params;
}

export function listAuditLogs(
  query: AuditLogListQuery,
): Promise<ListAuditLogsResponse> {
  return edgeFunctionFetch<ListAuditLogsResponse>(
    EDGE_FUNCTION_SLUGS.listAuditLogs,
    {
      query: buildAuditLogsQuery(query),
    },
  );
}

export type AuditLogExportQuery = Pick<
  AuditLogListQuery,
  | "sortColumn"
  | "sortDirection"
  | "search"
  | "action"
  | "resourceType"
  | "dateRange"
>;

export async function listAuditLogsForExport(
  query: AuditLogExportQuery,
): Promise<AdminAuditLogEntry[]> {
  const result = await edgeFunctionFetch<ListAuditLogsResponse>(
    EDGE_FUNCTION_SLUGS.listAuditLogs,
    {
      query: {
        export: "true",
        ...buildAuditLogsQuery({
          page: 1,
          pageSize: 1,
          sortColumn: query.sortColumn,
          sortDirection: query.sortDirection,
          search: query.search,
          action: query.action,
          resourceType: query.resourceType,
          dateRange: query.dateRange,
        }),
      },
    },
  );

  return result.items;
}

function buildAdminUsersQuery(
  query: AdminUserListQuery,
): Record<string, string> {
  const params: Record<string, string> = {
    page: String(query.page),
    pageSize: String(query.pageSize),
    sortColumn: query.sortColumn,
    sortDirection: query.sortDirection,
  };

  if (query.search) {
    params.search = query.search;
  }

  return params;
}

export function listAdminUsers(
  query: AdminUserListQuery,
): Promise<ListAdminUsersResponse> {
  return edgeFunctionFetch<ListAdminUsersResponse>(
    EDGE_FUNCTION_SLUGS.listAdminUsers,
    {
      query: buildAdminUsersQuery(query),
    },
  );
}

export type AdminUserExportQuery = Pick<
  AdminUserListQuery,
  "sortColumn" | "sortDirection" | "search"
>;

export async function listAdminUsersForExport(
  query: AdminUserExportQuery,
): Promise<ListAdminUsersResponse["items"]> {
  const result = await edgeFunctionFetch<ListAdminUsersResponse>(
    EDGE_FUNCTION_SLUGS.listAdminUsers,
    {
      query: {
        export: "true",
        ...buildAdminUsersQuery({
          page: 1,
          pageSize: 1,
          sortColumn: query.sortColumn,
          sortDirection: query.sortDirection,
          search: query.search,
        }),
      },
    },
  );

  return result.items;
}
