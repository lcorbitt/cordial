import type { DataTableColumn } from "./types";

const CSV_EMPTY_VALUE = "—";

function escapeCsvCell(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function formatCsvValue(value: string | null | undefined): string {
  if (value == null || value.trim() === "") {
    return CSV_EMPTY_VALUE;
  }
  return value;
}

export function resolveDataTableExportHeader<T>(
  column: DataTableColumn<T>,
): string | null {
  if (column.exportValue == null) {
    return null;
  }

  if (column.exportHeader) {
    return column.exportHeader;
  }

  if (typeof column.header === "string") {
    return column.header;
  }

  return column.id;
}

export function buildDataTableCsv<T>(
  columns: DataTableColumn<T>[],
  rows: T[],
): string {
  const exportColumns = columns
    .map((column) => ({
      column,
      header: resolveDataTableExportHeader(column),
    }))
    .filter(
      (entry): entry is { column: DataTableColumn<T>; header: string } =>
        entry.header != null,
    );

  const headerLine = exportColumns
    .map((entry) => escapeCsvCell(entry.header))
    .join(",");

  const bodyLines = rows.map((row) =>
    exportColumns
      .map((entry) => {
        const raw = entry.column.exportValue?.(row);
        return escapeCsvCell(formatCsvValue(raw));
      })
      .join(","),
  );

  return [headerLine, ...bodyLines].join("\r\n");
}

export function downloadCsvFile(fileName: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName.endsWith(".csv") ? fileName : `${fileName}.csv`;
  anchor.click();
  URL.revokeObjectURL(url);
}
