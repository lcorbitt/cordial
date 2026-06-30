import { useQuery, type QueryClient } from "@tanstack/react-query";

import {
  getCommunity,
  listAdminCommunities,
  listCommunities,
} from "@/frontend/services/community.service";
import {
  communityQueryKeyRoot,
  communityQueryKeys,
  type AdminCommunitiesQueryParams,
} from "@/hooks/queries/community.keys";

export { communityQueryKeyRoot, communityQueryKeys };

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
    queryFn: () => listAdminCommunities(params),
    enabled: options?.enabled ?? true,
  });
}

export function invalidateCommunityQueries(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: communityQueryKeyRoot });
}
