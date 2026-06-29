import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

import {
  buildDataTableCsv,
  resolveDataTableExportHeader,
} from "@/components/DataTable/utils";
import type { DataTableColumn } from "@/components/DataTable/types";

interface TestRow {
  name: string;
  note: string | null;
}

describe("resolveDataTableExportHeader", () => {
  it("returns null when exportValue is not set", () => {
    const column: DataTableColumn<TestRow> = {
      id: "name",
      header: "Name",
      cell: (row) => row.name,
    };

    expect(resolveDataTableExportHeader(column)).toBeNull();
  });

  it("prefers exportHeader over header and id", () => {
    const column: DataTableColumn<TestRow> = {
      id: "name",
      header: "Name",
      exportHeader: "Full Name",
      exportValue: (row) => row.name,
      cell: (row) => row.name,
    };

    expect(resolveDataTableExportHeader(column)).toBe("Full Name");
  });

  it("falls back to string header then id", () => {
    const withHeader: DataTableColumn<TestRow> = {
      id: "name",
      header: "Name",
      exportValue: (row) => row.name,
      cell: (row) => row.name,
    };
    const withIdOnly: DataTableColumn<TestRow> = {
      id: "name",
      header: null as unknown as ReactNode,
      exportValue: (row) => row.name,
      cell: (row) => row.name,
    };

    expect(resolveDataTableExportHeader(withHeader)).toBe("Name");
    expect(resolveDataTableExportHeader(withIdOnly)).toBe("name");
  });
});

describe("buildDataTableCsv", () => {
  const columns: DataTableColumn<TestRow>[] = [
    {
      id: "name",
      header: "Name",
      exportValue: (row) => row.name,
      cell: (row) => row.name,
    },
    {
      id: "note",
      header: "Note",
      exportValue: (row) => row.note,
      cell: (row) => row.note,
    },
    {
      id: "actions",
      header: "Actions",
      cell: () => "Edit",
    },
  ];

  it("quotes cells with commas and escapes quotes", () => {
    const csv = buildDataTableCsv(columns, [
      { name: "Acme, Inc.", note: 'Said "hello"' },
    ]);

    expect(csv).toBe('Name,Note\r\n"Acme, Inc.","Said ""hello"""');
  });

  it("uses em dash for empty values and skips display-only columns", () => {
    const csv = buildDataTableCsv(columns, [{ name: "Acme", note: null }]);

    expect(csv).toBe("Name,Note\r\nAcme,—");
  });
});
