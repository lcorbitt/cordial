import { PrefetchBoundary } from "@/lib/query/prefetch-boundary";
import { prefetchAdminCommunitiesQuery } from "@/server/prefetch/community";

import { AdminCommunities } from "./components/AdminCommunities";

/**
 * Admin communities page. Create communities and send email invitations.
 */
export default async function AdminCommunitiesPage() {
  return (
    <PrefetchBoundary prefetch={prefetchAdminCommunitiesQuery}>
      <AdminCommunities />
    </PrefetchBoundary>
  );
}
