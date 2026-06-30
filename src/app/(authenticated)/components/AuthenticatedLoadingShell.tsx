"use client";

import type { ReactNode } from "react";

import { useNavigationLoading } from "@/hooks/use-navigation-loading";
import { NavigationLoadingHost } from "@/hosts/navigation-loading-host";

interface AuthenticatedLoadingShellProps {
  children: ReactNode;
}

/**
 * Client shell for authenticated routes: link-click detection and the loading
 * overlay host. Loading UI is scoped to `#main-content` only.
 */
export function AuthenticatedLoadingShell({
  children,
}: AuthenticatedLoadingShellProps) {
  useNavigationLoading();

  return (
    <>
      {children}
      <NavigationLoadingHost />
    </>
  );
}
