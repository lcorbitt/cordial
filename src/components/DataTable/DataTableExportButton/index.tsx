"use client";

import { Download } from "lucide-react";

import {
  DATA_TABLE_EXPORT_BUTTON_CLASS,
  DATA_TABLE_EXPORT_BUTTON_ICON_CLASS,
  DATA_TABLE_EXPORT_BUTTON_LABEL,
  DATA_TABLE_EXPORTING_BUTTON_LABEL,
} from "../constants";
import type { DataTableColumn, DataTableExportConfig } from "../types";
import { useDataTableExport } from "../useDataTableExport";

interface DataTableExportButtonProps<T> {
  columns: DataTableColumn<T>[];
  exportConfig?: DataTableExportConfig<T>;
  disabled?: boolean;
}

export function DataTableExportButton<T>({
  columns,
  exportConfig,
  disabled = false,
}: DataTableExportButtonProps<T>) {
  const { canExport, exporting, handleExport } = useDataTableExport({
    columns,
    exportConfig,
  });

  if (!canExport) {
    return null;
  }

  return (
    <button
      type="button"
      className={DATA_TABLE_EXPORT_BUTTON_CLASS}
      disabled={disabled || exporting}
      onClick={() => void handleExport()}
    >
      <Download className={DATA_TABLE_EXPORT_BUTTON_ICON_CLASS} aria-hidden />
      {exporting
        ? DATA_TABLE_EXPORTING_BUTTON_LABEL
        : DATA_TABLE_EXPORT_BUTTON_LABEL}
    </button>
  );
}
