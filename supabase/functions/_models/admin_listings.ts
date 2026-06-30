import type { SupabaseClient } from "@supabase/supabase-js";

import type { SortDirection } from "@shared/dto/pagination.dto.ts";

/**
 * RPC-backed admin listing reads. Complex joins live in SQL functions.
 */

export interface AdminCommunityMemberRpcRow {
  id: string;
  community_id: string;
  community_name: string;
  community_slug: string;
  user_id: string;
  member_display_name: string;
  member_email: string;
  role_name: string;
  role_slug: string;
  joined_at: string;
  total_count: number;
}

export const ADMIN_COMMUNITY_MEMBER_SORT_COLUMNS = [
  "joined_at",
  "community_name",
  "member_name",
  "member_email",
  "role_slug",
] as const;

export type AdminCommunityMemberSortColumn =
  (typeof ADMIN_COMMUNITY_MEMBER_SORT_COLUMNS)[number];

export interface AdminCommunityMemberListQuery {
  page: number;
  pageSize: number;
  sortColumn: AdminCommunityMemberSortColumn;
  sortDirection: SortDirection;
  search?: string;
  communityId?: string;
}

export function normalizeAdminCommunityMemberSortColumn(
  raw: string,
): AdminCommunityMemberSortColumn {
  return ADMIN_COMMUNITY_MEMBER_SORT_COLUMNS.includes(
    raw as AdminCommunityMemberSortColumn,
  )
    ? (raw as AdminCommunityMemberSortColumn)
    : "joined_at";
}

export function defaultSortDirectionForAdminCommunityMemberColumn(
  column: AdminCommunityMemberSortColumn,
): SortDirection {
  return column === "joined_at" ? "desc" : "asc";
}

export async function listAdminCommunityMembersPage(
  client: SupabaseClient,
  query: AdminCommunityMemberListQuery & { exportAll?: boolean },
): Promise<{ rows: AdminCommunityMemberRpcRow[]; total: number }> {
  const { data, error } = await client.rpc(
    "list_admin_community_members_page",
    {
      p_page: query.page,
      p_page_size: query.pageSize,
      p_sort_column: query.sortColumn,
      p_sort_direction: query.sortDirection,
      p_search: query.search ?? null,
      p_community_id: query.communityId ?? null,
      p_export_all: query.exportAll ?? false,
    },
  );

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as AdminCommunityMemberRpcRow[];
  const total = rows.length > 0 ? Number(rows[0].total_count) : 0;

  return { rows, total };
}

export interface AdminUserRpcRow {
  user_id: string;
  display_name: string;
  email: string;
  role_slugs: string[];
  updated_at: string;
  total_count: number;
}

export const ADMIN_USER_SORT_COLUMNS = [
  "display_name",
  "email",
  "updated_at",
] as const;

export type AdminUserSortColumn = (typeof ADMIN_USER_SORT_COLUMNS)[number];

export interface AdminUserRpcListQuery {
  page: number;
  pageSize: number;
  sortColumn: AdminUserSortColumn;
  sortDirection: SortDirection;
  search?: string;
}

export function normalizeAdminUserSortColumn(raw: string): AdminUserSortColumn {
  return ADMIN_USER_SORT_COLUMNS.includes(raw as AdminUserSortColumn)
    ? (raw as AdminUserSortColumn)
    : "updated_at";
}

export function defaultSortDirectionForAdminUserColumn(
  column: AdminUserSortColumn,
): SortDirection {
  return column === "updated_at" ? "desc" : "asc";
}

export async function listAdminUsersPage(
  client: SupabaseClient,
  query: AdminUserRpcListQuery & { exportAll?: boolean },
): Promise<{ rows: AdminUserRpcRow[]; total: number }> {
  const { data, error } = await client.rpc("list_admin_users_page", {
    p_page: query.page,
    p_page_size: query.pageSize,
    p_sort_column: query.sortColumn,
    p_sort_direction: query.sortDirection,
    p_search: query.search ?? null,
    p_export_all: query.exportAll ?? false,
  });

  if (error) throw new Error(error.message);

  const rows = (data ?? []) as AdminUserRpcRow[];
  const total = rows.length > 0 ? Number(rows[0].total_count) : 0;

  return { rows, total };
}
