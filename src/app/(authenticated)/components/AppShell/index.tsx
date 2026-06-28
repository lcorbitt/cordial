import type { ReactNode } from "react";

import { AuthenticatedLoadingShell } from "../AuthenticatedLoadingShell";
import { AuthenticatedShellBody } from "../AuthenticatedShellBody";
import { MemberTopNav } from "../MemberTopNav";
import { ProfileRealtimeSync } from "../ProfileRealtimeSync";

import { ROOT_CLASS } from "./constants";

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
    <div className={ROOT_CLASS}>
      <ProfileRealtimeSync userId={userId} />
      <MemberTopNav
        userId={userId}
        isAdmin={isAdmin}
        isSuperAdmin={isSuperAdmin}
      />
      <AuthenticatedShellBody isAdmin={isAdmin} isSuperAdmin={isSuperAdmin}>
        <AuthenticatedLoadingShell>{children}</AuthenticatedLoadingShell>
      </AuthenticatedShellBody>
    </div>
  );
}
