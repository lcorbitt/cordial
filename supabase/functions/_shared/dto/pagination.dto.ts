export type SortDirection = "asc" | "desc";

export interface PaginatedListQuery {
  page: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: SortDirection;
}

export interface PaginatedListResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
