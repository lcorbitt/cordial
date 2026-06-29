import { PrefetchBoundary } from "@/lib/query/prefetch-boundary";
import { prefetchAuditLogsQuery } from "@/server/prefetch/admin";

import { AdminAuditLogs } from "./components/AdminAuditLogs";

export default async function AdminAuditPage() {
  return (
    <PrefetchBoundary prefetch={prefetchAuditLogsQuery}>
      <AdminAuditLogs />
    </PrefetchBoundary>
  );
}
