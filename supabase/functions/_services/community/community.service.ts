import type { SupabaseClient } from "@supabase/supabase-js";

import {
  getCommunityById,
  getCommunityBySlug,
  insertCommunity,
  listAllCommunities,
  listCommunities,
  slugExists,
  type CommunityRow,
} from "@models/communities.ts";
import {
  findPendingByCommunityAndEmail,
  findPendingByTokenHash,
  getAuthUserIdByEmail,
  insertInvite,
  markAccepted,
} from "@models/community_invites.ts";
import {
  hasCommunityMembership,
  insertCommunityMember,
} from "@models/community_members.ts";
import { getProfileByOwnerId } from "@models/profiles.ts";
import { getRoleIdBySlug } from "@models/roles.ts";
import { publishEvent } from "@services/events/publisher.ts";
import type {
  AcceptInviteResponse,
  AdminCommunitiesResponse,
  CommunityDetail,
  CreateCommunityBody,
  ListCommunitiesResponse,
  SendCommunityInviteBody,
  SendCommunityInviteResponse,
} from "@shared/dto/community.dto.ts";

import {
  CommunityConflictError,
  CommunityNotFoundError,
  CommunityValidationError,
  InviteEmailMismatchError,
  InviteExpiredError,
} from "./errors.ts";
import { toDetail, toSummary } from "./mappers.ts";
import {
  generateInviteToken,
  hashInviteToken,
  inviteExpiresAt,
} from "./tokens.ts";
import { isValidCommunitySlug, normalizeCommunityEmail } from "./validators.ts";

/**
 * Community use cases. Reads use the caller's RLS-bound client; writes use the
 * service client after authorization checks in handlers.
 */
export async function listCommunitiesForUser(
  client: SupabaseClient,
): Promise<ListCommunitiesResponse> {
  const rows = await listCommunities(client);
  return {
    communities: rows.map(toSummary),
  };
}

export async function getCommunityBySlugForUser(
  client: SupabaseClient,
  userId: string,
  slug: string,
): Promise<CommunityDetail | null> {
  const row = await getCommunityBySlug(client, slug);
  if (!row) return null;

  const isMember = await hasCommunityMembership(client, userId, row.id);
  if (!isMember) return null;

  return toDetail(row);
}

export async function listAllCommunitiesAdmin(
  serviceClient: SupabaseClient,
): Promise<AdminCommunitiesResponse> {
  const rows = await listAllCommunities(serviceClient);
  return {
    communities: rows.map(toSummary),
  };
}

export async function createCommunity(
  serviceClient: SupabaseClient,
  creatorId: string,
  body: CreateCommunityBody,
): Promise<CommunityDetail> {
  const name = body.name.trim();
  const slug = body.slug.trim().toLowerCase();

  if (name.length < 2 || name.length > 80) {
    throw new CommunityValidationError(
      "Please enter a community name between 2 and 80 characters.",
    );
  }

  if (!isValidCommunitySlug(slug)) {
    throw new CommunityValidationError(
      "Please use a slug with 3–50 lowercase letters, numbers, and hyphens only.",
    );
  }

  if (await slugExists(serviceClient, slug)) {
    throw new CommunityConflictError(
      "That slug is already in use. Please choose another.",
    );
  }

  const memberRoleId = await getRoleIdBySlug(serviceClient, "member");
  if (!memberRoleId) {
    throw new Error("Member role is not configured.");
  }

  const row = await insertCommunity(serviceClient, { name, slug });

  await insertCommunityMember(serviceClient, {
    communityId: row.id,
    userId: creatorId,
    roleId: memberRoleId,
  });

  await publishEvent({
    name: "community/created",
    data: {
      communityId: row.id,
      name: row.name,
      slug: row.slug,
      createdBy: creatorId,
    },
  });

  return toDetail(row);
}

