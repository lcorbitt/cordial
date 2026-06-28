"use client";

import { useEffect, useState } from "react";

import { Spinner } from "@/components/shared/spinner";
import { cn } from "@/lib/utils";

import {
  CLASS,
  HIDDEN_CLASS,
  PROGRESS_BAR_CLASS,
  PROGRESS_BAR_FILL_CLASS,
  PROGRESS_BAR_HIDDEN_CLASS,
  PROGRESS_BAR_VISIBLE_CLASS,
  SR_ONLY_CLASS,
  VISIBLE_CLASS,
} from "./page-loading-overlay/constants";

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
          PROGRESS_BAR_CLASS,
          visible ? PROGRESS_BAR_VISIBLE_CLASS : PROGRESS_BAR_HIDDEN_CLASS,
        )}
      >
        <div className={PROGRESS_BAR_FILL_CLASS} />
      </div>

      <div
        role="status"
        aria-live="polite"
        aria-label="Loading page"
        className={cn(CLASS, visible ? VISIBLE_CLASS : HIDDEN_CLASS)}
      >
        <Spinner size="md" />
        <span className={SR_ONLY_CLASS}>Loading page</span>
      </div>
    </>
  );
}
