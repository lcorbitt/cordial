/**
 * Wire contracts for community endpoints. Pure types, shared across runtimes.
 */
import type { PaginatedListResponse } from "./pagination.dto.ts";

export interface CommunitySummary {
  id: string;
  name: string;
  slug: string;
}

export interface CommunityDetail extends CommunitySummary {
  settings: Record<string, unknown>;
}

export interface ListCommunitiesResponse {
  communities: CommunitySummary[];
}

export type ListAdminCommunitiesResponse =
  PaginatedListResponse<CommunitySummary>;

export interface CreateCommunityBody {
  name: string;
  slug: string;
}

export interface SendCommunityInviteBody {
  communityId: string;
  email: string;
}

export interface AcceptInviteBody {
  token: string;
}

export interface AcceptInviteResponse {
  communitySlug: string;
}

export interface SendCommunityInviteResponse {
  message: string;
}
