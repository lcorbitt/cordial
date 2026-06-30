import { useQuery, type QueryClient } from "@tanstack/react-query";

import { getProfile } from "@/frontend/services/profile.service";
import type { ProfileResponse } from "@shared/dto/profile.dto";
import { patchSingleton } from "@/lib/query/realtime-merge";
import {
  profileQueryKeyRoot,
  profileQueryKeys,
} from "@/hooks/queries/profile.keys";

export { profileQueryKeyRoot, profileQueryKeys };

/**
 * Profile reads, query keys, and cache helpers. Mutation files import the keys
 * from here; they are never defined inside mutation files.
 */
export function useProfileQuery() {
  return useQuery({
    queryKey: profileQueryKeys.me(),
    queryFn: getProfile,
  });
}

export function setProfileQueryData(
  queryClient: QueryClient,
  profile: ProfileResponse,
): void {
  queryClient.setQueryData(profileQueryKeys.me(), profile);
}

/** Realtime payload row shape (snake_case from Postgres). */
export interface ProfileRealtimeRow {
  avatar_url?: string | null;
  display_name?: string | null;
  bio?: string | null;
  updated_at?: string;
}

/**
 * Merges a Realtime `profiles` UPDATE into the warm profile cache so avatars
 * and display names refresh without waiting on a refetch.
 */
export function patchProfileQueryDataFromRealtimeRow(
  queryClient: QueryClient,
  row: ProfileRealtimeRow,
): boolean {
  const previous = queryClient.getQueryData<ProfileResponse>(
    profileQueryKeys.me(),
  );
  const patched = patchSingleton(previous, {
    ...(row.display_name !== undefined && { displayName: row.display_name }),
    ...(row.avatar_url !== undefined && { avatarUrl: row.avatar_url }),
    ...(row.bio !== undefined && { bio: row.bio }),
    ...(row.updated_at !== undefined && { updatedAt: row.updated_at }),
  });
  if (!patched) return false;

  setProfileQueryData(queryClient, patched);
  return true;
}

export function invalidateProfileQueries(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: profileQueryKeyRoot });
}
