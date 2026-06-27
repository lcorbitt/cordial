"use client";

import { usePathname } from "next/navigation";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

import { navigationLoadingAtom } from "@/lib/state/navigation-loading";

function isInternalNavigation(anchor: HTMLAnchorElement): boolean {
  if (anchor.target === "_blank" || anchor.hasAttribute("download")) {
    return false;
  }

  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#")) {
    return false;
  }

  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:")
  ) {
    try {
      const url = new URL(href);
      if (url.origin !== window.location.origin) {
        return false;
      }
    } catch {
      return false;
    }
  }

  try {
    const url = new URL(href, window.location.origin);
    const current = `${window.location.pathname}${window.location.search}`;
    const next = `${url.pathname}${url.search}`;
    if (current === next) {
      return false;
    }
  } catch {
    return false;
  }

  return true;
}

/**
 * Wires document-level link clicks to navigation loading state and clears
 * loading when the pathname commits. Mount only inside authenticated routes.
 */
export function useNavigationLoading() {
  const pathname = usePathname();
  const setLoading = useSetAtom(navigationLoadingAtom);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const anchor = (event.target as Element | null)?.closest("a");
      if (!anchor || !isInternalNavigation(anchor)) {
        return;
      }

      setLoading(true);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [setLoading]);

  useEffect(() => {
    setLoading(false);
  }, [pathname, setLoading]);
}
