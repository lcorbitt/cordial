import type { ReactNode } from "react";

import { requireSuperAdmin } from "@/server/loaders/access";

export default async function AdminSettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireSuperAdmin();
  return <>{children}</>;
}
