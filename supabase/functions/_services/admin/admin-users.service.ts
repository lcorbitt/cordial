import {
  defaultSortDirectionForAdminUserColumn,
  listAdminUsersPage,
  normalizeAdminUserSortColumn,
  type AdminUserRpcRow,
} from "@models/admin_listings.ts";
import { createServiceClient } from "@services/db.ts";
import type {
  AdminUserListItem,
  AdminUserListQuery,
  ListAdminUsersResponse,
} from "@shared/dto/admin.dto.ts";
import { normalizeSearchTerm } from "@shared/db/ilike.ts";

function mapAdminUserRow(row: AdminUserRpcRow): AdminUserListItem {
  return {
    userId: row.user_id,
    displayName: row.display_name,
    email: row.email,
    roleSlugs: row.role_slugs ?? [],
    updatedAt: row.updated_at,
  };
}

function normalizeAdminUserListQuery(
  query: AdminUserListQuery,
): AdminUserListQuery {
  const sortColumn = normalizeAdminUserSortColumn(query.sortColumn);
  const search = normalizeSearchTerm(query.search);

  return {
    page: Math.max(1, query.page),
    pageSize: Math.min(100, Math.max(1, query.pageSize)),
    sortColumn,
    sortDirection:
      query.sortDirection === "asc" || query.sortDirection === "desc"
        ? query.sortDirection
        : defaultSortDirectionForAdminUserColumn(sortColumn),
    search: search || undefined,
  };
}

/**
 * Paginated platform user listing for super-admin screens.
 */
export async function listAdminUsers(
  query: AdminUserListQuery,
): Promise<ListAdminUsersResponse> {
  const client = createServiceClient();
  const normalized = normalizeAdminUserListQuery(query);
  const { rows, total } = await listAdminUsersPage(client, normalized);

  return {
    items: rows.map(mapAdminUserRow),
    total,
    page: normalized.page,
    pageSize: normalized.pageSize,
  };
}

export type AdminUserExportQuery = Pick<
  AdminUserListQuery,
  "sortColumn" | "sortDirection" | "search"
>;

/**
 * Full platform user export matching current sort and filters.
 */
export async function listAdminUsersForExport(
  query: AdminUserExportQuery,
): Promise<AdminUserListItem[]> {
  const client = createServiceClient();
  const normalized = normalizeAdminUserListQuery({
    page: 1,
    pageSize: 1,
    ...query,
  });
  const { rows } = await listAdminUsersPage(client, {
    ...normalized,
    exportAll: true,
  });

  return rows.map(mapAdminUserRow);
}
