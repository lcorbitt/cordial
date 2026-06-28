"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AdminSidebar, AdminSidebarMobile } from "../AdminSidebar";

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
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col md:flex-row">
        <AdminSidebarMobile isSuperAdmin={isSuperAdmin} />
        <AdminSidebar isSuperAdmin={isSuperAdmin} />
        <main id="main-content" className="min-w-0 flex-1 px-4 py-8">
          {children}
        </main>
      </div>
    );
  }

  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-5xl flex-1 px-4 py-8"
    >
      {children}
    </main>
  );
}
