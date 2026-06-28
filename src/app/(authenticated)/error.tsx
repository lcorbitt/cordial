"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

import { BACK_TO_DASHBOARD_LABEL, DESCRIPTION, TITLE } from "./error/constants";
import { ErrorState } from "@/components/shared/error-state";

export default function AuthenticatedError({
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
      homeLabel={BACK_TO_DASHBOARD_LABEL}
    />
  );
}
