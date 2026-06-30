"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import type { KeyboardEvent } from "react";

import { cn } from "@/lib/utils";

import {
  DEFAULT_EMPTY_MESSAGE,
  EMPTY_CELL_CLASS,
  LOADING_CELL_CLASS,
  LOADING_MESSAGE,
  SORT_BUTTON_CLASS,
  SORT_ICON_CLASS,
  TABLE_CLASS,
  TABLE_WRAPPER_CLASS,
  TBODY_CLASS,
  TD_CLASS,
  TD_FIRST_INTERACTIVE_CLASS,
  TH_CLASS,
  THEAD_CLASS,
  TR_CLASS,
  TR_INTERACTIVE_CLASS,
} from "./constants";
import type { DataTableColumn, SortDirection } from "./types";

export type {
  DataTableColumn,
  DataTableExportConfig,
  SortDirection,
} from "./types";
export { DataTableExportButton } from "./DataTableExportButton";
export { DataTableToolbar } from "./DataTableToolbar";
export { DataTableSearchInput } from "./DataTableSearchInput";
export {
  DataTableFilterSelect,
  type DataTableFilterOption,
} from "./DataTableFilterSelect";
export { DataTableDateRangeSelect } from "./DataTableDateRangeSelect";

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  sortColumn?: string | null;
  sortDirection?: SortDirection;
  onSortChange?: (columnId: string) => void;
};

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  emptyMessage = DEFAULT_EMPTY_MESSAGE,
  onRowClick,
  loading = false,
  sortColumn = null,
  sortDirection = "desc",
  onSortChange,
}: DataTableProps<T>) {
  function handleRowKeyDown(event: KeyboardEvent<HTMLTableRowElement>, row: T) {
    if (!onRowClick) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRowClick(row);
    }
  }

  return (
    <div className={TABLE_WRAPPER_CLASS}>
      <table className={TABLE_CLASS}>
        <thead className={THEAD_CLASS}>
          <tr>
            {columns.map((column) => {
              const isSortable = Boolean(column.sortable && onSortChange);
              const isActive = sortColumn === column.id;

              return (
                <th
                  key={column.id}
                  scope="col"
                  className={cn(TH_CLASS, column.headerClassName)}
                >
                  {isSortable ? (
                    <button
                      type="button"
                      className={SORT_BUTTON_CLASS}
                      onClick={() => onSortChange?.(column.id)}
                    >
                      {column.header}
                      {isActive ? (
                        sortDirection === "asc" ? (
                          <ArrowUp className={SORT_ICON_CLASS} aria-hidden />
                        ) : (
                          <ArrowDown className={SORT_ICON_CLASS} aria-hidden />
                        )
                      ) : null}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className={TBODY_CLASS}>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className={LOADING_CELL_CLASS}>
                {LOADING_MESSAGE}
              </td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={EMPTY_CELL_CLASS}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={getRowId(row)}
                className={cn(TR_CLASS, onRowClick && TR_INTERACTIVE_CLASS)}
                tabIndex={onRowClick ? 0 : undefined}
                role={onRowClick ? "link" : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={
                  onRowClick
                    ? (event) => handleRowKeyDown(event, row)
                    : undefined
                }
              >
                {columns.map((column, columnIndex) => (
                  <td
                    key={column.id}
                    className={cn(
                      TD_CLASS,
                      column.className,
                      onRowClick &&
                        columnIndex === 0 &&
                        TD_FIRST_INTERACTIVE_CLASS,
                    )}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
