import { useQuery, useQueryClient } from "@tanstack/react-query";

import { listNotifications } from "@/frontend/services/notification.service";
import {
  notificationQueryKeyRoot,
  notificationQueryKeys,
} from "@/hooks/queries/notification.keys";

const DEFAULT_LIMIT = 20;

export function useNotificationsQuery(limit = DEFAULT_LIMIT) {
  return useQuery({
    queryKey: notificationQueryKeys.list(limit),
    queryFn: () => listNotifications(limit),
  });
}

export function invalidateNotificationQueries(
  queryClient: ReturnType<typeof useQueryClient>,
): void {
  queryClient.invalidateQueries({ queryKey: notificationQueryKeyRoot });
}
