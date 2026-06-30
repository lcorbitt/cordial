"use client";

import { useQueryClient } from "@tanstack/react-query";

import {
  invalidateProfileQueries,
  patchProfileQueryDataFromRealtimeRow,
  type ProfileRealtimeRow,
} from "@/hooks/queries/useProfile";
import { useRealtimeChannel } from "@/hooks/useRealtimeChannel";

interface ProfileRealtimeSyncProps {
  userId: string;
}

/**
 * Keeps the shared profile query in sync across the authenticated shell. Any
 * profile row update (avatar, display name, bio) patches the cache so every
 * `useProfileQuery` subscriber updates together.
 */
export function ProfileRealtimeSync({ userId }: ProfileRealtimeSyncProps) {
  const queryClient = useQueryClient();

  useRealtimeChannel(
    `profile:${userId}`,
    (channel) =>
      channel.on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `owner_id=eq.${userId}`,
        },
        (payload) => {
          const patched = patchProfileQueryDataFromRealtimeRow(
            queryClient,
            payload.new as ProfileRealtimeRow,
          );
          if (!patched) {
            void invalidateProfileQueries(queryClient);
          }
        },
      ),
    [queryClient, userId],
  );

  return null;
}
