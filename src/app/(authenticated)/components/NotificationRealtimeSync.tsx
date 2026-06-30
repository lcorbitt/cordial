"use client";

import { useQueryClient } from "@tanstack/react-query";

import { invalidateNotificationQueries } from "@/hooks/queries/useNotifications";
import { useRealtimeChannel } from "@/hooks/useRealtimeChannel";

interface NotificationRealtimeSyncProps {
  userId: string;
}

/**
 * Keeps notification queries fresh when rows change. Uses invalidate + refetch
 * (low volume). Upgrade to id-based patch when list churn grows.
 */
export function NotificationRealtimeSync({
  userId,
}: NotificationRealtimeSyncProps) {
  const queryClient = useQueryClient();

  useRealtimeChannel(
    `notifications:${userId}`,
    (channel) =>
      channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          void invalidateNotificationQueries(queryClient);
        },
      ),
    [queryClient, userId],
  );

  return null;
}
