import type { SupabaseClient } from "@supabase/supabase-js";

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

  const { data, error, count } = await client
    .from("audit_logs")
    .select(AUDIT_LOG_COLUMNS, { count: "exact" })
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
  query: Pick<AuditLogListQuery, "sortColumn" | "sortDirection">,
): Promise<AuditLogRow[]> {
  const sortColumn = resolveSortColumn(query.sortColumn);
  const ascending = query.sortDirection === "asc";

  const { data, error } = await client
    .from("audit_logs")
    .select(AUDIT_LOG_COLUMNS)
    .order(sortColumn, { ascending });

  if (error) throw new Error(error.message);
  return (data ?? []) as AuditLogRow[];
}
