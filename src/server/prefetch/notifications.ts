import "server-only";

import type { QueryClient } from "@tanstack/react-query";

import { EDGE_FUNCTION_SLUGS } from "@/config/edge-function-slugs";
import { notificationQueryKeys } from "@/hooks/queries/notification.keys";
import { edgeFunctionFetchServer } from "@/lib/edge-function/fetch.server";
import type { ListNotificationsResponse } from "@shared/dto/notification.dto";

export async function prefetchNotificationsQuery(
  queryClient: QueryClient,
): Promise<void> {
  await queryClient.prefetchQuery({
    queryKey: notificationQueryKeys.list(),
    queryFn: () =>
      edgeFunctionFetchServer<ListNotificationsResponse>(
        EDGE_FUNCTION_SLUGS.listNotifications,
      ),
  });
}
