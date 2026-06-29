import "server-only";

import type { QueryClient } from "@tanstack/react-query";

import { EDGE_FUNCTION_SLUGS } from "@/config/edge-function-slugs";
import {
  adminQueryKeys,
  type AuditLogsQueryParams,
} from "@/hooks/queries/admin.keys";
import { edgeFunctionFetchServer } from "@/lib/edge-function/fetch.server";
import type {
  AdminOverviewResponse,
  ListAuditLogsResponse,
} from "@shared/dto/admin.dto";

export const DEFAULT_AUDIT_LOGS_QUERY: AuditLogsQueryParams = {
  page: 1,
  pageSize: 20,
  sortColumn: "created_at",
  sortDirection: "desc",
};

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
          query: {
            page: String(params.page),
            pageSize: String(params.pageSize),
            sortColumn: params.sortColumn,
            sortDirection: params.sortDirection,
          },
        },
      ),
  });
}
