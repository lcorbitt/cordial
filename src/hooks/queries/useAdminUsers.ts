import { useQuery } from "@tanstack/react-query";

import { listAdminUsers } from "@/frontend/services/admin.service";
import {
  adminQueryKeys,
  type AdminUsersQueryParams,
} from "@/hooks/queries/admin.keys";
import type { AdminUserListQuery } from "@shared/dto/admin.dto";

export { adminQueryKeys };

function toAdminUserListQuery(
  params: AdminUsersQueryParams,
): AdminUserListQuery {
  return {
    page: params.page,
    pageSize: params.pageSize,
    sortColumn: params.sortColumn,
    sortDirection: params.sortDirection,
    search: params.search || undefined,
  };
}

export function useAdminUsersQuery(params: AdminUsersQueryParams) {
  return useQuery({
    queryKey: adminQueryKeys.users(params),
    queryFn: () => listAdminUsers(toAdminUserListQuery(params)),
  });
}
