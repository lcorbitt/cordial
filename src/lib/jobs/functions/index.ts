import { sendEmail } from "./send-email";
import { onUserCreated } from "./on-user-created";
import { onProfileUpdated } from "./on-profile-updated";
import { onCommunityCreated } from "./on-community-created";
import { onCommunityMemberJoined } from "./on-community-member-joined";
import { onCommunityInviteSent } from "./on-community-invite-sent";
import { writeAuditLog } from "./write-audit-log";
import { createNotification } from "./create-notification";
import { indexSearchDocument } from "./index-search-document";
import { invalidateCache } from "./invalidate-cache";
import { trackAnalytics } from "./track-analytics";

/**
 * Every Inngest function registered with the serve handler. Add new functions
 * here so they are picked up by the `/api/inngest` route.
 */
export const functions = [
  sendEmail,
  onUserCreated,
  onProfileUpdated,
  onCommunityCreated,
  onCommunityMemberJoined,
  onCommunityInviteSent,
  createNotification,
  writeAuditLog,
  indexSearchDocument,
  invalidateCache,
  trackAnalytics,
];
