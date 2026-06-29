"use client";

import { cn } from "@/lib/utils";

import {
  CONTROLS_CLASS,
  NAV_BUTTON_CLASS,
  NEXT_LABEL,
  PAGE_INFO_CLASS,
  PAGE_SIZE_GROUP_CLASS,
  PAGE_SIZE_LABEL_CLASS,
  PAGE_SIZE_OPTIONS,
  PAGE_SIZE_SELECT_CLASS,
  PREVIOUS_LABEL,
  ROOT_CLASS,
  ROWS_PER_PAGE_LABEL,
} from "./constants";

interface TablePaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  disabled?: boolean;
}

export function TablePagination({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  disabled = false,
}: TablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageInfo = `Page ${safePage} of ${totalPages}`;

  return (
    <div className={ROOT_CLASS}>
      <div className={PAGE_SIZE_GROUP_CLASS}>
        <label htmlFor="table-page-size" className={PAGE_SIZE_LABEL_CLASS}>
          {ROWS_PER_PAGE_LABEL}
        </label>
        <select
          id="table-page-size"
          className={PAGE_SIZE_SELECT_CLASS}
          value={pageSize}
          disabled={disabled}
          onChange={(event) => {
            const nextPageSize = Number.parseInt(event.target.value, 10);
            onPageSizeChange(nextPageSize);
            onPageChange(1);
          }}
        >
          {PAGE_SIZE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <div className={CONTROLS_CLASS}>
        <p className={PAGE_INFO_CLASS}>{pageInfo}</p>
        <button
          type="button"
          className={cn(NAV_BUTTON_CLASS)}
          disabled={disabled || safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
        >
          {PREVIOUS_LABEL}
        </button>
        <button
          type="button"
          className={cn(NAV_BUTTON_CLASS)}
          disabled={disabled || safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
        >
          {NEXT_LABEL}
        </button>
      </div>
    </div>
  );
}
