import type { SupabaseClient } from "@supabase/supabase-js";

import {
  auditLogDateRangeCutoff,
  normalizeAuditLogAction,
  normalizeAuditLogDateRange,
  normalizeAuditLogResourceType,
} from "@shared/admin/audit-log-catalog.ts";
import type { AuditLogDateRange } from "@shared/dto/admin.dto.ts";
import { normalizeSearchTerm } from "@shared/db/ilike.ts";
import type { SortDirection } from "@shared/dto/pagination.dto.ts";

/**
 * All `.from("audit_logs")` access lives here.
 */
export interface AuditLogRow {
  id: string;
  actor_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  created_at: string;
}

const AUDIT_LOG_COLUMNS =
  "id, actor_id, action, resource_type, resource_id, created_at";

export const AUDIT_LOG_SORT_COLUMNS = [
  "created_at",
  "action",
  "resource_type",
  "actor_id",
] as const;

export type AuditLogSortColumn = (typeof AUDIT_LOG_SORT_COLUMNS)[number];

export interface AuditLogListQuery {
  page: number;
  pageSize: number;
  sortColumn: AuditLogSortColumn;
  sortDirection: SortDirection;
  search?: string;
  action?: string;
  resourceType?: string;
  dateRange?: AuditLogDateRange;
}

export interface AuditLogListFilters {
  search?: string;
  action?: string;
  resourceType?: string;
  dateRange?: AuditLogDateRange;
}

function applyAuditLogListFilters<
  T extends {
    eq: (column: string, value: string) => T;
    gte: (column: string, value: string) => T;
    or: (filters: string) => T;
  },
>(query: T, filters: AuditLogListFilters): T {
  let next = query;

  const action = normalizeAuditLogAction(filters.action);
  if (action) {
    next = next.eq("action", action);
  }

  const resourceType = normalizeAuditLogResourceType(filters.resourceType);
  if (resourceType) {
    next = next.eq("resource_type", resourceType);
  }

  const cutoff = auditLogDateRangeCutoff(
    normalizeAuditLogDateRange(filters.dateRange),
  );
  if (cutoff) {
    next = next.gte("created_at", cutoff);
  }

  const search = normalizeSearchTerm(filters.search);
  if (search) {
    next = next.or(
      `action.ilike.%${search}%,resource_type.ilike.%${search}%,resource_id.ilike.%${search}%,actor_id.ilike.%${search}%`,
    );
  }

  return next;
}

function resolveSortColumn(raw: string): AuditLogSortColumn {
  return AUDIT_LOG_SORT_COLUMNS.includes(raw as AuditLogSortColumn)
    ? (raw as AuditLogSortColumn)
    : "created_at";
}

export function normalizeAuditLogSortColumn(raw: string): AuditLogSortColumn {
  return resolveSortColumn(raw);
}

export function defaultSortDirectionForAuditLogColumn(
  column: AuditLogSortColumn,
): SortDirection {
  return column === "created_at" ? "desc" : "asc";
}

export async function countAuditLogsSince(
  client: SupabaseClient,
  sinceIso: string,
): Promise<number> {
  const { count, error } = await client
    .from("audit_logs")
    .select("id", { count: "exact", head: true })
    .gte("created_at", sinceIso);

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function countAuditLogs(client: SupabaseClient): Promise<number> {
  const { count, error } = await client
    .from("audit_logs")
    .select("id", { count: "exact", head: true });

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function listRecentAuditLogs(
  client: SupabaseClient,
  limit: number,
): Promise<AuditLogRow[]> {
  const { data, error } = await client
    .from("audit_logs")
    .select(AUDIT_LOG_COLUMNS)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []) as AuditLogRow[];
}

export async function listAuditLogsPaginated(
  client: SupabaseClient,
  query: AuditLogListQuery,
): Promise<{ rows: AuditLogRow[]; total: number }> {
  const sortColumn = resolveSortColumn(query.sortColumn);
  const ascending = query.sortDirection === "asc";
  const from = (query.page - 1) * query.pageSize;
  const to = from + query.pageSize - 1;

  let listQuery = client
    .from("audit_logs")
    .select(AUDIT_LOG_COLUMNS, { count: "exact" });

  listQuery = applyAuditLogListFilters(listQuery, query);

  const { data, error, count } = await listQuery
    .order(sortColumn, { ascending })
    .range(from, to);

  if (error) throw new Error(error.message);

  return {
    rows: (data ?? []) as AuditLogRow[],
    total: count ?? 0,
  };
}

export async function listAuditLogsForExport(
  client: SupabaseClient,
  query: Pick<AuditLogListQuery, "sortColumn" | "sortDirection"> &
    AuditLogListFilters,
): Promise<AuditLogRow[]> {
  const sortColumn = resolveSortColumn(query.sortColumn);
  const ascending = query.sortDirection === "asc";

  let listQuery = client.from("audit_logs").select(AUDIT_LOG_COLUMNS);
  listQuery = applyAuditLogListFilters(listQuery, query);

  const { data, error } = await listQuery.order(sortColumn, { ascending });

  if (error) throw new Error(error.message);
  return (data ?? []) as AuditLogRow[];
}
