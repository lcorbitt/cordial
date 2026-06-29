"use client";

import { createElement, useCallback, useMemo, useState } from "react";

import type {
  DataTableColumn,
  DataTableExportConfig,
} from "@/components/DataTable";
import { listAuditLogsForExport } from "@/frontend/services/admin.service";
import { useAuditLogsQuery } from "@/hooks/queries/useAuditLogs";
import type { AdminAuditLogEntry } from "@shared/dto/admin.dto";
import type { SortDirection } from "@shared/dto/pagination.dto";

import {
  CELL_MONO_CLASS,
  CELL_MUTED_CLASS,
  CELL_PRIMARY_CLASS,
  COLUMN_ACTION_HEADER,
  COLUMN_ACTOR_HEADER,
  COLUMN_RESOURCE_HEADER,
  COLUMN_RESOURCE_ID_CLASS,
  COLUMN_RESOURCE_ID_HEADER,
  COLUMN_TIME_CLASS,
  COLUMN_TIME_HEADER,
  COLUMN_TIME_HEADER_CLASS,
  EXPORT_ACTOR_HEADER,
  EXPORT_RESOURCE_ID_HEADER,
  EXPORT_TIME_HEADER,
} from "./constants";
import {
  defaultSortDirectionForAuditLogColumn,
  formatAuditLogActor,
  formatAuditLogResourceId,
  formatAuditLogWhen,
  normalizeAuditLogSortColumn,
  type AuditLogSortColumn,
} from "./utils";

export function useAdminAuditLogs() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortColumn, setSortColumn] =
    useState<AuditLogSortColumn>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const auditLogsQuery = useAuditLogsQuery({
    page,
    pageSize,
    sortColumn,
    sortDirection,
  });

  const handleSortChange = useCallback(
    (columnId: string) => {
      const column = normalizeAuditLogSortColumn(columnId);
      if (sortColumn === column) {
        setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      } else {
        setSortColumn(column);
        setSortDirection(defaultSortDirectionForAuditLogColumn(column));
      }
      setPage(1);
    },
    [sortColumn],
  );

  const columns = useMemo<DataTableColumn<AdminAuditLogEntry>[]>(
    () => [
      {
        id: "created_at",
        header: COLUMN_TIME_HEADER,
        sortable: true,
        exportHeader: EXPORT_TIME_HEADER,
        exportValue: (row) => formatAuditLogWhen(row.createdAt),
        className: COLUMN_TIME_CLASS,
        headerClassName: COLUMN_TIME_HEADER_CLASS,
        cell: (row) =>
          createElement(
            "span",
            { className: CELL_PRIMARY_CLASS },
            formatAuditLogWhen(row.createdAt),
          ),
      },
      {
        id: "action",
        header: COLUMN_ACTION_HEADER,
        sortable: true,
        exportValue: (row) => row.action,
        cell: (row) => createElement("span", null, row.action),
      },
      {
        id: "resource_type",
        header: COLUMN_RESOURCE_HEADER,
        sortable: true,
        exportValue: (row) => row.resourceType,
        cell: (row) => createElement("span", null, row.resourceType),
      },
      {
        id: "resource_id",
        header: COLUMN_RESOURCE_ID_HEADER,
        exportHeader: EXPORT_RESOURCE_ID_HEADER,
        exportValue: (row) => row.resourceId ?? undefined,
        className: COLUMN_RESOURCE_ID_CLASS,
        cell: (row) =>
          createElement(
            "span",
            {
              className: CELL_MONO_CLASS,
              title: row.resourceId ?? undefined,
            },
            formatAuditLogResourceId(row.resourceId),
          ),
      },
      {
        id: "actor_id",
        header: COLUMN_ACTOR_HEADER,
        sortable: true,
        exportHeader: EXPORT_ACTOR_HEADER,
        exportValue: (row) => formatAuditLogActor(row.actorId),
        cell: (row) =>
          createElement(
            "span",
            {
              className: CELL_MUTED_CLASS,
              title: row.actorId ?? undefined,
            },
            formatAuditLogActor(row.actorId),
          ),
      },
    ],
    [],
  );

  const fetchExportRows = useCallback(async () => {
    if ((auditLogsQuery.data?.total ?? 0) === 0) {
      return [];
    }

    return listAuditLogsForExport({
      sortColumn,
      sortDirection,
    });
  }, [auditLogsQuery.data?.total, sortColumn, sortDirection]);

  const tableExport = useMemo<DataTableExportConfig<AdminAuditLogEntry>>(
    () => ({
      fileName: `audit-logs-${new Date().toISOString().slice(0, 10)}`,
      fetchRows: fetchExportRows,
    }),
    [fetchExportRows],
  );

  const rows = auditLogsQuery.data?.items ?? [];
  const totalCount = auditLogsQuery.data?.total ?? 0;
  const fetching = auditLogsQuery.isFetching;
  const loading = auditLogsQuery.isPending && rows.length === 0;

  return {
    auditLogsQuery,
    columns,
    rows,
    totalCount,
    loading,
    fetching,
    page,
    pageSize,
    sortColumn,
    sortDirection,
    tableExport,
    setPage,
    setPageSize,
    handleSortChange,
  };
}
