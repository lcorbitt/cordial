import "server-only";

import type { QueryClient } from "@tanstack/react-query";

import { EDGE_FUNCTION_SLUGS } from "@/config/edge-function-slugs";
import {
  communityQueryKeys,
  type AdminCommunitiesQueryParams,
} from "@/hooks/queries/community.keys";
import { edgeFunctionFetchServer } from "@/lib/edge-function/fetch.server";
import type {
  CommunityDetail,
  ListAdminCommunitiesResponse,
  ListCommunitiesResponse,
} from "@shared/dto/community.dto";

export const DEFAULT_ADMIN_COMMUNITIES_QUERY: AdminCommunitiesQueryParams = {
  page: 1,
  pageSize: 20,
  sortColumn: "name",
  sortDirection: "asc",
};

export async function prefetchCommunitiesQuery(
  queryClient: QueryClient,
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: communityQueryKeys.list(),
    queryFn: () =>
      edgeFunctionFetchServer<ListCommunitiesResponse>(
        EDGE_FUNCTION_SLUGS.listCommunities,
      ),
  });
}

export async function prefetchAdminCommunitiesQuery(
  queryClient: QueryClient,
  params: AdminCommunitiesQueryParams = DEFAULT_ADMIN_COMMUNITIES_QUERY,
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: communityQueryKeys.adminList(params),
    queryFn: () =>
      edgeFunctionFetchServer<ListAdminCommunitiesResponse>(
        EDGE_FUNCTION_SLUGS.listAdminCommunities,
        {
          query: {
            page: String(params.page),
            pageSize: String(params.pageSize),
            sortColumn: params.sortColumn,
            sortDirection: params.sortDirection,
          },
        },
      ),
  });
}

export async function prefetchCommunityQuery(
  queryClient: QueryClient,
  slug: string,
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: communityQueryKeys.detail(slug),
    queryFn: () =>
      edgeFunctionFetchServer<CommunityDetail>(
        EDGE_FUNCTION_SLUGS.getCommunity,
        { query: { slug } },
      ),
  });
}
