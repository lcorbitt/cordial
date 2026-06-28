"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorState } from "@/components/shared/error-state";
import { useFeatureFlagQuery } from "@/hooks/queries/useFeatureFlag";

import {
  FLAG_CARD_TITLE,
  FLAG_CHECKING_BODY,
  FLAG_ERROR_DESCRIPTION,
  FLAG_ERROR_TITLE,
  FLAG_OFF_LABEL,
  FLAG_ON_LABEL,
  FLAG_ON_PREFIX_BODY,
  FLAG_ON_SUFFIX_BODY,
  FLAG_VALUE_CLASS,
  MUTED_TEXT_CLASS,
  PAGE_CLASS,
  SUBTITLE,
  SUBTITLE_CLASS,
  TITLE,
  TITLE_CLASS,
} from "./constants";

/**
 * Dashboard home. Demonstrates the full read path:
 * component → TanStack hook → frontend service → Edge Function → service → DB.
 */
export function Dashboard() {
  const newDashboard = useFeatureFlagQuery("new-dashboard");

  return (
    <div className={PAGE_CLASS}>
      <div>
        <h1 className={TITLE_CLASS}>{TITLE}</h1>
        <p className={SUBTITLE_CLASS}>{SUBTITLE}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{FLAG_CARD_TITLE}</CardTitle>
          <CardDescription>
            Live evaluation of the <code>new-dashboard</code> flag for your
            account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {newDashboard.isPending ? (
            <p className={MUTED_TEXT_CLASS}>{FLAG_CHECKING_BODY}</p>
          ) : newDashboard.isError ? (
            <ErrorState
              title={FLAG_ERROR_TITLE}
              description={FLAG_ERROR_DESCRIPTION}
              onRetry={() => newDashboard.refetch()}
            />
          ) : (
            <p className={FLAG_VALUE_CLASS}>
              {FLAG_ON_PREFIX_BODY}{" "}
              <strong>
                {newDashboard.data?.enabled ? FLAG_ON_LABEL : FLAG_OFF_LABEL}
              </strong>{" "}
              {FLAG_ON_SUFFIX_BODY}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
