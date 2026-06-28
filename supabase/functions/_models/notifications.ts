import type { SupabaseClient } from "@supabase/supabase-js";

import { NOTIFICATION_TYPES } from "@shared/notification/types.ts";

/**
 * All `.from("notifications")` access lives here.
 */
export interface NotificationRow {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  action_url: string | null;
  metadata: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
}

const COLUMNS =
  "id, user_id, type, title, body, action_url, metadata, read_at, created_at";

export async function insertNotification(
  client: SupabaseClient,
  input: {
    userId: string;
    type: string;
    title: string;
    body: string;
    actionUrl?: string | null;
    metadata?: Record<string, unknown>;
  },
): Promise<NotificationRow> {
  const { data, error } = await client
    .from("notifications")
    .insert({
      user_id: input.userId,
      type: input.type,
      title: input.title,
      body: input.body,
      action_url: input.actionUrl ?? null,
      metadata: input.metadata ?? {},
    })
    .select(COLUMNS)
    .single();

  if (error) throw new Error(error.message);
  return data as NotificationRow;
}

export async function hasNotificationOfType(
  client: SupabaseClient,
  userId: string,
  type: string,
): Promise<boolean> {
  const { data, error } = await client
    .from("notifications")
    .select("id")
    .eq("user_id", userId)
    .eq("type", type)
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data !== null;
}

export async function listNotificationsForUser(
  client: SupabaseClient,
  userId: string,
  limit = 20,
): Promise<NotificationRow[]> {
  const { data, error } = await client
    .from("notifications")
    .select(COLUMNS)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []) as NotificationRow[];
}

export async function countUnreadNotifications(
  client: SupabaseClient,
  userId: string,
): Promise<number> {
  const { count, error } = await client
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) throw new Error(error.message);
  return count ?? 0;
}

export async function markNotificationReadById(
  client: SupabaseClient,
  userId: string,
  notificationId: string,
): Promise<void> {
  const { error } = await client
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) throw new Error(error.message);
}

export async function markAllNotificationsRead(
  client: SupabaseClient,
  userId: string,
): Promise<void> {
  const { error } = await client
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("read_at", null);

  if (error) throw new Error(error.message);
}

export { NOTIFICATION_TYPES };
