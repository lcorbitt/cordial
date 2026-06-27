"use client";

import { useEffect, useState } from "react";

import { Spinner } from "@/components/shared/spinner";
import { cn } from "@/lib/utils";

interface PageLoadingOverlayProps {
  active: boolean;
  /** When true, skip the show delay (e.g. route-level loading.tsx). */
  immediate?: boolean;
}

const SHOW_DELAY_MS = 100;
const FADE_MS = 150;

/**
 * Full-viewport navigation loading UI: thin top progress bar plus a blurred
 * scrim with a centered spinner. Fixed positioning covers the shell even when
 * mounted inside a nested layout segment.
 */
export function PageLoadingOverlay({
  active,
  immediate = false,
}: PageLoadingOverlayProps) {
  const [mounted, setMounted] = useState(immediate && active);
  const [visible, setVisible] = useState(immediate && active);

  useEffect(() => {
    let showTimer: number | undefined;
    let fadeTimer: number | undefined;
    let unmountTimer: number | undefined;

    if (!active) {
      fadeTimer = window.setTimeout(() => {
        setVisible(false);
        unmountTimer = window.setTimeout(() => setMounted(false), FADE_MS);
      }, 0);
    } else {
      fadeTimer = window.setTimeout(() => {
        setMounted(true);
        if (immediate) {
          setVisible(true);
        } else {
          showTimer = window.setTimeout(() => setVisible(true), SHOW_DELAY_MS);
        }
      }, 0);
    }

    return () => {
      if (showTimer !== undefined) window.clearTimeout(showTimer);
      if (fadeTimer !== undefined) window.clearTimeout(fadeTimer);
      if (unmountTimer !== undefined) window.clearTimeout(unmountTimer);
    };
  }, [active, immediate]);

  useEffect(() => {
    if (!mounted || !visible) return;

    document.body.setAttribute("aria-busy", "true");
    return () => {
      document.body.removeAttribute("aria-busy");
    };
  }, [mounted, visible]);

  if (!mounted) return null;

  return (
    <>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-60 h-0.5 overflow-hidden transition-opacity duration-150",
          visible ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="bg-primary loading-bar h-full w-1/3" />
      </div>

      <div
        role="status"
        aria-live="polite"
        aria-label="Loading page"
        className={cn(
          "fixed inset-0 z-55 flex items-center justify-center transition-opacity duration-150 motion-reduce:backdrop-blur-none",
          "bg-background/40 dark:bg-background/50 backdrop-blur-sm",
          visible
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
      >
        <Spinner size="md" />
        <span className="sr-only">Loading page</span>
      </div>
    </>
  );
}
