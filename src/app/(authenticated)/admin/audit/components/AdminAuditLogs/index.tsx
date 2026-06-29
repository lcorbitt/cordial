"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable, DataTableExportButton } from "@/components/DataTable";
import { ErrorState } from "@/components/shared/error-state";
import { TablePagination } from "@/components/TablePagination";

import {
  BACK_TO_ADMIN_LABEL,
  CARD_CLASS,
  EMPTY_MESSAGE,
  ERROR_DESCRIPTION,
  ERROR_TITLE,
  LOADING_BODY,
  LOADING_TEXT_CLASS,
  PAGE_CLASS,
  SUBTITLE,
  SUBTITLE_CLASS,
  TABLE_CARD_DESCRIPTION,
  TABLE_CARD_TITLE,
  TITLE,
  TITLE_CLASS,
  TOOLBAR_CLASS,
} from "./constants";
import { useAdminAuditLogs } from "./useAdminAuditLogs";

export function AdminAuditLogs() {
  const {
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
  } = useAdminAuditLogs();

  if (auditLogsQuery.isPending && rows.length === 0) {
    return <p className={LOADING_TEXT_CLASS}>{LOADING_BODY}</p>;
  }

  if (auditLogsQuery.isError) {
    return (
      <ErrorState
        title={ERROR_TITLE}
        description={ERROR_DESCRIPTION}
        onRetry={() => auditLogsQuery.refetch()}
        homeHref="/admin/overview"
        homeLabel={BACK_TO_ADMIN_LABEL}
      />
    );
  }

  return (
    <div className={PAGE_CLASS}>
      <div>
        <h1 className={TITLE_CLASS}>{TITLE}</h1>
        <p className={SUBTITLE_CLASS}>{SUBTITLE}</p>
      </div>

      <Card className={CARD_CLASS}>
        <CardHeader>
          <CardTitle>{TABLE_CARD_TITLE}</CardTitle>
          <CardDescription>{TABLE_CARD_DESCRIPTION}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className={TOOLBAR_CLASS}>
            <DataTableExportButton
              columns={columns}
              exportConfig={tableExport}
              disabled={totalCount === 0 || fetching}
            />
          </div>
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
          <TablePagination
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            disabled={fetching}
          />
        </CardContent>
      </Card>
    </div>
  );
}
