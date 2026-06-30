import { edgeFunctionFetch } from "@/lib/edge-function-fetch";
import { EDGE_FUNCTION_SLUGS } from "@/config/edge-function-slugs";
import type {
  AcceptInviteBody,
  AcceptInviteResponse,
  AdminCommunityListQuery,
  AdminCommunityMemberListQuery,
  CommunityDetail,
  CommunitySummary,
  CreateCommunityBody,
  ListAdminCommunitiesResponse,
  ListAdminCommunityMembersResponse,
  ListCommunitiesResponse,
  SendCommunityInviteBody,
  SendCommunityInviteResponse,
  UpdateCommunityBody,
} from "@shared/dto/community.dto";

function buildAdminCommunitiesQuery(
  query: AdminCommunityListQuery,
): Record<string, string> {
  const params: Record<string, string> = {
    page: String(query.page),
    pageSize: String(query.pageSize),
    sortColumn: query.sortColumn,
    sortDirection: query.sortDirection,
  };

  if (query.search) {
    params.search = query.search;
  }

  return params;
}

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
  query: AdminCommunityListQuery,
): Promise<ListAdminCommunitiesResponse> {
  return edgeFunctionFetch<ListAdminCommunitiesResponse>(
    EDGE_FUNCTION_SLUGS.listAdminCommunities,
    {
      query: buildAdminCommunitiesQuery(query),
    },
  );
}

export type AdminCommunityExportQuery = Pick<
  AdminCommunityListQuery,
  "sortColumn" | "sortDirection" | "search"
>;

export async function listAdminCommunitiesForExport(
  query: AdminCommunityExportQuery,
): Promise<CommunitySummary[]> {
  const result = await edgeFunctionFetch<ListAdminCommunitiesResponse>(
    EDGE_FUNCTION_SLUGS.listAdminCommunities,
    {
      query: {
        export: "true",
        ...buildAdminCommunitiesQuery({
          page: 1,
          pageSize: 1,
          sortColumn: query.sortColumn,
          sortDirection: query.sortDirection,
          search: query.search,
        }),
      },
    },
  );

  return result.items;
}

function buildAdminCommunityMembersQuery(
  query: AdminCommunityMemberListQuery,
): Record<string, string> {
  const params: Record<string, string> = {
    page: String(query.page),
    pageSize: String(query.pageSize),
    sortColumn: query.sortColumn,
    sortDirection: query.sortDirection,
  };

  if (query.search) {
    params.search = query.search;
  }
  if (query.communityId) {
    params.communityId = query.communityId;
  }

  return params;
}

export function listAdminCommunityMembers(
  query: AdminCommunityMemberListQuery,
): Promise<ListAdminCommunityMembersResponse> {
  return edgeFunctionFetch<ListAdminCommunityMembersResponse>(
    EDGE_FUNCTION_SLUGS.listAdminCommunityMembers,
    {
      query: buildAdminCommunityMembersQuery(query),
    },
  );
}

export type AdminCommunityMemberExportQuery = Pick<
  AdminCommunityMemberListQuery,
  "sortColumn" | "sortDirection" | "search" | "communityId"
>;

export async function listAdminCommunityMembersForExport(
  query: AdminCommunityMemberExportQuery,
): Promise<ListAdminCommunityMembersResponse["items"]> {
  const result = await edgeFunctionFetch<ListAdminCommunityMembersResponse>(
    EDGE_FUNCTION_SLUGS.listAdminCommunityMembers,
    {
      query: {
        export: "true",
        ...buildAdminCommunityMembersQuery({
          page: 1,
          pageSize: 1,
          sortColumn: query.sortColumn,
          sortDirection: query.sortDirection,
          search: query.search,
          communityId: query.communityId,
        }),
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

export function updateCommunity(
  body: UpdateCommunityBody,
): Promise<CommunityDetail> {
  return edgeFunctionFetch<CommunityDetail, UpdateCommunityBody>(
    EDGE_FUNCTION_SLUGS.updateCommunity,
    { method: "PATCH", body },
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
