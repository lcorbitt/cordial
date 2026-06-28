import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProfile } from "@/frontend/services/profile.service";
import {
  invalidateProfileQueries,
  setProfileQueryData,
} from "@/hooks/queries/useProfile";

/**
 * Profile writes. Thin TanStack layer: the mutation function calls the service
 * and invalidates the relevant queries on success. Toasts and navigation live
 * in the colocated UI hook, never here.
 */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (profile) => {
      setProfileQueryData(queryClient, profile);
      void invalidateProfileQueries(queryClient);
    },
  });
}
