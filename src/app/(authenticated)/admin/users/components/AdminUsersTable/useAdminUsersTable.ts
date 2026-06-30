"use client";

import { createElement, useCallback, useMemo, useState } from "react";

import type {
  DataTableColumn,
  DataTableExportConfig,
  SortDirection,
} from "@/components/DataTable";
import { listAdminUsersForExport } from "@/frontend/services/admin.service";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useAdminUsersQuery } from "@/hooks/queries/useAdminUsers";
import type { AdminUserListItem } from "@shared/dto/admin.dto";

import {
  CELL_MUTED_CLASS,
  CELL_PRIMARY_CLASS,
  COLUMN_EMAIL_HEADER,
  COLUMN_NAME_HEADER,
  COLUMN_ROLES_HEADER,
  COLUMN_UPDATED_CLASS,
  COLUMN_UPDATED_HEADER,
  EXPORT_EMAIL_HEADER,
  EXPORT_NAME_HEADER,
  EXPORT_ROLES_HEADER,
  EXPORT_UPDATED_HEADER,
} from "./constants";
import {
  defaultSortDirectionForAdminUserColumn,
  formatPlatformRoleSlugs,
  formatUserUpdatedAt,
  normalizeAdminUserSortColumn,
  type AdminUserSortColumn,
} from "./utils";

export function useAdminUsersTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortColumn, setSortColumn] =
    useState<AdminUserSortColumn>("updated_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebouncedValue(search);

  const usersQuery = useAdminUsersQuery({
    page,
    pageSize,
    sortColumn,
    sortDirection,
    search: debouncedSearch,
  });

  const hasActiveFilters = debouncedSearch.length > 0;

  const handleSortChange = useCallback(
    (columnId: string) => {
      const column = normalizeAdminUserSortColumn(columnId);
      if (sortColumn === column) {
        setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      } else {
        setSortColumn(column);
        setSortDirection(defaultSortDirectionForAdminUserColumn(column));
      }
      setPage(1);
    },
    [sortColumn],
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const columns = useMemo<DataTableColumn<AdminUserListItem>[]>(
    () => [
      {
        id: "display_name",
        header: COLUMN_NAME_HEADER,
        sortable: true,
        exportHeader: EXPORT_NAME_HEADER,
        exportValue: (row) => row.displayName || row.email,
        cell: (row) =>
          createElement(
            "span",
            { className: CELL_PRIMARY_CLASS },
            row.displayName || row.email,
          ),
      },
      {
        id: "email",
        header: COLUMN_EMAIL_HEADER,
        sortable: true,
        exportHeader: EXPORT_EMAIL_HEADER,
        exportValue: (row) => row.email,
        cell: (row) =>
          createElement("span", { className: CELL_MUTED_CLASS }, row.email),
      },
      {
        id: "roles",
        header: COLUMN_ROLES_HEADER,
        exportHeader: EXPORT_ROLES_HEADER,
        exportValue: (row) => formatPlatformRoleSlugs(row.roleSlugs),
        cell: (row) =>
          createElement("span", null, formatPlatformRoleSlugs(row.roleSlugs)),
      },
      {
        id: "updated_at",
        header: COLUMN_UPDATED_HEADER,
        sortable: true,
        exportHeader: EXPORT_UPDATED_HEADER,
        exportValue: (row) => formatUserUpdatedAt(row.updatedAt),
        className: COLUMN_UPDATED_CLASS,
        headerClassName: COLUMN_UPDATED_CLASS,
        cell: (row) =>
          createElement(
            "span",
            { className: CELL_MUTED_CLASS },
            formatUserUpdatedAt(row.updatedAt),
          ),
      },
    ],
    [],
  );

  const fetchExportRows = useCallback(async () => {
    if ((usersQuery.data?.total ?? 0) === 0) {
      return [];
    }

    return listAdminUsersForExport({
      sortColumn,
      sortDirection,
      search: debouncedSearch || undefined,
    });
  }, [debouncedSearch, sortColumn, sortDirection, usersQuery.data?.total]);

  const tableExport = useMemo<DataTableExportConfig<AdminUserListItem>>(
    () => ({
      fileName: `platform-users-${new Date().toISOString().slice(0, 10)}`,
      fetchRows: fetchExportRows,
    }),
    [fetchExportRows],
  );

  const rows = usersQuery.data?.items ?? [];
  const totalCount = usersQuery.data?.total ?? 0;
  const fetching = usersQuery.isFetching;
  const loading = usersQuery.isPending && rows.length === 0;

  return {
    usersQuery,
    columns,
    rows,
    totalCount,
    loading,
    fetching,
    page,
    pageSize,
    sortColumn,
    sortDirection,
    search,
    hasActiveFilters,
    tableExport,
    setPage,
    setPageSize,
    handleSortChange,
    handleSearchChange,
  };
}
