/**
 * Stable notification type identifiers shared across Edge, Next.js, and jobs.
 */

export const NOTIFICATION_TYPES = {
  SYSTEM_WELCOME: "system.welcome",
  COMMUNITY_MEMBER_JOINED: "community.member_joined",
} as const;

export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];
