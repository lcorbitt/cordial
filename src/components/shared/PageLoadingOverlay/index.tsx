"use client";

import { Spinner } from "@/components/shared/Spinner";
import { cn } from "@/lib/utils";

import {
  HIDDEN_CLASS,
  LOADING_PAGE_LABEL,
  LOADING_PAGE_SR_LABEL,
  OVERLAY_CLASS,
  PROGRESS_BAR_CLASS,
  PROGRESS_BAR_FILL_CLASS,
  PROGRESS_BAR_HIDDEN_CLASS,
  PROGRESS_BAR_VISIBLE_CLASS,
  SR_ONLY_CLASS,
  VISIBLE_CLASS,
} from "./constants";
import { usePageLoadingOverlay } from "./usePageLoadingOverlay";

interface PageLoadingOverlayProps {
  active: boolean;
  /** When true, skip the show delay (e.g. route-level loading.tsx). */
  immediate?: boolean;
}

/**
 * Main-scoped navigation loading UI: thin top progress bar plus a blurred
 * scrim with a centered spinner. Absolute positioning fills `#main-content`
 * without covering navbars or sidebars.
 */
export function PageLoadingOverlay({
  active,
  immediate = false,
}: PageLoadingOverlayProps) {
  const { mounted, visible } = usePageLoadingOverlay({ active, immediate });

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
        aria-label={LOADING_PAGE_LABEL}
        className={cn(OVERLAY_CLASS, visible ? VISIBLE_CLASS : HIDDEN_CLASS)}
      >
        <Spinner size="md" />
        <span className={SR_ONLY_CLASS}>{LOADING_PAGE_SR_LABEL}</span>
      </div>
    </>
  );
}
