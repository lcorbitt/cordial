import type { AuditLogsQueryParams } from "@/hooks/queries/admin.keys";

export const DEFAULT_AUDIT_LOGS_QUERY: AuditLogsQueryParams = {
  page: 1,
  pageSize: 20,
  sortColumn: "created_at",
  sortDirection: "desc",
  search: "",
  action: "",
  resourceType: "",
  dateRange: "all",
};
