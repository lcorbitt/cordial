import { PageLoadingOverlay } from "@/components/shared/page-loading-overlay";

/**
 * Instant fallback while an authenticated route segment streams on the server.
 * Fixed overlay covers the full shell even when rendered inside main.
 */
export default function AuthenticatedLoading() {
  return <PageLoadingOverlay active immediate />;
}
