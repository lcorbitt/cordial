import type { SortDirection } from "@/components/DataTable";
import type { CommunitySummary } from "@shared/dto/community.dto";

export const COMMUNITY_SORT_COLUMNS = ["name", "slug"] as const;

export type CommunitySortColumn = (typeof COMMUNITY_SORT_COLUMNS)[number];

export function normalizeCommunitySortColumn(raw: string): CommunitySortColumn {
  return COMMUNITY_SORT_COLUMNS.includes(raw as CommunitySortColumn)
    ? (raw as CommunitySortColumn)
    : "name";
}

export function defaultSortDirectionForCommunityColumn(
  column: CommunitySortColumn,
): SortDirection {
  return column === "name" ? "asc" : "asc";
}

export function sortCommunities(
  rows: CommunitySummary[],
  sortColumn: CommunitySortColumn,
  sortDirection: SortDirection,
): CommunitySummary[] {
  const sorted = [...rows].sort((left, right) => {
    const leftValue = left[sortColumn].toLowerCase();
    const rightValue = right[sortColumn].toLowerCase();
    return leftValue.localeCompare(rightValue);
  });

  return sortDirection === "desc" ? sorted.reverse() : sorted;
}
