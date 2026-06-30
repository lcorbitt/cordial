import { PrefetchBoundary } from "@/lib/query/prefetch-boundary";
import { prefetchAdminUsersQuery } from "@/server/prefetch/admin";

import { AdminUsers } from "./components/AdminUsers";

/**
 * Platform user management for super admins. Lists elevated role holders.
 */
export default async function AdminUsersPage() {
  return (
    <PrefetchBoundary prefetch={prefetchAdminUsersQuery}>
      <AdminUsers />
    </PrefetchBoundary>
  );
}
