import type { PaginatedListResponse } from "./pagination.dto.ts";
import type { PaginatedListQuery } from "./pagination.dto.ts";

export type AuditLogDateRange = "all" | "7d" | "30d" | "90d";

export interface AuditLogListQuery extends PaginatedListQuery {
  search?: string;
  action?: string;
  resourceType?: string;
  dateRange?: AuditLogDateRange;
}

export interface AdminAuditLogEntry {
  id: string;
  actorId: string | null;
  action: string;
  resourceType: string;
  resourceId: string | null;
  createdAt: string;
}

export type ListAuditLogsResponse = PaginatedListResponse<AdminAuditLogEntry>;

export interface AdminAnalyticsEventEntry {
  id: string;
  eventName: string;
  userId: string | null;
  environment: string;
  createdAt: string;
}

export interface AdminOverviewResponse {
  totalProfiles: number;
  auditLogCount24h: number;
  analyticsEventCount24h: number;
  recentAuditLogs: AdminAuditLogEntry[];
  recentAnalyticsEvents: AdminAnalyticsEventEntry[];
}

export interface AdminUserListItem {
  userId: string;
  displayName: string;
  email: string;
  roleSlugs: string[];
  updatedAt: string;
}

export interface AdminUserListQuery extends PaginatedListQuery {
  search?: string;
}

export type ListAdminUsersResponse = PaginatedListResponse<AdminUserListItem>;
