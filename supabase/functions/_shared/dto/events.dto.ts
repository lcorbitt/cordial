/**
 * Shared event payload contracts. Imported by Edge publishers and Inngest
 * consumers via @shared/dto/events.dto.ts — never duplicate in frontend-only
 * files.
 */

/** Emitted after a profile row is successfully updated. */
export interface ProfileUpdatedEventData {
  profileId: string;
  ownerId: string;
  displayName: string | null;
  /** camelCase field names that changed, e.g. ["displayName", "bio"] */
  changedFields: string[];
}

/** Emitted after a community is created. */
export interface CommunityCreatedEventData {
  communityId: string;
  name: string;
  slug: string;
  createdBy: string;
}

/** Emitted after a user joins a community. */
export interface CommunityMemberJoinedEventData {
  communityId: string;
  communitySlug: string;
  userId: string;
  inviteId?: string;
  invitedByUserId?: string;
  memberDisplayName?: string;
  communityName?: string;
}

/** Emitted after a community invite is created and should be emailed. */
export interface CommunityInviteSentEventData {
  inviteId: string;
  email: string;
  inviterName: string;
  communityName: string;
  acceptUrl: string;
}
