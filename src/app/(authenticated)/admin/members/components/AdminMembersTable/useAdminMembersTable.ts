"use client";

import Link from "next/link";
import { createElement, useCallback, useMemo, useState } from "react";

import type {
  DataTableColumn,
  DataTableExportConfig,
  SortDirection,
} from "@/components/DataTable";
import { listAdminCommunityMembersForExport } from "@/frontend/services/community.service";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  useAdminCommunitiesQuery,
  useAdminCommunityMembersQuery,
} from "@/hooks/queries/useCommunity";
import type { AdminCommunityMemberListItem } from "@shared/dto/community.dto";
import type { DataTableFilterOption } from "@/components/DataTable";

import {
  CELL_MUTED_CLASS,
  CELL_PRIMARY_CLASS,
  COLUMN_JOINED_CLASS,
  COLUMN_COMMUNITY_HEADER,
  COLUMN_EMAIL_HEADER,
  COLUMN_JOINED_HEADER,
  COLUMN_MEMBER_HEADER,
  COLUMN_ROLE_HEADER,
  EXPORT_COMMUNITY_HEADER,
  EXPORT_EMAIL_HEADER,
  EXPORT_JOINED_HEADER,
  EXPORT_MEMBER_HEADER,
  EXPORT_ROLE_HEADER,
} from "./constants";
import {
  defaultSortDirectionForAdminCommunityMemberColumn,
  formatCommunityRoleSlug,
  formatMemberJoinedAt,
  normalizeAdminCommunityMemberSortColumn,
  type AdminCommunityMemberSortColumn,
} from "./utils";

export function useAdminMembersTable() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortColumn, setSortColumn] =
    useState<AdminCommunityMemberSortColumn>("joined_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [search, setSearch] = useState("");
  const [communityId, setCommunityId] = useState("");

  const debouncedSearch = useDebouncedValue(search);

  const communitiesQuery = useAdminCommunitiesQuery({
    page: 1,
    pageSize: 100,
    sortColumn: "name",
    sortDirection: "asc",
    search: "",
  });

  const membersQuery = useAdminCommunityMembersQuery({
    page,
    pageSize,
    sortColumn,
    sortDirection,
    search: debouncedSearch,
    communityId,
  });

  const communityFilterOptions = useMemo<DataTableFilterOption[]>(() => {
    return (communitiesQuery.data?.items ?? []).map((community) => ({
      value: community.id,
      label: community.name,
    }));
  }, [communitiesQuery.data?.items]);

  const hasActiveFilters = debouncedSearch.length > 0 || communityId.length > 0;

  const handleSortChange = useCallback(
    (columnId: string) => {
      const column = normalizeAdminCommunityMemberSortColumn(columnId);
      if (sortColumn === column) {
        setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      } else {
        setSortColumn(column);
        setSortDirection(
          defaultSortDirectionForAdminCommunityMemberColumn(column),
        );
      }
      setPage(1);
    },
    [sortColumn],
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleCommunityChange = useCallback((value: string) => {
    setCommunityId(value);
    setPage(1);
  }, []);

  const columns = useMemo<DataTableColumn<AdminCommunityMemberListItem>[]>(
    () => [
      {
        id: "member_name",
        header: COLUMN_MEMBER_HEADER,
        sortable: true,
        exportHeader: EXPORT_MEMBER_HEADER,
        exportValue: (row) => row.memberDisplayName || row.memberEmail,
        cell: (row) =>
          createElement(
            "span",
            { className: CELL_PRIMARY_CLASS },
            row.memberDisplayName || row.memberEmail,
          ),
      },
      {
        id: "member_email",
        header: COLUMN_EMAIL_HEADER,
        sortable: true,
        exportHeader: EXPORT_EMAIL_HEADER,
        exportValue: (row) => row.memberEmail,
        cell: (row) =>
          createElement(
            "span",
            { className: CELL_MUTED_CLASS },
            row.memberEmail,
          ),
      },
      {
        id: "community_name",
        header: COLUMN_COMMUNITY_HEADER,
        sortable: true,
        exportHeader: EXPORT_COMMUNITY_HEADER,
        exportValue: (row) => row.communityName,
        cell: (row) =>
          createElement(
            Link,
            {
              href: `/communities/${row.communitySlug}`,
              className: "font-medium hover:underline",
            },
            row.communityName,
          ),
      },
      {
        id: "role_slug",
        header: COLUMN_ROLE_HEADER,
        sortable: true,
        exportHeader: EXPORT_ROLE_HEADER,
        exportValue: (row) => formatCommunityRoleSlug(row.roleSlug),
        cell: (row) =>
          createElement("span", null, formatCommunityRoleSlug(row.roleSlug)),
      },
      {
        id: "joined_at",
        header: COLUMN_JOINED_HEADER,
        sortable: true,
        exportHeader: EXPORT_JOINED_HEADER,
        exportValue: (row) => formatMemberJoinedAt(row.joinedAt),
        className: COLUMN_JOINED_CLASS,
        headerClassName: COLUMN_JOINED_CLASS,
        cell: (row) =>
          createElement(
            "span",
            { className: CELL_MUTED_CLASS },
            formatMemberJoinedAt(row.joinedAt),
          ),
      },
    ],
    [],
  );

  const fetchExportRows = useCallback(async () => {
    if ((membersQuery.data?.total ?? 0) === 0) {
      return [];
    }

    return listAdminCommunityMembersForExport({
      sortColumn,
      sortDirection,
      search: debouncedSearch || undefined,
      communityId: communityId || undefined,
    });
  }, [
    communityId,
    debouncedSearch,
    membersQuery.data?.total,
    sortColumn,
    sortDirection,
  ]);

  const tableExport = useMemo<
    DataTableExportConfig<AdminCommunityMemberListItem>
  >(
    () => ({
      fileName: `community-members-${new Date().toISOString().slice(0, 10)}`,
      fetchRows: fetchExportRows,
    }),
    [fetchExportRows],
  );

  const rows = membersQuery.data?.items ?? [];
  const totalCount = membersQuery.data?.total ?? 0;
  const fetching = membersQuery.isFetching;
  const loading = membersQuery.isPending && rows.length === 0;

  return {
    membersQuery,
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
    communityId,
    communityFilterOptions,
    hasActiveFilters,
    tableExport,
    setPage,
    setPageSize,
    handleSortChange,
    handleSearchChange,
    handleCommunityChange,
  };
}
