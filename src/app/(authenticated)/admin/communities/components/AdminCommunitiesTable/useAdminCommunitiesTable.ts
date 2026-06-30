"use client";

import Link from "next/link";
import {
  createElement,
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import type {
  DataTableColumn,
  DataTableExportConfig,
  SortDirection,
} from "@/components/DataTable";
import { listAdminCommunitiesForExport } from "@/frontend/services/community.service";
import { useAdminCommunitiesQuery } from "@/hooks/queries/useCommunity";
import type { CommunitySummary } from "@shared/dto/community.dto";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  CELL_NAME_CLASS,
  CELL_SLUG_CLASS,
  COLUMN_HOME_CLASS,
  COLUMN_INVITE_CLASS,
  COLUMN_HOME_HEADER,
  COLUMN_INVITE_HEADER,
  COLUMN_NAME_HEADER,
  COLUMN_SLUG_HEADER,
  EXPORT_NAME_HEADER,
  EXPORT_SLUG_HEADER,
  INVITE_CELL_CLASS,
  INVITE_FIELD_CLASS,
  INVITE_LABEL,
  INVITE_PLACEHOLDER,
  SEND_INVITE_LABEL,
  SENDING_INVITE_LABEL,
  VIEW_HOME_LABEL,
} from "./constants";
import {
  defaultSortDirectionForCommunityColumn,
  normalizeCommunitySortColumn,
  type CommunitySortColumn,
} from "./utils";

interface UseAdminCommunitiesTableOptions {
  inviteEmails: Record<string, string>;
  setInviteEmails: Dispatch<SetStateAction<Record<string, string>>>;
  sendingInviteFor: string | null;
  onSendInvite: (communityId: string, communityName: string) => void;
}

export function useAdminCommunitiesTable({
  inviteEmails,
  setInviteEmails,
  sendingInviteFor,
  onSendInvite,
}: UseAdminCommunitiesTableOptions) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [sortColumn, setSortColumn] = useState<CommunitySortColumn>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const adminQuery = useAdminCommunitiesQuery({
    page,
    pageSize,
    sortColumn,
    sortDirection,
  });

  const handleSortChange = useCallback(
    (columnId: string) => {
      const column = normalizeCommunitySortColumn(columnId);
      if (sortColumn === column) {
        setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      } else {
        setSortColumn(column);
        setSortDirection(defaultSortDirectionForCommunityColumn());
      }
      setPage(1);
    },
    [sortColumn],
  );

  const columns = useMemo<DataTableColumn<CommunitySummary>[]>(
    () => [
      {
        id: "name",
        header: COLUMN_NAME_HEADER,
        sortable: true,
        exportHeader: EXPORT_NAME_HEADER,
        exportValue: (row) => row.name,
        cell: (row) =>
          createElement("span", { className: CELL_NAME_CLASS }, row.name),
      },
      {
        id: "slug",
        header: COLUMN_SLUG_HEADER,
        sortable: true,
        exportHeader: EXPORT_SLUG_HEADER,
        exportValue: (row) => row.slug,
        cell: (row) =>
          createElement("span", { className: CELL_SLUG_CLASS }, `/${row.slug}`),
      },
      {
        id: "home",
        header: COLUMN_HOME_HEADER,
        className: COLUMN_HOME_CLASS,
        headerClassName: COLUMN_HOME_CLASS,
        cell: (row) =>
          createElement(
            Button,
            { asChild: true, variant: "outline", size: "sm" },
            createElement(
              Link,
              { href: `/communities/${row.slug}` },
              VIEW_HOME_LABEL,
            ),
          ),
      },
      {
        id: "invite",
        header: COLUMN_INVITE_HEADER,
        className: COLUMN_INVITE_CLASS,
        cell: (row) =>
          createElement(
            "div",
            { className: INVITE_CELL_CLASS },
            createElement(
              "div",
              { className: INVITE_FIELD_CLASS },
              createElement(
                Label,
                { htmlFor: `invite-${row.id}` },
                INVITE_LABEL,
              ),
              createElement(Input, {
                id: `invite-${row.id}`,
                type: "email",
                placeholder: INVITE_PLACEHOLDER,
                value: inviteEmails[row.id] ?? "",
                onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
                  setInviteEmails((current) => ({
                    ...current,
                    [row.id]: event.target.value,
                  })),
              }),
            ),
            createElement(
              Button,
              {
                type: "button",
                disabled: sendingInviteFor === row.id,
                onClick: () => onSendInvite(row.id, row.name),
              },
              sendingInviteFor === row.id
                ? SENDING_INVITE_LABEL
                : SEND_INVITE_LABEL,
            ),
          ),
      },
    ],
    [inviteEmails, onSendInvite, sendingInviteFor, setInviteEmails],
  );

  const fetchExportRows = useCallback(async () => {
    if ((adminQuery.data?.total ?? 0) === 0) {
      return [];
    }

    return listAdminCommunitiesForExport({
      sortColumn,
      sortDirection,
    });
  }, [adminQuery.data?.total, sortColumn, sortDirection]);

  const tableExport = useMemo<DataTableExportConfig<CommunitySummary>>(
    () => ({
      fileName: `communities-${new Date().toISOString().slice(0, 10)}`,
      fetchRows: fetchExportRows,
    }),
    [fetchExportRows],
  );

  const rows = adminQuery.data?.items ?? [];
  const totalCount = adminQuery.data?.total ?? 0;
  const fetching = adminQuery.isFetching;
  const loading = adminQuery.isPending && rows.length === 0;

  return {
    adminQuery,
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
