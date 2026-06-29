import {
  defaultSortDirectionForAuditLogColumn,
  listAuditLogsForExport,
  listAuditLogsPaginated,
  normalizeAuditLogSortColumn,
  type AuditLogRow,
} from "@models/audit_logs.ts";
import { createServiceClient } from "@services/db.ts";
import type {
  AdminAuditLogEntry,
  ListAuditLogsResponse,
} from "@shared/dto/admin.dto.ts";
import type { PaginatedListQuery } from "@shared/dto/pagination.dto.ts";

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
  query: PaginatedListQuery,
): PaginatedListQuery {
  const sortColumn = normalizeAuditLogSortColumn(query.sortColumn);
  return {
    page: Math.max(1, query.page),
    pageSize: Math.min(100, Math.max(1, query.pageSize)),
    sortColumn,
    sortDirection:
      query.sortDirection === "asc" || query.sortDirection === "desc"
        ? query.sortDirection
        : defaultSortDirectionForAuditLogColumn(sortColumn),
  };
}

/**
 * Paginated audit log listing for super-admin screens.
 */
export async function listAuditLogsAdmin(
  query: PaginatedListQuery,
): Promise<ListAuditLogsResponse> {
  const client = createServiceClient();
  const normalized = normalizeAuditLogListQuery(query);
  const { rows, total } = await listAuditLogsPaginated(client, {
    page: normalized.page,
    pageSize: normalized.pageSize,
    sortColumn: normalizeAuditLogSortColumn(normalized.sortColumn),
    sortDirection: normalized.sortDirection,
  });

  return {
    items: rows.map(mapAuditLogRow),
    total,
    page: normalized.page,
    pageSize: normalized.pageSize,
  };
}

/**
 * Full audit log export matching current sort (no pagination slice).
 */
export async function listAuditLogsForExportAdmin(
  query: Pick<PaginatedListQuery, "sortColumn" | "sortDirection">,
): Promise<AdminAuditLogEntry[]> {
  const client = createServiceClient();
  const sortColumn = normalizeAuditLogSortColumn(query.sortColumn);
  const sortDirection =
    query.sortDirection === "asc" || query.sortDirection === "desc"
      ? query.sortDirection
      : defaultSortDirectionForAuditLogColumn(sortColumn);

  const rows = await listAuditLogsForExport(client, {
    sortColumn,
    sortDirection,
  });

  return rows.map(mapAuditLogRow);
}
