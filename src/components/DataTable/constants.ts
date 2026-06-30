export const DATA_TABLE_EXPORT_BUTTON_LABEL = "Export";
export const DATA_TABLE_EXPORTING_BUTTON_LABEL = "Exporting…";

export const DATA_TABLE_EXPORT_BUTTON_CLASS =
  "inline-flex h-8 shrink-0 items-center justify-center gap-2 rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 shadow-sm transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:bg-zinc-900";

export const DATA_TABLE_EXPORT_BUTTON_ICON_CLASS = "h-4 w-4 shrink-0";

export const DEFAULT_EMPTY_MESSAGE = "No rows.";
export const LOADING_MESSAGE = "Loading…";

export const TABLE_WRAPPER_CLASS = "w-full overflow-x-auto";
export const TABLE_CLASS = "w-full border-collapse text-sm";
export const THEAD_CLASS = "border-b border-zinc-200 dark:border-zinc-700";
export const TH_CLASS =
  "px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400";
export const SORT_BUTTON_CLASS =
  "inline-flex items-center gap-2 text-left transition-colors hover:text-zinc-800 dark:hover:text-zinc-200";
export const SORT_ICON_CLASS = "h-3.5 w-3.5 shrink-0";
export const TBODY_CLASS = "divide-y divide-zinc-200 dark:divide-zinc-700";
export const TR_CLASS = "group transition-interactive";
export const TR_INTERACTIVE_CLASS =
  "cursor-pointer hover:bg-primary-orange/5 focus-visible:outline-none";
export const TD_CLASS = "px-4 py-2.5 text-zinc-800 dark:text-zinc-200";
export const TD_FIRST_INTERACTIVE_CLASS =
  "border-l-2 border-l-transparent group-hover:border-l-primary-orange";
export const LOADING_CELL_CLASS =
  "px-4 py-8 text-center text-zinc-500 dark:text-zinc-400";
export const EMPTY_CELL_CLASS =
  "px-4 py-8 text-center text-zinc-500 dark:text-zinc-400";

export const DATA_TABLE_TOOLBAR_CLASS =
  "flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 px-4 py-2 dark:border-zinc-700";
export const DATA_TABLE_TOOLBAR_FILTERS_CLASS =
  "flex min-w-0 flex-1 flex-wrap items-end gap-2";
export const DATA_TABLE_TOOLBAR_ACTIONS_CLASS =
  "flex shrink-0 flex-wrap items-center gap-2";

export const DATA_TABLE_SEARCH_WRAPPER_CLASS = "relative min-w-[12rem] flex-1";
export const DATA_TABLE_SEARCH_INPUT_CLASS = "h-8 pl-8 text-sm";
export const DATA_TABLE_SEARCH_ICON_CLASS =
  "pointer-events-none absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-zinc-400";

export const DATA_TABLE_FILTER_FIELD_CLASS = "flex flex-col gap-2";
export const DATA_TABLE_FILTER_LABEL_CLASS =
  "text-xs font-medium text-zinc-500 dark:text-zinc-400";
export const DATA_TABLE_FILTER_SELECT_CLASS =
  "border-input bg-background ring-offset-background focus-visible:ring-ring h-8 min-w-[8rem] rounded-md border px-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

export const DATA_TABLE_FILTER_ALL_VALUE = "";
export const DATA_TABLE_FILTER_ALL_LABEL = "All";

export const DATA_TABLE_DATE_RANGE_SELECT_ID = "data-table-date-range";

export const DATA_TABLE_DATE_RANGE_OPTIONS = [
  { value: "all", label: "All Time" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 90 Days" },
] as const;
