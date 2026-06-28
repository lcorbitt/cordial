"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

import {
  DESCRIPTION,
  GO_TO_DASHBOARD_LABEL,
  TITLE,
} from "@/app/error/constants";
import { ErrorState } from "@/components/shared/error-state";

/**
 * Route-level error boundary. Reports to Sentry and shows a calm recovery
 * screen — never a stack trace (OWASP A10).
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <ErrorState
      title={TITLE}
      description={DESCRIPTION}
      onRetry={reset}
      homeHref="/dashboard"
      homeLabel={GO_TO_DASHBOARD_LABEL}
    />
  );
}
