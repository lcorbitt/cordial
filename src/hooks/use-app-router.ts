"use client";

import { useRouter } from "next/navigation";

import { startNavigationLoading } from "@/lib/state/navigation-loading";

/**
 * Router wrapper that shows navigation loading before programmatic navigations.
 */
export function useAppRouter() {
  const router = useRouter();

  return {
    ...router,
    push(href: string, options?: Parameters<typeof router.push>[1]) {
      startNavigationLoading();
      return router.push(href, options);
    },
  };
}
