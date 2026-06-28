import { edgeFunctionFetch } from "@/lib/edge-function-fetch";
import { EDGE_FUNCTION_SLUGS } from "@/config/edge-function-slugs";
import type {
  ListNotificationsResponse,
  MarkNotificationReadBody,
  MarkNotificationReadResponse,
} from "@shared/dto/notification.dto";

/**
 * Browser-side HTTP adapters for in-app notifications.
 */
export function listNotifications(
  limit = 20,
): Promise<ListNotificationsResponse> {
  return edgeFunctionFetch<ListNotificationsResponse>(
    EDGE_FUNCTION_SLUGS.listNotifications,
    {
      query: limit !== 20 ? { limit: String(limit) } : undefined,
    },
  );
}

export function markNotificationRead(
  body: MarkNotificationReadBody,
): Promise<MarkNotificationReadResponse> {
  return edgeFunctionFetch<
    MarkNotificationReadResponse,
    MarkNotificationReadBody
  >(EDGE_FUNCTION_SLUGS.markNotificationRead, { method: "PATCH", body });
}
