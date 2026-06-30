import type { AuditLogDateRange } from "@shared/dto/admin.dto";

export const adminQueryKeyRoot = ["admin"] as const;

export interface AuditLogsQueryParams {
  page: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: "asc" | "desc";
  search: string;
  action: string;
  resourceType: string;
  dateRange: AuditLogDateRange;
}

export interface AdminUsersQueryParams {
  page: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: "asc" | "desc";
  search: string;
}

export const adminQueryKeys = {
  all: adminQueryKeyRoot,
  overview: () => [...adminQueryKeyRoot, "overview"] as const,
  auditLogs: (params: AuditLogsQueryParams) =>
    [...adminQueryKeyRoot, "audit-logs", params] as const,
  users: (params: AdminUsersQueryParams) =>
    [...adminQueryKeyRoot, "users", params] as const,
};
