import { useQuery, type QueryClient } from "@tanstack/react-query";

import {
  getCommunity,
  listAdminCommunities,
  listAdminCommunityMembers,
  listCommunities,
} from "@/frontend/services/community.service";
import {
  communityQueryKeyRoot,
  communityQueryKeys,
  type AdminCommunitiesQueryParams,
  type AdminCommunityMembersQueryParams,
} from "@/hooks/queries/community.keys";
import type {
  AdminCommunityListQuery,
  AdminCommunityMemberListQuery,
} from "@shared/dto/community.dto";

export { communityQueryKeyRoot, communityQueryKeys };

function toAdminCommunityListQuery(
  params: AdminCommunitiesQueryParams,
): AdminCommunityListQuery {
  return {
    page: params.page,
    pageSize: params.pageSize,
    sortColumn: params.sortColumn,
    sortDirection: params.sortDirection,
    search: params.search || undefined,
  };
}

function toAdminCommunityMemberListQuery(
  params: AdminCommunityMembersQueryParams,
): AdminCommunityMemberListQuery {
  return {
    page: params.page,
    pageSize: params.pageSize,
    sortColumn: params.sortColumn,
    sortDirection: params.sortDirection,
    search: params.search || undefined,
    communityId: params.communityId || undefined,
  };
}

/**
 * Community reads, query keys, and invalidation helpers.
 */
export function useCommunitiesQuery(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: communityQueryKeys.list(),
    queryFn: listCommunities,
    enabled: options?.enabled ?? true,
  });
}

export function useCommunityQuery(slug: string) {
  return useQuery({
    queryKey: communityQueryKeys.detail(slug),
    queryFn: () => getCommunity(slug),
    enabled: slug.length > 0,
  });
}

export function useAdminCommunitiesQuery(
  params: AdminCommunitiesQueryParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: communityQueryKeys.adminList(params),
    queryFn: () => listAdminCommunities(toAdminCommunityListQuery(params)),
    enabled: options?.enabled ?? true,
  });
}

export function useAdminCommunityMembersQuery(
  params: AdminCommunityMembersQueryParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: communityQueryKeys.adminMembersList(params),
    queryFn: () =>
      listAdminCommunityMembers(toAdminCommunityMemberListQuery(params)),
    enabled: options?.enabled ?? true,
  });
}

export function invalidateCommunityQueries(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: communityQueryKeyRoot });
}
