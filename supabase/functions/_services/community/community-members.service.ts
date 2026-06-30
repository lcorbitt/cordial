import {
  defaultSortDirectionForAdminCommunityMemberColumn,
  listAdminCommunityMembersPage,
  normalizeAdminCommunityMemberSortColumn,
  type AdminCommunityMemberRpcRow,
} from "@models/admin_listings.ts";
import { createServiceClient } from "@services/db.ts";
import type {
  AdminCommunityMemberListItem,
  AdminCommunityMemberListQuery,
  ListAdminCommunityMembersResponse,
} from "@shared/dto/community.dto.ts";
import { normalizeSearchTerm } from "@shared/db/ilike.ts";

function mapCommunityMemberRow(
  row: AdminCommunityMemberRpcRow,
): AdminCommunityMemberListItem {
  return {
    id: row.id,
    communityId: row.community_id,
    communityName: row.community_name,
    communitySlug: row.community_slug,
    userId: row.user_id,
    memberDisplayName: row.member_display_name,
    memberEmail: row.member_email,
    roleName: row.role_name,
    roleSlug: row.role_slug,
    joinedAt: row.joined_at,
  };
}

function normalizeCommunityMemberListQuery(
  query: AdminCommunityMemberListQuery,
): AdminCommunityMemberListQuery {
  const sortColumn = normalizeAdminCommunityMemberSortColumn(query.sortColumn);
  const search = normalizeSearchTerm(query.search);

  return {
    page: Math.max(1, query.page),
    pageSize: Math.min(100, Math.max(1, query.pageSize)),
    sortColumn,
    sortDirection:
      query.sortDirection === "asc" || query.sortDirection === "desc"
        ? query.sortDirection
        : defaultSortDirectionForAdminCommunityMemberColumn(sortColumn),
    search: search || undefined,
    communityId: query.communityId || undefined,
  };
}

/**
 * Paginated community membership listing for admin screens.
 */
export async function listAdminCommunityMembers(
  query: AdminCommunityMemberListQuery,
): Promise<ListAdminCommunityMembersResponse> {
  const client = createServiceClient();
  const normalized = normalizeCommunityMemberListQuery(query);
  const { rows, total } = await listAdminCommunityMembersPage(
    client,
    normalized,
  );

  return {
    items: rows.map(mapCommunityMemberRow),
    total,
    page: normalized.page,
    pageSize: normalized.pageSize,
  };
}

export type AdminCommunityMemberExportQuery = Pick<
  AdminCommunityMemberListQuery,
  "sortColumn" | "sortDirection" | "search" | "communityId"
>;

/**
 * Full community member export matching current sort and filters.
 */
export async function listAdminCommunityMembersForExport(
  query: AdminCommunityMemberExportQuery,
): Promise<AdminCommunityMemberListItem[]> {
  const client = createServiceClient();
  const normalized = normalizeCommunityMemberListQuery({
    page: 1,
    pageSize: 1,
    ...query,
  });
  const { rows } = await listAdminCommunityMembersPage(client, {
    ...normalized,
    exportAll: true,
  });

  return rows.map(mapCommunityMemberRow);
}
