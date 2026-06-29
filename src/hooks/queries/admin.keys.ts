export const adminQueryKeyRoot = ["admin"] as const;

export interface AuditLogsQueryParams {
  page: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: "asc" | "desc";
}

export const adminQueryKeys = {
  all: adminQueryKeyRoot,
  overview: () => [...adminQueryKeyRoot, "overview"] as const,
  auditLogs: (params: AuditLogsQueryParams) =>
    [...adminQueryKeyRoot, "audit-logs", params] as const,
};
