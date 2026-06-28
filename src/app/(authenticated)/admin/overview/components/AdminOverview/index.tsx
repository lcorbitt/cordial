"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorState } from "@/components/shared/error-state";
import { Reveal } from "@/components/shared/reveal";
import { useAdminOverviewQuery } from "@/hooks/queries/useAdminOverview";

import {
  ANALYTICS_DESCRIPTION,
  ANALYTICS_TITLE,
  AUDIT_DESCRIPTION,
  AUDIT_TITLE,
  BACK_TO_ADMIN_LABEL,
  DETAIL_GRID_CLASS,
  EMPTY_TEXT_CLASS,
  ENTRY_ACTION_CLASS,
  ENTRY_ITEM_CLASS,
  ENTRY_LIST_CLASS,
  ENTRY_META_CLASS,
  ENTRY_TIMESTAMP_CLASS,
  ERROR_DESCRIPTION,
  ERROR_TITLE,
  LOADING_BODY,
  LOADING_TEXT_CLASS,
  NO_ANALYTICS_BODY,
  NO_AUDIT_BODY,
  PAGE_CLASS,
  PROFILES_DESCRIPTION,
  PROFILES_TITLE,
  RECENT_ANALYTICS_DESCRIPTION,
  RECENT_ANALYTICS_TITLE,
  RECENT_AUDIT_DESCRIPTION,
  RECENT_AUDIT_TITLE,
  STAT_VALUE_CLASS,
  STATS_GRID_CLASS,
  SUBTITLE,
  SUBTITLE_CLASS,
  TITLE,
  TITLE_CLASS,
} from "./constants";

function formatWhen(iso: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function AdminOverview() {
  const overviewQuery = useAdminOverviewQuery();

  if (overviewQuery.isPending) {
    return <p className={LOADING_TEXT_CLASS}>{LOADING_BODY}</p>;
  }

  if (overviewQuery.isError || !overviewQuery.data) {
    return (
      <ErrorState
        title={ERROR_TITLE}
        description={ERROR_DESCRIPTION}
        onRetry={() => overviewQuery.refetch()}
        homeHref="/admin/flags"
        homeLabel={BACK_TO_ADMIN_LABEL}
      />
    );
  }

  const data = overviewQuery.data;

  return (
    <div className={PAGE_CLASS}>
      <div>
        <h1 className={TITLE_CLASS}>{TITLE}</h1>
        <p className={SUBTITLE_CLASS}>{SUBTITLE}</p>
      </div>

      <Reveal className={STATS_GRID_CLASS}>
        <Card>
          <CardHeader>
            <CardTitle>{PROFILES_TITLE}</CardTitle>
            <CardDescription>{PROFILES_DESCRIPTION}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className={STAT_VALUE_CLASS}>{data.totalProfiles}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{AUDIT_TITLE}</CardTitle>
            <CardDescription>{AUDIT_DESCRIPTION}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className={STAT_VALUE_CLASS}>{data.auditLogCount24h}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{ANALYTICS_TITLE}</CardTitle>
            <CardDescription>{ANALYTICS_DESCRIPTION}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className={STAT_VALUE_CLASS}>{data.analyticsEventCount24h}</p>
          </CardContent>
        </Card>
      </Reveal>

      <Reveal className={DETAIL_GRID_CLASS}>
        <Card>
          <CardHeader>
            <CardTitle>{RECENT_AUDIT_TITLE}</CardTitle>
            <CardDescription>{RECENT_AUDIT_DESCRIPTION}</CardDescription>
          </CardHeader>
          <CardContent>
            {data.recentAuditLogs.length === 0 ? (
              <p className={EMPTY_TEXT_CLASS}>{NO_AUDIT_BODY}</p>
            ) : (
              <ul className={ENTRY_LIST_CLASS}>
                {data.recentAuditLogs.map((entry) => (
                  <li key={entry.id} className={ENTRY_ITEM_CLASS}>
                    <p className={ENTRY_ACTION_CLASS}>{entry.action}</p>
                    <p className={ENTRY_META_CLASS}>
                      {entry.resourceType}
                      {entry.resourceId ? ` · ${entry.resourceId}` : ""}
                    </p>
                    <p className={ENTRY_TIMESTAMP_CLASS}>
                      {formatWhen(entry.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{RECENT_ANALYTICS_TITLE}</CardTitle>
            <CardDescription>{RECENT_ANALYTICS_DESCRIPTION}</CardDescription>
          </CardHeader>
          <CardContent>
            {data.recentAnalyticsEvents.length === 0 ? (
              <p className={EMPTY_TEXT_CLASS}>{NO_ANALYTICS_BODY}</p>
            ) : (
              <ul className={ENTRY_LIST_CLASS}>
                {data.recentAnalyticsEvents.map((entry) => (
                  <li key={entry.id} className={ENTRY_ITEM_CLASS}>
                    <p className={ENTRY_ACTION_CLASS}>{entry.eventName}</p>
                    <p className={ENTRY_META_CLASS}>
                      {entry.environment}
                      {entry.userId
                        ? ` · user ${entry.userId.slice(0, 8)}…`
                        : ""}
                    </p>
                    <p className={ENTRY_TIMESTAMP_CLASS}>
                      {formatWhen(entry.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
