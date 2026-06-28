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

import { NOTIFICATION_BELL_COPY } from "./constants";

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
          className="relative"
          aria-label={NOTIFICATION_BELL_COPY.label}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 ? (
            <span className="bg-primary text-primary-foreground absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between gap-2">
          <span>{NOTIFICATION_BELL_COPY.title}</span>
          {unreadCount > 0 ? (
            <button
              type="button"
              className="text-primary text-xs font-medium hover:underline"
              disabled={markReadMutation.isPending}
              onClick={() => void handleMarkAllRead()}
            >
              {NOTIFICATION_BELL_COPY.markAllRead}
            </button>
          ) : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notificationsQuery.isPending ? (
          <p className="text-muted-foreground px-2 py-3 text-sm">
            {NOTIFICATION_BELL_COPY.loading}
          </p>
        ) : notificationsQuery.isError ? (
          <p className="text-muted-foreground px-2 py-3 text-sm">
            {NOTIFICATION_BELL_COPY.error}
          </p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground px-2 py-3 text-sm">
            {NOTIFICATION_BELL_COPY.empty}
          </p>
        ) : (
          items.map((item) => (
            <DropdownMenuItem
              key={item.id}
              className="flex cursor-default flex-col items-start gap-1 p-3"
              onSelect={(event) => event.preventDefault()}
            >
              <div className="flex w-full items-start justify-between gap-2">
                <p
                  className={cn(
                    "text-sm leading-snug font-medium",
                    item.readAt ? "text-muted-foreground" : "text-foreground",
                  )}
                >
                  {item.title}
                </p>
                {!item.readAt ? (
                  <button
                    type="button"
                    className="text-primary shrink-0 text-xs hover:underline"
                    disabled={markReadMutation.isPending}
                    onClick={() => void handleMarkOneRead(item.id)}
                  >
                    {NOTIFICATION_BELL_COPY.markRead}
                  </button>
                ) : null}
              </div>
              <p className="text-muted-foreground text-sm leading-snug">
                {item.body}
              </p>
              {item.actionUrl ? (
                <Link
                  href={item.actionUrl}
                  className="text-primary text-sm font-medium hover:underline"
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
