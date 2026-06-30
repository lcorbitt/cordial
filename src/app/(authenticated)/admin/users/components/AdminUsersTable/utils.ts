export const ADMIN_USER_SORT_COLUMNS = [
  "display_name",
  "email",
  "updated_at",
] as const;

export type AdminUserSortColumn = (typeof ADMIN_USER_SORT_COLUMNS)[number];

export function normalizeAdminUserSortColumn(raw: string): AdminUserSortColumn {
  return ADMIN_USER_SORT_COLUMNS.includes(raw as AdminUserSortColumn)
    ? (raw as AdminUserSortColumn)
    : "updated_at";
}

export function defaultSortDirectionForAdminUserColumn(
  column: AdminUserSortColumn,
): "asc" | "desc" {
  return column === "updated_at" ? "desc" : "asc";
}

export function formatUserUpdatedAt(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

const ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  moderator: "Moderator",
};

export function formatPlatformRoleSlugs(slugs: string[]): string {
  if (slugs.length === 0) return "None";
  return slugs
    .map((slug) => ROLE_LABELS[slug] ?? formatRoleSlug(slug))
    .join(", ");
}

function formatRoleSlug(slug: string): string {
  return slug
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
