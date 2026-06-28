import type { ProfileUpdatedEventData } from "@shared/dto/events.dto";
import type {
  CommunityCreatedEventData,
  CommunityInviteSentEventData,
  CommunityMemberJoinedEventData,
} from "@shared/dto/events.dto";

/**
 * Unified typed event catalog.
 *
 * Domain events — emitted after a successful write; consumed by orchestrators.
 * Integration commands — emitted by orchestrators or providers; consumed by
 * single-purpose workers.
 */
export type DomainEvent =
  | { name: "profile/updated"; data: ProfileUpdatedEventData }
  | { name: "community/created"; data: CommunityCreatedEventData }
  | { name: "community/member-joined"; data: CommunityMemberJoinedEventData }
  | { name: "community/invite-sent"; data: CommunityInviteSentEventData };

export type IntegrationEvent =
  | { name: "email/send"; data: EmailSendData }
  | { name: "user/created"; data: UserCreatedData }
  | { name: "audit/log"; data: AuditLogData }
  | { name: "search/index"; data: SearchIndexData }
  | { name: "cache/invalidate"; data: CacheInvalidateData }
  | { name: "analytics/track"; data: AnalyticsTrackData }
  | { name: "notification/create"; data: NotificationCreateData };

/** Every event the platform can publish or consume. */
export type AppEvent = DomainEvent | IntegrationEvent;

export interface EmailSendData {
  template: "verify-email" | "reset-password" | "invite" | "notification";
  to: string;
  payload: Record<string, unknown>;
}

export interface UserCreatedData {
  userId: string;
  email: string;
}

export interface AuditLogData {
  actorId: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  metadata?: Record<string, unknown>;
  ip?: string | null;
  userAgent?: string | null;
}

export interface SearchIndexData {
  entityType: string;
  entityId: string;
  title: string;
  body?: string;
  metadata?: Record<string, unknown>;
}

export interface CacheInvalidateData {
  namespace: string;
  id: string;
}

export interface AnalyticsTrackData {
  eventName: string;
  userId?: string | null;
  sessionId?: string | null;
  properties?: Record<string, unknown>;
}

export interface NotificationCreateData {
  userId: string;
  type: string;
  title: string;
  body: string;
  actionUrl?: string | null;
  metadata?: Record<string, unknown>;
}

export type { ProfileUpdatedEventData };
export type {
  CommunityCreatedEventData,
  CommunityInviteSentEventData,
  CommunityMemberJoinedEventData,
} from "@shared/dto/events.dto";
