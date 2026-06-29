import type { PaginatedListResponse } from "./pagination.dto.ts";

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
