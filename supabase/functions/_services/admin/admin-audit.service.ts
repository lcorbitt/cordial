import {
  defaultSortDirectionForAuditLogColumn,
  listAuditLogsForExport,
  listAuditLogsPaginated,
  normalizeAuditLogSortColumn,
  type AuditLogRow,
} from "@models/audit_logs.ts";
import { createServiceClient } from "@services/db.ts";
import {
  normalizeAuditLogAction,
  normalizeAuditLogDateRange,
  normalizeAuditLogResourceType,
} from "@shared/admin/audit-log-catalog.ts";
import type {
  AdminAuditLogEntry,
  AuditLogListQuery,
  ListAuditLogsResponse,
} from "@shared/dto/admin.dto.ts";
import { normalizeSearchTerm } from "@shared/db/ilike.ts";

function mapAuditLogRow(row: AuditLogRow): AdminAuditLogEntry {
  return {
    id: row.id,
    actorId: row.actor_id,
    action: row.action,
    resourceType: row.resource_type,
    resourceId: row.resource_id,
    createdAt: row.created_at,
  };
}

function normalizeAuditLogListQuery(
  query: AuditLogListQuery,
): AuditLogListQuery {
  const sortColumn = normalizeAuditLogSortColumn(query.sortColumn);
  const search = normalizeSearchTerm(query.search);

  return {
    page: Math.max(1, query.page),
    pageSize: Math.min(100, Math.max(1, query.pageSize)),
    sortColumn,
    sortDirection:
      query.sortDirection === "asc" || query.sortDirection === "desc"
        ? query.sortDirection
        : defaultSortDirectionForAuditLogColumn(sortColumn),
    search: search || undefined,
    action: normalizeAuditLogAction(query.action),
    resourceType: normalizeAuditLogResourceType(query.resourceType),
    dateRange: normalizeAuditLogDateRange(query.dateRange),
  };
}

/**
 * Paginated audit log listing for super-admin screens.
 */
export async function listAuditLogsAdmin(
  query: AuditLogListQuery,
): Promise<ListAuditLogsResponse> {
  const client = createServiceClient();
  const normalized = normalizeAuditLogListQuery(query);
  const { rows, total } = await listAuditLogsPaginated(client, normalized);

  return {
    items: rows.map(mapAuditLogRow),
    total,
    page: normalized.page,
    pageSize: normalized.pageSize,
  };
}

export type AuditLogExportQuery = Pick<
  AuditLogListQuery,
  | "sortColumn"
  | "sortDirection"
  | "search"
  | "action"
  | "resourceType"
  | "dateRange"
>;

/**
 * Full audit log export matching current sort and filters (no pagination slice).
 */
export async function listAuditLogsForExportAdmin(
  query: AuditLogExportQuery,
): Promise<AdminAuditLogEntry[]> {
  const client = createServiceClient();
  const sortColumn = normalizeAuditLogSortColumn(query.sortColumn);
  const sortDirection =
    query.sortDirection === "asc" || query.sortDirection === "desc"
      ? query.sortDirection
      : defaultSortDirectionForAuditLogColumn(sortColumn);
  const search = normalizeSearchTerm(query.search);

  const rows = await listAuditLogsForExport(client, {
    sortColumn,
    sortDirection,
    search: search || undefined,
    action: normalizeAuditLogAction(query.action),
    resourceType: normalizeAuditLogResourceType(query.resourceType),
    dateRange: normalizeAuditLogDateRange(query.dateRange),
  });

  return rows.map(mapAuditLogRow);
}
