"use client";

import { useCallback, useMemo, useState } from "react";

import type { DataTableColumn, DataTableExportConfig } from "./types";
import { buildDataTableCsv, downloadCsvFile } from "./utils";

export function useDataTableExport<T>({
  columns,
  exportConfig,
}: {
  columns: DataTableColumn<T>[];
  exportConfig?: DataTableExportConfig<T>;
}) {
  const [exporting, setExporting] = useState(false);

  const canExport = useMemo(
    () =>
      exportConfig != null &&
      columns.some((column) => column.exportValue != null),
    [columns, exportConfig],
  );

  const handleExport = useCallback(async () => {
    if (!exportConfig || exporting || !canExport) {
      return;
    }

    setExporting(true);
    try {
      const rows = await exportConfig.fetchRows();
      const csv = buildDataTableCsv(columns, rows);
      downloadCsvFile(exportConfig.fileName, csv);
    } finally {
      setExporting(false);
    }
  }, [canExport, columns, exportConfig, exporting]);

  return { canExport, exporting, handleExport };
}
