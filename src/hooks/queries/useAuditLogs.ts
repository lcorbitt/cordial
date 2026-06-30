import { useQuery } from "@tanstack/react-query";

import { listAuditLogs } from "@/frontend/services/admin.service";
import {
  adminQueryKeys,
  type AuditLogsQueryParams,
} from "@/hooks/queries/admin.keys";
import type { AuditLogListQuery } from "@shared/dto/admin.dto";

export { adminQueryKeys };

function toAuditLogListQuery(params: AuditLogsQueryParams): AuditLogListQuery {
  return {
    page: params.page,
    pageSize: params.pageSize,
    sortColumn: params.sortColumn,
    sortDirection: params.sortDirection,
    search: params.search || undefined,
    action: params.action || undefined,
    resourceType: params.resourceType || undefined,
    dateRange: params.dateRange,
  };
}

export function useAuditLogsQuery(params: AuditLogsQueryParams) {
  return useQuery({
    queryKey: adminQueryKeys.auditLogs(params),
    queryFn: () => listAuditLogs(toAuditLogListQuery(params)),
  });
}
