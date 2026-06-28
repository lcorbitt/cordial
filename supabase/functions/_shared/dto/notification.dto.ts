/**
 * Wire contracts for notification endpoints.
 */
export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  body: string;
  actionUrl: string | null;
  readAt: string | null;
  createdAt: string;
}

export interface ListNotificationsResponse {
  items: NotificationItem[];
  unreadCount: number;
}

export interface MarkNotificationReadBody {
  notificationId?: string;
  all?: boolean;
}

export interface MarkNotificationReadResponse {
  unreadCount: number;
}
