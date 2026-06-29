import type { SortDirection } from "@shared/dto/pagination.dto";

export const AUDIT_LOG_SORT_COLUMNS = [
  "created_at",
  "action",
  "resource_type",
  "actor_id",
] as const;

export type AuditLogSortColumn = (typeof AUDIT_LOG_SORT_COLUMNS)[number];

export function normalizeAuditLogSortColumn(raw: string): AuditLogSortColumn {
  return AUDIT_LOG_SORT_COLUMNS.includes(raw as AuditLogSortColumn)
    ? (raw as AuditLogSortColumn)
    : "created_at";
}

export function defaultSortDirectionForAuditLogColumn(
  column: AuditLogSortColumn,
): SortDirection {
  return column === "created_at" ? "desc" : "asc";
}

export function formatAuditLogWhen(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function formatAuditLogActor(actorId: string | null): string {
  if (!actorId) {
    return "—";
  }

  return actorId.length > 12 ? `${actorId.slice(0, 8)}…` : actorId;
}

export function formatAuditLogResourceId(resourceId: string | null): string {
  if (!resourceId) {
    return "—";
  }

  return resourceId.length > 16 ? `${resourceId.slice(0, 12)}…` : resourceId;
}
