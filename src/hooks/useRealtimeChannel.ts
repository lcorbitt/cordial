"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";

export type RealtimeChannelStatus =
  | "connecting"
  | "subscribed"
  | "error"
  | "closed";

/**
 * Shared Supabase Realtime transport. Handles channel lifecycle, explicit
 * connection status, cleanup, and manual reconnect. Domain protocol and cache
 * merge live in *RealtimeSync components and hooks/queries — not here.
 */
export function useRealtimeChannel(
  channelName: string,
  configure: (channel: RealtimeChannel) => RealtimeChannel,
  deps: readonly unknown[],
): { status: RealtimeChannelStatus; reconnect: () => void } {
  const [status, setStatus] = useState<RealtimeChannelStatus>("connecting");
  const [reconnectKey, setReconnectKey] = useState(0);
  const configureRef = useRef(configure);

  useEffect(() => {
    configureRef.current = configure;
  });

  const reconnect = useCallback(() => {
    setStatus("connecting");
    setReconnectKey((key) => key + 1);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    const channel = configureRef.current(supabase.channel(channelName));

    channel.subscribe((subscribeStatus) => {
      switch (subscribeStatus) {
        case "SUBSCRIBED":
          setStatus("subscribed");
          break;
        case "CHANNEL_ERROR":
        case "TIMED_OUT":
          setStatus("error");
          break;
        case "CLOSED":
          setStatus("closed");
          break;
        default:
          setStatus("connecting");
      }
    });

    return () => {
      void supabase.removeChannel(channel);
    };
    // Caller supplies domain deps (e.g. userId) alongside channelName.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps array is intentional
  }, [channelName, reconnectKey, ...deps]);

  return { status, reconnect };
}
