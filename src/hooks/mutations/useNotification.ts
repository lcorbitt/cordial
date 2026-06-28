import { useMutation, useQueryClient } from "@tanstack/react-query";

import { markNotificationRead } from "@/frontend/services/notification.service";
import { invalidateNotificationQueries } from "@/hooks/queries/useNotifications";
import type { MarkNotificationReadBody } from "@shared/dto/notification.dto";

/**
 * Notification writes. Cache invalidation only; toasts live in UI hooks.
 */
export function useMarkNotificationReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: MarkNotificationReadBody) => markNotificationRead(body),
    onSuccess: () => invalidateNotificationQueries(queryClient),
  });
}
