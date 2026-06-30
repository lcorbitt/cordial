import type { AuditLogDateRange } from "@shared/dto/admin.dto.ts";

export const AUDIT_LOG_ACTIONS = [
  "community.created",
  "community.member_joined",
  "profile.updated",
  "user.created",
] as const;

export type AuditLogAction = (typeof AUDIT_LOG_ACTIONS)[number];

export const AUDIT_LOG_RESOURCE_TYPES = [
  "community",
  "profile",
  "user",
] as const;

export type AuditLogResourceType = (typeof AUDIT_LOG_RESOURCE_TYPES)[number];

export const AUDIT_LOG_DATE_RANGES = ["all", "7d", "30d", "90d"] as const;

export function normalizeAuditLogAction(
  raw: string | null | undefined,
): AuditLogAction | undefined {
  if (!raw) {
    return undefined;
  }

  return AUDIT_LOG_ACTIONS.includes(raw as AuditLogAction)
    ? (raw as AuditLogAction)
    : undefined;
}

export function normalizeAuditLogResourceType(
  raw: string | null | undefined,
): AuditLogResourceType | undefined {
  if (!raw) {
    return undefined;
  }

  return AUDIT_LOG_RESOURCE_TYPES.includes(raw as AuditLogResourceType)
    ? (raw as AuditLogResourceType)
    : undefined;
}

export function normalizeAuditLogDateRange(
  raw: string | null | undefined,
): AuditLogDateRange {
  if (!raw || raw === "all") {
    return "all";
  }

  return AUDIT_LOG_DATE_RANGES.includes(raw as AuditLogDateRange)
    ? (raw as AuditLogDateRange)
    : "all";
}

const DATE_RANGE_DAYS: Record<Exclude<AuditLogDateRange, "all">, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

/**
 * Returns an ISO timestamp cutoff for preset audit-log date ranges.
 */
export function auditLogDateRangeCutoff(
  dateRange: AuditLogDateRange,
): string | null {
  if (dateRange === "all") {
    return null;
  }

  const days = DATE_RANGE_DAYS[dateRange];
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - days);
  return cutoff.toISOString();
}
