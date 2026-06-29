"use client";

import { DataTable } from "@/components/DataTable";
import { ErrorState } from "@/components/shared/error-state";

import {
  BACK_TO_DASHBOARD_LABEL,
  CARD_CONTENT_CLASS,
  EMPTY_MESSAGE,
  LIST_ERROR_DESCRIPTION,
  LIST_ERROR_TITLE,
  LIST_LOADING_BODY,
  LOADING_TEXT_CLASS,
} from "./constants";
import { useAdminCommunitiesTable } from "./useAdminCommunitiesTable";
import type { useAdminCommunities } from "../AdminCommunities/useAdminCommunities";

interface AdminCommunitiesTableProps {
  adminQuery: ReturnType<typeof useAdminCommunities>["adminQuery"];
  inviteEmails: ReturnType<typeof useAdminCommunities>["inviteEmails"];
  setInviteEmails: ReturnType<typeof useAdminCommunities>["setInviteEmails"];
  sendingInviteFor: ReturnType<typeof useAdminCommunities>["sendingInviteFor"];
  onSendInvite: ReturnType<typeof useAdminCommunities>["onSendInvite"];
}

export function AdminCommunitiesTable({
  adminQuery,
  inviteEmails,
  setInviteEmails,
  sendingInviteFor,
  onSendInvite,
}: AdminCommunitiesTableProps) {
  const {
    columns,
    rows,
    loading,
    sortColumn,
    sortDirection,
    handleSortChange,
  } = useAdminCommunitiesTable({
    adminQuery,
    inviteEmails,
    setInviteEmails,
    sendingInviteFor,
    onSendInvite,
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
      <DataTable
        columns={columns}
        rows={rows}
        getRowId={(row) => row.id}
        loading={loading}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        emptyMessage={EMPTY_MESSAGE}
      />
    </div>
  );
}
