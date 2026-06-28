import { useQuery, type QueryClient } from "@tanstack/react-query";

import { getProfile } from "@/frontend/services/profile.service";
import type { ProfileResponse } from "@shared/dto/profile.dto";
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

export function invalidateProfileQueries(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: profileQueryKeyRoot });
}
