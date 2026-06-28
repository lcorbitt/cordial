import type { SupabaseClient } from "@supabase/supabase-js";

import {
  countUnreadNotifications,
  hasNotificationOfType,
  insertNotification,
  listNotificationsForUser,
  markAllNotificationsRead,
  markNotificationReadById,
  type NotificationRow,
} from "@models/notifications.ts";
import { NOTIFICATION_TYPES } from "@shared/notification/types.ts";
import type {
  ListNotificationsResponse,
  MarkNotificationReadResponse,
  NotificationItem,
} from "@shared/dto/notification.dto.ts";

export class NotificationValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotificationValidationError";
  }
}

export class NotificationNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotificationNotFoundError";
  }
}

function toItem(row: NotificationRow): NotificationItem {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    actionUrl: row.action_url,
    readAt: row.read_at,
    createdAt: row.created_at,
  };
}

export interface CreateNotificationInput {
  userId: string;
  type: string;
  title: string;
  body: string;
  actionUrl?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Notification use cases. Inserts use the service client; reads and mark-read
 * use the caller's RLS-bound client.
 */
export async function createNotification(
  serviceClient: SupabaseClient,
  input: CreateNotificationInput,
): Promise<NotificationRow | null> {
  if (input.type === NOTIFICATION_TYPES.SYSTEM_WELCOME) {
    const exists = await hasNotificationOfType(
      serviceClient,
      input.userId,
      input.type,
    );
    if (exists) return null;
  }

  return insertNotification(serviceClient, input);
}

export async function listNotifications(
  client: SupabaseClient,
  userId: string,
  limit?: number,
): Promise<ListNotificationsResponse> {
  const [items, unreadCount] = await Promise.all([
    listNotificationsForUser(client, userId, limit),
    countUnreadNotifications(client, userId),
  ]);

  return {
    items: items.map(toItem),
    unreadCount,
  };
}

export async function markNotificationRead(
  client: SupabaseClient,
  userId: string,
  input: { notificationId?: string; all?: boolean },
): Promise<MarkNotificationReadResponse> {
  if (input.all) {
    await markAllNotificationsRead(client, userId);
    return { unreadCount: 0 };
  }

  if (!input.notificationId) {
    throw new NotificationValidationError(
      "Please choose a notification to mark as read.",
    );
  }

  await markNotificationReadById(client, userId, input.notificationId);
  const unreadCount = await countUnreadNotifications(client, userId);
  return { unreadCount };
}
