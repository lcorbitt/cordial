import "server-only";

import type { QueryClient } from "@tanstack/react-query";

import { EDGE_FUNCTION_SLUGS } from "@/config/edge-function-slugs";
import {
  adminQueryKeys,
  type AdminUsersQueryParams,
  type AuditLogsQueryParams,
} from "@/hooks/queries/admin.keys";
import { edgeFunctionFetchServer } from "@/lib/edge-function/fetch.server";
import type {
  AdminOverviewResponse,
  ListAdminUsersResponse,
  ListAuditLogsResponse,
} from "@shared/dto/admin.dto";

import { DEFAULT_AUDIT_LOGS_QUERY } from "@/app/(authenticated)/admin/audit/components/AdminAuditLogs/filter-constants";

export { DEFAULT_AUDIT_LOGS_QUERY };

export async function prefetchAdminOverviewQuery(
  queryClient: QueryClient,
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: adminQueryKeys.overview(),
    queryFn: () =>
      edgeFunctionFetchServer<AdminOverviewResponse>(
        EDGE_FUNCTION_SLUGS.getAdminOverview,
      ),
  });
}

function buildAuditLogsPrefetchQuery(
  params: AuditLogsQueryParams,
): Record<string, string> {
  const query: Record<string, string> = {
    page: String(params.page),
    pageSize: String(params.pageSize),
    sortColumn: params.sortColumn,
    sortDirection: params.sortDirection,
    dateRange: params.dateRange,
  };

  if (params.search) {
    query.search = params.search;
  }
  if (params.action) {
    query.action = params.action;
  }
  if (params.resourceType) {
    query.resourceType = params.resourceType;
  }

  return query;
}

export async function prefetchAuditLogsQuery(
  queryClient: QueryClient,
  params: AuditLogsQueryParams = DEFAULT_AUDIT_LOGS_QUERY,
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: adminQueryKeys.auditLogs(params),
    queryFn: () =>
      edgeFunctionFetchServer<ListAuditLogsResponse>(
        EDGE_FUNCTION_SLUGS.listAuditLogs,
        {
          query: buildAuditLogsPrefetchQuery(params),
        },
      ),
  });
}

export const DEFAULT_ADMIN_USERS_QUERY: AdminUsersQueryParams = {
  page: 1,
  pageSize: 20,
  sortColumn: "updated_at",
  sortDirection: "desc",
  search: "",
};

function buildAdminUsersPrefetchQuery(
  params: AdminUsersQueryParams,
): Record<string, string> {
  const query: Record<string, string> = {
    page: String(params.page),
    pageSize: String(params.pageSize),
    sortColumn: params.sortColumn,
    sortDirection: params.sortDirection,
  };

  if (params.search) {
    query.search = params.search;
  }

  return query;
}

export async function prefetchAdminUsersQuery(
  queryClient: QueryClient,
  params: AdminUsersQueryParams = DEFAULT_ADMIN_USERS_QUERY,
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: adminQueryKeys.users(params),
    queryFn: () =>
      edgeFunctionFetchServer<ListAdminUsersResponse>(
        EDGE_FUNCTION_SLUGS.listAdminUsers,
        { query: buildAdminUsersPrefetchQuery(params) },
      ),
  });
}
