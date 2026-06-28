"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AdminSidebar, AdminSidebarMobile } from "../AdminSidebar";

import {
  ADMIN_LAYOUT_CLASS,
  ADMIN_MAIN_CLASS,
  DEFAULT_MAIN_CLASS,
} from "./constants";

interface AuthenticatedShellBodyProps {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  children: ReactNode;
}

export function AuthenticatedShellBody({
  isAdmin,
  isSuperAdmin,
  children,
}: AuthenticatedShellBodyProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const showAdminSidebar = isAdminRoute && isAdmin;

  if (showAdminSidebar) {
    return (
      <div className={ADMIN_LAYOUT_CLASS}>
        <AdminSidebarMobile isSuperAdmin={isSuperAdmin} />
        <AdminSidebar isSuperAdmin={isSuperAdmin} />
        <main id="main-content" className={ADMIN_MAIN_CLASS}>
          {children}
        </main>
      </div>
    );
  }

  return (
    <main id="main-content" className={DEFAULT_MAIN_CLASS}>
      {children}
    </main>
  );
}
