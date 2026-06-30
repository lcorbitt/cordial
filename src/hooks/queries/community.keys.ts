export const communityQueryKeyRoot = ["community"] as const;

export interface AdminCommunitiesQueryParams {
  page: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: "asc" | "desc";
  search: string;
}

export interface AdminCommunityMembersQueryParams {
  page: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: "asc" | "desc";
  search: string;
  communityId: string;
}

export const communityQueryKeys = {
  list: () => [...communityQueryKeyRoot, "list"] as const,
  detail: (slug: string) => [...communityQueryKeyRoot, "detail", slug] as const,
  adminList: (params: AdminCommunitiesQueryParams) =>
    [...communityQueryKeyRoot, "admin", "list", params] as const,
  adminMembersList: (params: AdminCommunityMembersQueryParams) =>
    [...communityQueryKeyRoot, "admin", "members", params] as const,
};
