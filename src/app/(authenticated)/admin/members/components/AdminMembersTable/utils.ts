export const ADMIN_COMMUNITY_MEMBER_SORT_COLUMNS = [
  "joined_at",
  "community_name",
  "member_name",
  "member_email",
  "role_slug",
] as const;

export type AdminCommunityMemberSortColumn =
  (typeof ADMIN_COMMUNITY_MEMBER_SORT_COLUMNS)[number];

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
): "asc" | "desc" {
  return column === "joined_at" ? "desc" : "asc";
}

export function formatMemberJoinedAt(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function formatCommunityRoleSlug(slug: string): string {
  return slug
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
