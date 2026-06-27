"use client";

import { useAtomValue } from "jotai";

import { PageLoadingOverlay } from "@/components/shared/page-loading-overlay";
import { navigationLoadingAtom } from "@/lib/state/navigation-loading";

/**
 * Global navigation loading host for authenticated routes. Renders the shared
 * overlay when client-side navigation is in progress.
 */
export function NavigationLoadingHost() {
  const loading = useAtomValue(navigationLoadingAtom);

  return <PageLoadingOverlay active={loading} />;
}
