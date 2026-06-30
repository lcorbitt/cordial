import { PrefetchBoundary } from "@/lib/query/prefetch-boundary";
import { prefetchAdminCommunityMembersQuery } from "@/server/prefetch/community";

import { AdminMembers } from "./components/AdminMembers";

/**
 * Admin community members page. Lists membership rows across communities.
 */
export default async function AdminMembersPage() {
  return (
    <PrefetchBoundary prefetch={prefetchAdminCommunityMembersQuery}>
      <AdminMembers />
    </PrefetchBoundary>
  );
}
