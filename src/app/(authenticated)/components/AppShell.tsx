import Link from "next/link";
import type { ReactNode } from "react";

import { AuthenticatedLoadingShell } from "./AuthenticatedLoadingShell";
import { SignOutButton } from "./SignOutButton";

interface AppShellProps {
  email: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  children: ReactNode;
}

/**
 * Main product shell for signed-in users: top navigation plus content area.
 */
export function AppShell({
  email,
  isAdmin,
  isSuperAdmin,
  children,
}: AppShellProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b">
        <nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link
              href={isSuperAdmin ? "/admin/overview" : "/dashboard"}
              className="text-primary text-xl font-bold"
            >
              GoverNerds
            </Link>
            <div className="flex items-center gap-1">
              {!isSuperAdmin ? (
                <Link
                  href="/dashboard"
                  className="hover:bg-accent rounded-md px-3 py-2 text-base font-medium"
                >
                  Dashboard
                </Link>
              ) : null}
              <Link
                href="/profile"
                className="hover:bg-accent rounded-md px-3 py-2 text-base font-medium"
              >
                Profile
              </Link>
              {isSuperAdmin ? (
                <Link
                  href="/admin/overview"
                  className="hover:bg-accent rounded-md px-3 py-2 text-base font-medium"
                >
                  Overview
                </Link>
              ) : null}
              {isAdmin ? (
                <Link
                  href="/admin/flags"
                  className="hover:bg-accent rounded-md px-3 py-2 text-base font-medium"
                >
                  Admin
                </Link>
              ) : null}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground hidden text-sm sm:inline">
              {email}
            </span>
            <SignOutButton />
          </div>
        </nav>
      </header>
      <main
        id="main-content"
        className="mx-auto w-full max-w-5xl flex-1 px-4 py-8"
      >
        <AuthenticatedLoadingShell>{children}</AuthenticatedLoadingShell>
      </main>
    </div>
  );
}
