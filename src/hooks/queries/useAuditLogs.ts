import { useQuery } from "@tanstack/react-query";

import { listAuditLogs } from "@/frontend/services/admin.service";
import {
  adminQueryKeys,
  type AuditLogsQueryParams,
} from "@/hooks/queries/admin.keys";

export { adminQueryKeys };

export function useAuditLogsQuery(params: AuditLogsQueryParams) {
  return useQuery({
    queryKey: adminQueryKeys.auditLogs(params),
    queryFn: () => listAuditLogs(params),
  });
}