export async function sendCommunityInvite(
  serviceClient: SupabaseClient,
  inviterId: string,
  inviterEmail: string | null,
  body: SendCommunityInviteBody,
  siteUrl: string,
): Promise<SendCommunityInviteResponse> {
  const email = normalizeCommunityEmail(body.email);
  if (!email || !email.includes("@")) {
    throw new CommunityValidationError("Please enter a valid email address.");
  }

  const community = await getCommunityById(serviceClient, body.communityId);
  if (!community) {
    throw new CommunityNotFoundError("That community was not found.");
  }

  const existingUserId = await getAuthUserIdByEmail(serviceClient, email);
  if (
    existingUserId &&
    (await hasCommunityMembership(serviceClient, existingUserId, community.id))
  ) {
    throw new CommunityConflictError(
      "That person is already a member of this community.",
    );
  }

  const pendingInvite = await findPendingByCommunityAndEmail(
    serviceClient,
    community.id,
    email,
  );
  if (pendingInvite) {
    throw new CommunityConflictError(
      "An invitation is already pending for that email address.",
    );
  }

  const { token, tokenHash } = await generateInviteToken();
  const invite = await insertInvite(serviceClient, {
    communityId: community.id,
    email,
    invitedBy: inviterId,
    tokenHash,
    expiresAt: inviteExpiresAt(),
  });

  const profile = await getProfileByOwnerId(serviceClient, inviterId);
  const inviterName =
    profile?.display_name ?? inviterEmail ?? "A GoverNerds admin";
  const acceptUrl = `${siteUrl.replace(/\/$/, "")}/invite/accept?token=${encodeURIComponent(token)}`;

  await publishEvent({
    name: "community/invite-sent",
    data: {
      inviteId: invite.id,
      email,
      inviterName,
      communityName: community.name,
      acceptUrl,
    },
  });

  return {
    message: `An invitation has been sent to ${email}.`,
  };
}

export async function acceptCommunityInvite(
  serviceClient: SupabaseClient,
  userId: string,
  userEmail: string | null,
  token: string,
): Promise<AcceptInviteResponse> {
  if (!token.trim()) {
    throw new CommunityValidationError("This invitation link is not valid.");
  }

  if (!userEmail) {
    throw new InviteEmailMismatchError(
      "Your account does not have an email address on file.",
    );
  }

  const tokenHash = await hashInviteToken(token);
  const invite = await findPendingByTokenHash(serviceClient, tokenHash);
  if (!invite) {
    throw new CommunityNotFoundError(
      "This invitation is not valid or has already been used.",
    );
  }

  if (new Date(invite.expires_at).getTime() < Date.now()) {
    throw new InviteExpiredError(
      "This invitation has expired. Please ask for a new one.",
    );
  }

  if (
    normalizeCommunityEmail(userEmail) !== normalizeCommunityEmail(invite.email)
  ) {
    throw new InviteEmailMismatchError(
      "This invitation was sent to a different email address. Please sign in with the invited email.",
    );
  }

  const community = await getCommunityById(serviceClient, invite.community_id);
  if (!community) {
    throw new CommunityNotFoundError("That community was not found.");
  }

  if (await hasCommunityMembership(serviceClient, userId, community.id)) {
    await markAccepted(serviceClient, invite.id, userId);
    return { communitySlug: community.slug };
  }

  const memberRoleId = await getRoleIdBySlug(serviceClient, "member");
  if (!memberRoleId) {
    throw new Error("Member role is not configured.");
  }

  await insertCommunityMember(serviceClient, {
    communityId: community.id,
    userId,
    roleId: memberRoleId,
  });

  await markAccepted(serviceClient, invite.id, userId);

  const memberProfile = await getProfileByOwnerId(serviceClient, userId);
  const memberDisplayName =
    memberProfile?.display_name?.trim() ||
    userEmail?.split("@")[0] ||
    "Someone";

  await publishEvent({
    name: "community/member-joined",
    data: {
      communityId: community.id,
      communitySlug: community.slug,
      communityName: community.name,
      userId,
      inviteId: invite.id,
      invitedByUserId: invite.invited_by,
      memberDisplayName,
    },
  });

  return { communitySlug: community.slug };
}

export { toDetail, toSummary };
export type { CommunityRow };
