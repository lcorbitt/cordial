/**
 * Server-generated notification copy for Inngest jobs. No React feature owns
 * these strings.
 */

export const WELCOME_NOTIFICATION = {
  title: "Welcome to Cordial",
  body: "Your account is ready. Explore communities and update your profile.",
  actionUrl: "/settings",
} as const;

export function buildCommunityMemberJoinedNotification(params: {
  memberName: string;
  communityName: string;
}): { title: string; body: string } {
  const memberName = params.memberName.trim() || "Someone";
  return {
    title: "New Community Member",
    body: `${memberName} joined ${params.communityName}.`,
  };
}
