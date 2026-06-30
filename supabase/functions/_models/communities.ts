import type { SupabaseClient } from "@supabase/supabase-js";

import type { SortDirection } from "@shared/dto/pagination.dto.ts";

/**
 * All `.from("communities")` access lives here. No cross-table orchestration.
 */
export interface CommunityRow {
  id: string;
  name: string;
  slug: string;
  settings: Record<string, unknown>;
}

const SUMMARY_COLUMNS = "id, name, slug";
const DETAIL_COLUMNS = "id, name, slug, settings";

export const COMMUNITY_SORT_COLUMNS = ["name", "slug"] as const;

export type CommunitySortColumn = (typeof COMMUNITY_SORT_COLUMNS)[number];

export interface CommunityListQuery {
  page: number;
  pageSize: number;
  sortColumn: CommunitySortColumn;
  sortDirection: SortDirection;
}

function resolveSortColumn(raw: string): CommunitySortColumn {
  return COMMUNITY_SORT_COLUMNS.includes(raw as CommunitySortColumn)
    ? (raw as CommunitySortColumn)
    : "name";
}

export function normalizeCommunitySortColumn(raw: string): CommunitySortColumn {
  return resolveSortColumn(raw);
}

export function defaultSortDirectionForCommunityColumn(
  _column: CommunitySortColumn,
): SortDirection {
  return "asc";
}

export async function listCommunities(
  client: SupabaseClient,
): Promise<Pick<CommunityRow, "id" | "name" | "slug">[]> {
  const { data, error } = await client
    .from("communities")
    .select(SUMMARY_COLUMNS)
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Pick<CommunityRow, "id" | "name" | "slug">[];
}

export async function countAllCommunities(
  client: SupabaseClient,
): Promise<number> {
  const { count, error } = await client
    .from("communities")
    .select("id", { count: "exact", head: true })
    .is("deleted_at", null);

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function listCommunitiesPaginated(
  client: SupabaseClient,
  query: CommunityListQuery,
): Promise<{
  rows: Pick<CommunityRow, "id" | "name" | "slug">[];
  total: number;
}> {
  const sortColumn = resolveSortColumn(query.sortColumn);
  const ascending = query.sortDirection === "asc";
  const from = (query.page - 1) * query.pageSize;
  const to = from + query.pageSize - 1;

  const { data, error, count } = await client
    .from("communities")
    .select(SUMMARY_COLUMNS, { count: "exact" })
    .is("deleted_at", null)
    .order(sortColumn, { ascending })
    .range(from, to);

  if (error) throw new Error(error.message);

  return {
    rows: (data ?? []) as Pick<CommunityRow, "id" | "name" | "slug">[],
    total: count ?? 0,
  };
}

export async function listCommunitiesForExport(
  client: SupabaseClient,
  query: Pick<CommunityListQuery, "sortColumn" | "sortDirection">,
): Promise<Pick<CommunityRow, "id" | "name" | "slug">[]> {
  const sortColumn = resolveSortColumn(query.sortColumn);
  const ascending = query.sortDirection === "asc";

  const { data, error } = await client
    .from("communities")
    .select(SUMMARY_COLUMNS)
    .is("deleted_at", null)
    .order(sortColumn, { ascending });

  if (error) throw new Error(error.message);
  return (data ?? []) as Pick<CommunityRow, "id" | "name" | "slug">[];
}

export async function getCommunityBySlug(
  client: SupabaseClient,
  slug: string,
): Promise<CommunityRow | null> {
  const { data, error } = await client
    .from("communities")
    .select(DETAIL_COLUMNS)
    .eq("slug", slug)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as CommunityRow | null;
}

export async function getCommunityById(
  client: SupabaseClient,
  id: string,
): Promise<CommunityRow | null> {
  const { data, error } = await client
    .from("communities")
    .select(DETAIL_COLUMNS)
    .eq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as CommunityRow | null;
}

export async function slugExists(
  client: SupabaseClient,
  slug: string,
): Promise<boolean> {
  const { data, error } = await client
    .from("communities")
    .select("id")
    .eq("slug", slug)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data !== null;
}

export async function insertCommunity(
  client: SupabaseClient,
  input: { name: string; slug: string },
): Promise<CommunityRow> {
  const { data, error } = await client
    .from("communities")
    .insert({ name: input.name, slug: input.slug })
    .select(DETAIL_COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return data as CommunityRow;
}
