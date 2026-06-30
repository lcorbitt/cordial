import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_RESOURCE_TYPES,
} from "@shared/admin/audit-log-catalog";
import type { DataTableFilterOption } from "@/components/DataTable";

export const TITLE = "Audit Logs";
export const SUBTITLE =
  "Review platform activity recorded for security and compliance.";
export const TABLE_CARD_TITLE = "Recent Activity";
export const TABLE_CARD_DESCRIPTION =
  "Search, filter, sort columns, or export matching rows to CSV.";
export const EMPTY_MESSAGE = "No audit logs yet.";
export const FILTERED_EMPTY_MESSAGE = "No audit logs match your filters.";
export const BACK_TO_ADMIN_LABEL = "Back to Admin";

export const SEARCH_PLACEHOLDER = "Search audit logs…";
export const SEARCH_ARIA_LABEL = "Search Audit Logs";
export const ACTION_FILTER_LABEL = "Action";
export const RESOURCE_FILTER_LABEL = "Resource Type";
export const DATE_RANGE_FILTER_LABEL = "Date Range";

export const ACTION_FILTER_ID = "audit-log-action-filter";
export const RESOURCE_FILTER_ID = "audit-log-resource-filter";

const ACTION_FILTER_LABELS: Record<string, string> = {
  "community.created": "Community Created",
  "community.member_joined": "Community Member Joined",
  "profile.updated": "Profile Updated",
  "user.created": "User Created",
};

const RESOURCE_FILTER_LABELS: Record<string, string> = {
  community: "Community",
  profile: "Profile",
  user: "User",
};

export const ACTION_FILTER_OPTIONS: DataTableFilterOption[] =
  AUDIT_LOG_ACTIONS.map((action) => ({
    value: action,
    label: ACTION_FILTER_LABELS[action] ?? action,
  }));

export const RESOURCE_FILTER_OPTIONS: DataTableFilterOption[] =
  AUDIT_LOG_RESOURCE_TYPES.map((resourceType) => ({
    value: resourceType,
    label: RESOURCE_FILTER_LABELS[resourceType] ?? resourceType,
  }));

export const ERROR_TITLE = "Could Not Load Audit Logs";
export const ERROR_DESCRIPTION =
  "We could not load audit logs right now. Please try again.";
export const LOADING_BODY = "Loading audit logs…";

export const COLUMN_TIME_HEADER = "Time";
export const COLUMN_ACTION_HEADER = "Action";
export const COLUMN_RESOURCE_HEADER = "Resource";
export const COLUMN_RESOURCE_ID_HEADER = "Resource ID";
export const COLUMN_ACTOR_HEADER = "Actor";

export const EXPORT_TIME_HEADER = "Time";
export const EXPORT_RESOURCE_ID_HEADER = "Resource ID";
export const EXPORT_ACTOR_HEADER = "Actor";

export const PAGE_CLASS = "flex flex-col gap-6";
export const TITLE_CLASS = "text-3xl font-serif font-bold";
export const SUBTITLE_CLASS = "text-muted-foreground mt-2 text-base";
export const CARD_CLASS = "overflow-hidden";
export const LOADING_TEXT_CLASS = "text-muted-foreground text-base";
export const EMPTY_TEXT_CLASS = "text-muted-foreground text-base";
export const CELL_PRIMARY_CLASS = "font-medium";
export const CELL_MUTED_CLASS = "text-xs text-zinc-500 dark:text-zinc-400";
export const CELL_MONO_CLASS = "font-mono text-xs";
export const COLUMN_TIME_CLASS = "whitespace-nowrap";
export const COLUMN_TIME_HEADER_CLASS = "whitespace-nowrap";
export const COLUMN_RESOURCE_ID_CLASS = "min-w-[8rem]";
