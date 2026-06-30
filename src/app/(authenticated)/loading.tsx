import { PageLoadingOverlay } from "@/components/shared/PageLoadingOverlay";

/**
 * Instant fallback while an authenticated route segment streams on the server.
 * Overlay is scoped to `#main-content` via absolute positioning inside `<main>`.
 */
export default function AuthenticatedLoading() {
  return <PageLoadingOverlay active immediate />;
}
