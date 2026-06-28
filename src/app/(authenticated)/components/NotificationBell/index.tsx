"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import {
  invalidateNotificationQueries,
  useNotificationsQuery,
} from "@/hooks/queries/useNotifications";
import { useMarkNotificationReadMutation } from "@/hooks/mutations/useNotification";
import { cn } from "@/lib/utils";

import {
  ACTION_LINK_CLASS,
  BADGE_CLASS,
  DROPDOWN_CLASS,
  EMPTY_MESSAGE,
  ERROR_MESSAGE,
  ICON_CLASS,
  ITEM_BODY_CLASS,
  ITEM_CLASS,
  ITEM_HEADER_CLASS,
  ITEM_TITLE_CLASS,
  ITEM_TITLE_READ_CLASS,
  ITEM_TITLE_UNREAD_CLASS,
  LABEL,
  LABEL_CLASS,
  LOADING_MESSAGE,
  MARK_ALL_READ_BUTTON_CLASS,
  MARK_ALL_READ_LABEL,
  MARK_READ_BUTTON_CLASS,
  MARK_READ_LABEL,
  STATUS_MESSAGE_CLASS,
  TITLE,
  TRIGGER_CLASS,
} from "./constants";

interface NotificationBellProps {
  userId: string;
}

/**
 * In-app notification bell with unread badge, dropdown list, and Realtime refresh.
 */
export function NotificationBell({ userId }: NotificationBellProps) {
  const queryClient = useQueryClient();
  const notificationsQuery = useNotificationsQuery();
  const markReadMutation = useMarkNotificationReadMutation();

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          invalidateNotificationQueries(queryClient);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, userId]);

  const unreadCount = notificationsQuery.data?.unreadCount ?? 0;
  const items = notificationsQuery.data?.items ?? [];

  async function handleMarkAllRead() {
    if (unreadCount === 0) return;
    await markReadMutation.mutateAsync({ all: true });
  }

  async function handleMarkOneRead(notificationId: string) {
    await markReadMutation.mutateAsync({ notificationId });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={TRIGGER_CLASS}
          aria-label={LABEL}
        >
          <Bell className={ICON_CLASS} />
          {unreadCount > 0 ? (
            <span className={BADGE_CLASS}>
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={DROPDOWN_CLASS}>
        <DropdownMenuLabel className={LABEL_CLASS}>
          <span>{TITLE}</span>
          {unreadCount > 0 ? (
            <button
              type="button"
              className={MARK_ALL_READ_BUTTON_CLASS}
              disabled={markReadMutation.isPending}
              onClick={() => void handleMarkAllRead()}
            >
              {MARK_ALL_READ_LABEL}
            </button>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notificationsQuery.isPending ? (
          <p className={STATUS_MESSAGE_CLASS}>{LOADING_MESSAGE}</p>
        ) : notificationsQuery.isError ? (
          <p className={STATUS_MESSAGE_CLASS}>{ERROR_MESSAGE}</p>
        ) : items.length === 0 ? (
          <p className={STATUS_MESSAGE_CLASS}>{EMPTY_MESSAGE}</p>
        ) : (
          items.map((item) => (
            <DropdownMenuItem
              key={item.id}
              className={ITEM_CLASS}
              onSelect={(event) => event.preventDefault()}
            >
              <div className={ITEM_HEADER_CLASS}>
                <p
                  className={cn(
                    ITEM_TITLE_CLASS,
                    item.readAt
                      ? ITEM_TITLE_READ_CLASS
                      : ITEM_TITLE_UNREAD_CLASS,
                  )}
                >
                  {item.title}
                </p>
                {!item.readAt ? (
                  <button
                    type="button"
                    className={MARK_READ_BUTTON_CLASS}
                    disabled={markReadMutation.isPending}
                    onClick={() => void handleMarkOneRead(item.id)}
                  >
                    {MARK_READ_LABEL}
                  </button>
                ) : null}
              </div>
              <p className={ITEM_BODY_CLASS}>{item.body}</p>
              {item.actionUrl ? (
                <Link
                  href={item.actionUrl}
                  className={ACTION_LINK_CLASS}
                  onClick={() => {
                    if (!item.readAt) void handleMarkOneRead(item.id);
                  }}
                >
                  View
                </Link>
              ) : null}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
