"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

import { BODY_CLASS, DESCRIPTION, TITLE } from "@/app/global-error/constants";
import { ErrorState } from "@/components/shared/error-state";

/**
 * Top-level error boundary. Reports to Sentry and shows a calm, plain-language
 * recovery screen — never a stack trace (OWASP A10).
 */
export default function GlobalError({
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
    <html lang="en">
      <body className={BODY_CLASS}>
        <ErrorState title={TITLE} description={DESCRIPTION} onRetry={reset} />
      </body>
    </html>
  );
}
