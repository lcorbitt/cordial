import { edgeFunctionFetch } from "@/lib/edge-function-fetch";
import { EDGE_FUNCTION_SLUGS } from "@/config/edge-function-slugs";
import type {
  AcceptInviteBody,
  AcceptInviteResponse,
  CommunityDetail,
  CommunitySummary,
  CreateCommunityBody,
  ListAdminCommunitiesResponse,
  ListCommunitiesResponse,
  SendCommunityInviteBody,
  SendCommunityInviteResponse,
} from "@shared/dto/community.dto";
import type { PaginatedListQuery } from "@shared/dto/pagination.dto";

/**
 * Browser-side HTTP adapters for the community domain. No React here — these are
 * called only by TanStack Query hooks.
 */
export function listCommunities(): Promise<ListCommunitiesResponse> {
  return edgeFunctionFetch<ListCommunitiesResponse>(
    EDGE_FUNCTION_SLUGS.listCommunities,
  );
}

export function getCommunity(slug: string): Promise<CommunityDetail> {
  return edgeFunctionFetch<CommunityDetail>(EDGE_FUNCTION_SLUGS.getCommunity, {
    query: { slug },
  });
}

export function listAdminCommunities(
  query: PaginatedListQuery,
): Promise<ListAdminCommunitiesResponse> {
  return edgeFunctionFetch<ListAdminCommunitiesResponse>(
    EDGE_FUNCTION_SLUGS.listAdminCommunities,
    {
      query: {
        page: String(query.page),
        pageSize: String(query.pageSize),
        sortColumn: query.sortColumn,
        sortDirection: query.sortDirection,
      },
    },
  );
}

export async function listAdminCommunitiesForExport(
  query: Pick<PaginatedListQuery, "sortColumn" | "sortDirection">,
): Promise<CommunitySummary[]> {
  const result = await edgeFunctionFetch<ListAdminCommunitiesResponse>(
    EDGE_FUNCTION_SLUGS.listAdminCommunities,
    {
      query: {
        export: "true",
        sortColumn: query.sortColumn,
        sortDirection: query.sortDirection,
      },
    },
  );

  return result.items;
}

export function createCommunity(
  body: CreateCommunityBody,
): Promise<CommunityDetail> {
  return edgeFunctionFetch<CommunityDetail, CreateCommunityBody>(
    EDGE_FUNCTION_SLUGS.createCommunity,
    { method: "POST", body },
  );
}

export function sendCommunityInvite(
  body: SendCommunityInviteBody,
): Promise<SendCommunityInviteResponse> {
  return edgeFunctionFetch<
    SendCommunityInviteResponse,
    SendCommunityInviteBody
  >(EDGE_FUNCTION_SLUGS.sendCommunityInvite, { method: "POST", body });
}

export function acceptInvite(
  body: AcceptInviteBody,
): Promise<AcceptInviteResponse> {
  return edgeFunctionFetch<AcceptInviteResponse, AcceptInviteBody>(
    EDGE_FUNCTION_SLUGS.acceptInvite,
    { method: "POST", body },
  );
}
