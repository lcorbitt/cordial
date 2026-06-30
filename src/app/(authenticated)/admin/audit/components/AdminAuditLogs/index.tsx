"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DataTable,
  DataTableDateRangeSelect,
  DataTableExportButton,
  DataTableFilterSelect,
  DataTableSearchInput,
  DataTableToolbar,
} from "@/components/DataTable";
import { ErrorState } from "@/components/shared/ErrorState";
import { TablePagination } from "@/components/TablePagination";

import {
  ACTION_FILTER_ID,
  ACTION_FILTER_LABEL,
  ACTION_FILTER_OPTIONS,
  BACK_TO_ADMIN_LABEL,
  CARD_CLASS,
  DATE_RANGE_FILTER_LABEL,
  EMPTY_MESSAGE,
  ERROR_DESCRIPTION,
  ERROR_TITLE,
  FILTERED_EMPTY_MESSAGE,
  LOADING_BODY,
  LOADING_TEXT_CLASS,
  PAGE_CLASS,
  RESOURCE_FILTER_ID,
  RESOURCE_FILTER_LABEL,
  RESOURCE_FILTER_OPTIONS,
  SEARCH_ARIA_LABEL,
  SEARCH_PLACEHOLDER,
  SUBTITLE,
  SUBTITLE_CLASS,
  TABLE_CARD_DESCRIPTION,
  TABLE_CARD_TITLE,
  TITLE,
  TITLE_CLASS,
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
    search,
    action,
    resourceType,
    dateRange,
    hasActiveFilters,
    tableExport,
    setPage,
    setPageSize,
    handleSortChange,
    handleSearchChange,
    handleActionChange,
    handleResourceTypeChange,
    handleDateRangeChange,
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
          <DataTableToolbar
            filters={
              <>
                <DataTableSearchInput
                  value={search}
                  onChange={handleSearchChange}
                  placeholder={SEARCH_PLACEHOLDER}
                  ariaLabel={SEARCH_ARIA_LABEL}
                  disabled={fetching}
                />
                <DataTableFilterSelect
                  id={ACTION_FILTER_ID}
                  label={ACTION_FILTER_LABEL}
                  value={action}
                  onChange={handleActionChange}
                  options={ACTION_FILTER_OPTIONS}
                  disabled={fetching}
                />
                <DataTableFilterSelect
                  id={RESOURCE_FILTER_ID}
                  label={RESOURCE_FILTER_LABEL}
                  value={resourceType}
                  onChange={handleResourceTypeChange}
                  options={RESOURCE_FILTER_OPTIONS}
                  disabled={fetching}
                />
                <DataTableDateRangeSelect
                  value={dateRange}
                  onChange={handleDateRangeChange}
                  label={DATE_RANGE_FILTER_LABEL}
                  disabled={fetching}
                />
              </>
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
            emptyMessage={
              hasActiveFilters ? FILTERED_EMPTY_MESSAGE : EMPTY_MESSAGE
            }
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
