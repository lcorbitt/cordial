import { events, inngest } from "@/lib/providers/jobs/publisher";
import type { CommunityMemberJoinedEventData } from "@/lib/jobs/catalog";
import { NOTIFICATION_TYPES } from "@shared/notification/types";
import { buildCommunityMemberJoinedNotification } from "@/lib/jobs/notifications/templates";

/**
 * Reacts to a user joining a community via invite acceptance.
 */
export const onCommunityMemberJoined = inngest.createFunction(
  {
    id: "on-community-member-joined",
    name: "On community member joined",
    triggers: [{ event: "community/member-joined" }],
  },
  async ({ event, step }) => {
    const data = event.data as CommunityMemberJoinedEventData;

    await step.run("audit", async () =>
      events.publish({
        name: "audit/log",
        data: {
          actorId: data.userId,
          action: "community.member_joined",
          resourceType: "community",
          resourceId: data.communityId,
          metadata: {
            slug: data.communitySlug,
            inviteId: data.inviteId ?? null,
          },
        },
      }),
    );

    const inviterId = data.invitedByUserId;
    if (
      inviterId &&
      inviterId !== data.userId &&
      data.communityName &&
      data.memberDisplayName
    ) {
      const copy = buildCommunityMemberJoinedNotification({
        memberName: data.memberDisplayName,
        communityName: data.communityName,
      });

      await step.run("notify-inviter", async () =>
        events.publish({
          name: "notification/create",
          data: {
            userId: inviterId,
            type: NOTIFICATION_TYPES.COMMUNITY_MEMBER_JOINED,
            title: copy.title,
            body: copy.body,
            actionUrl: `/communities/${data.communitySlug}`,
            metadata: {
              communityId: data.communityId,
              memberUserId: data.userId,
              inviteId: data.inviteId ?? null,
            },
          },
        }),
      );
    }

    return { handled: true };
  },
);
