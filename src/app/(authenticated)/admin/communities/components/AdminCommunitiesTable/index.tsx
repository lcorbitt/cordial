"use client";

import {
  DataTable,
  DataTableExportButton,
  DataTableSearchInput,
  DataTableToolbar,
} from "@/components/DataTable";
import { ErrorState } from "@/components/shared/ErrorState";
import { TablePagination } from "@/components/TablePagination";

import {
  BACK_TO_DASHBOARD_LABEL,
  CARD_CONTENT_CLASS,
  EMPTY_MESSAGE,
  FILTERED_EMPTY_MESSAGE,
  LIST_ERROR_DESCRIPTION,
  LIST_ERROR_TITLE,
  LIST_LOADING_BODY,
  LOADING_TEXT_CLASS,
  SEARCH_ARIA_LABEL,
  SEARCH_PLACEHOLDER,
} from "./constants";
import { useAdminCommunitiesTable } from "./useAdminCommunitiesTable";
import type { useAdminCommunities } from "../AdminCommunities/useAdminCommunities";

interface AdminCommunitiesTableProps {
  inviteEmails: ReturnType<typeof useAdminCommunities>["inviteEmails"];
  setInviteEmails: ReturnType<typeof useAdminCommunities>["setInviteEmails"];
  sendingInviteFor: ReturnType<typeof useAdminCommunities>["sendingInviteFor"];
  onSendInvite: ReturnType<typeof useAdminCommunities>["onSendInvite"];
  onEditCommunity: ReturnType<typeof useAdminCommunities>["openEditModal"];
}

export function AdminCommunitiesTable({
  inviteEmails,
  setInviteEmails,
  sendingInviteFor,
  onSendInvite,
  onEditCommunity,
}: AdminCommunitiesTableProps) {
  const {
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
    search,
    hasActiveFilters,
    tableExport,
    setPage,
    setPageSize,
    handleSortChange,
    handleSearchChange,
  } = useAdminCommunitiesTable({
    inviteEmails,
    setInviteEmails,
    sendingInviteFor,
    onSendInvite,
    onEditCommunity,
  });

  if (adminQuery.isPending && rows.length === 0) {
    return <p className={LOADING_TEXT_CLASS}>{LIST_LOADING_BODY}</p>;
  }

  if (adminQuery.isError) {
    return (
      <ErrorState
        title={LIST_ERROR_TITLE}
        description={LIST_ERROR_DESCRIPTION}
        onRetry={() => adminQuery.refetch()}
        homeHref="/dashboard"
        homeLabel={BACK_TO_DASHBOARD_LABEL}
      />
    );
  }

  return (
    <div className={CARD_CONTENT_CLASS}>
      <DataTableToolbar
        filters={
          <DataTableSearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder={SEARCH_PLACEHOLDER}
            ariaLabel={SEARCH_ARIA_LABEL}
            disabled={fetching}
          />
        }
        actions={
          <DataTableExportButton
            columns={columns}
            exportConfig={tableExport}
            disabled={totalCount === 0 || fetching}
          />
        }
      />
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        loading={loading}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        emptyMessage={hasActiveFilters ? FILTERED_EMPTY_MESSAGE : EMPTY_MESSAGE}
      />
      <TablePagination
        page={page}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        disabled={fetching}
      />
    </div>
  );
}
