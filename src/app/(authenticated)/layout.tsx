import type { ReactNode } from "react";

import { isSuperAdmin } from "@/server/loaders/access";
import { requireSession } from "@/server/loaders/session";
import { PrefetchBoundary } from "@/lib/query/prefetch-boundary";
import { prefetchAuthenticatedShellQueries } from "@/server/prefetch/authenticated-shell";

import { AppShell } from "./components/AppShell";

const ADMIN_ROLES = ["admin", "super_admin"];

/**
 * Authenticated group layout. Gates access and renders the product shell.
 */
export default async function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireSession();
  const isAdmin = session.roleSlugs.some((slug) => ADMIN_ROLES.includes(slug));
  const superAdmin = isSuperAdmin(session);

  return (
    <PrefetchBoundary prefetch={prefetchAuthenticatedShellQueries}>
      <AppShell
        userId={session.user.id}
        isAdmin={isAdmin}
        isSuperAdmin={superAdmin}
      >
        {children}
      </AppShell>
    </PrefetchBoundary>
  );
}
