import type { ReactNode } from "react";

import { AuthenticatedLoadingShell } from "../AuthenticatedLoadingShell";
import { AuthenticatedShellBody } from "../AuthenticatedShellBody";
import { NotificationRealtimeSync } from "../NotificationRealtimeSync";
import { ProfileRealtimeSync } from "../ProfileRealtimeSync";

interface AppShellProps {
  userId: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  children: ReactNode;
}

/**
 * Main product shell for signed-in users: Skool-style top navigation plus
 * optional admin sidebar on `/admin/*` routes.
 */
export function AppShell({
  userId,
  isAdmin,
  isSuperAdmin,
  children,
}: AppShellProps) {
  return (
    <>
      <ProfileRealtimeSync userId={userId} />
      <NotificationRealtimeSync userId={userId} />
      <AuthenticatedShellBody isAdmin={isAdmin} isSuperAdmin={isSuperAdmin}>
        <AuthenticatedLoadingShell>{children}</AuthenticatedLoadingShell>
      </AuthenticatedShellBody>
    </>
  );
}
