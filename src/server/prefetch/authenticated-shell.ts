import "server-only";

import type { QueryClient } from "@tanstack/react-query";

import { prefetchNotificationsQuery } from "@/server/prefetch/notifications";
import { prefetchProfileQuery } from "@/server/prefetch/profile";

export async function prefetchAuthenticatedShellQueries(
  queryClient: QueryClient,
): Promise<void> {
  await Promise.all([
    prefetchNotificationsQuery(queryClient),
    prefetchProfileQuery(queryClient),
  ]);
}
