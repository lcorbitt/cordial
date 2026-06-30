"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AdminSidebar, AdminSidebarMobile } from "../AdminSidebar";
import { MemberTopNav } from "../MemberTopNav";
import { ROOT_CLASS } from "../AppShell/constants";

import {
  ADMIN_MAIN_CLASS,
  ADMIN_MEMBER_SHELL_CLASS,
  ADMIN_ROOT_CLASS,
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
  const showAdminSidebar = isAdmin;
  const mainClass = isAdminRoute ? ADMIN_MAIN_CLASS : DEFAULT_MAIN_CLASS;

  const topNav = (
    <MemberTopNav
      isAdmin={isAdmin}
      isSuperAdmin={isSuperAdmin}
      layout={showAdminSidebar ? "admin" : "default"}
    />
  );

  if (showAdminSidebar) {
    return (
      <div className={ADMIN_ROOT_CLASS}>
        <AdminSidebar isSuperAdmin={isSuperAdmin} />
        <div className={ADMIN_MEMBER_SHELL_CLASS}>
          {topNav}
          <AdminSidebarMobile isSuperAdmin={isSuperAdmin} />
          <main id="main-content" className={mainClass}>
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={ROOT_CLASS}>
      {topNav}
      <main id="main-content" className={DEFAULT_MAIN_CLASS}>
        {children}
      </main>
    </div>
  );
}
