import type { SortDirection } from "@/components/DataTable";

export const COMMUNITY_SORT_COLUMNS = ["name", "slug"] as const;

export type CommunitySortColumn = (typeof COMMUNITY_SORT_COLUMNS)[number];

export function normalizeCommunitySortColumn(raw: string): CommunitySortColumn {
  return COMMUNITY_SORT_COLUMNS.includes(raw as CommunitySortColumn)
    ? (raw as CommunitySortColumn)
    : "name";
}

export function defaultSortDirectionForCommunityColumn(): SortDirection {
  return "asc";
}
