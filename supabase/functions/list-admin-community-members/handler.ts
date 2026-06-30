import type { HandlerContext } from "@http/context.ts";
import { apiResponse } from "@http/response.ts";
import {
  listAdminCommunityMembers,
  listAdminCommunityMembersForExport,
} from "@services/community/community-members.service.ts";
import type { AdminCommunityMemberListQuery } from "@shared/dto/community.dto.ts";

function parsePositiveInt(value: string | null, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function parseQuery(
  url: string | undefined,
): AdminCommunityMemberListQuery & { exportAll?: boolean } {
  const params = url ? new URL(url).searchParams : new URLSearchParams();

  const sortDirection = params.get("sortDirection");
  const search = params.get("search")?.trim();
  const communityId = params.get("communityId")?.trim();

  return {
    page: parsePositiveInt(params.get("page"), 1),
    pageSize: parsePositiveInt(params.get("pageSize"), 20),
    sortColumn: params.get("sortColumn") ?? "joined_at",
    sortDirection: sortDirection === "desc" ? "desc" : "asc",
    search: search || undefined,
    communityId: communityId || undefined,
    exportAll: params.get("export") === "true",
  };
}

/**
 * HTTP adapter for paginated admin community member listing.
 */
export async function handle(ctx: HandlerContext): Promise<Response> {
  if (ctx.req.method !== "GET") {
    return apiResponse.error(405, "validation_error", "Method not allowed.");
  }
  if (!ctx.user) return apiResponse.unauthorized();

  const query = parseQuery(ctx.req.url);

  if (query.exportAll) {
    const items = await listAdminCommunityMembersForExport({
      sortColumn: query.sortColumn,
      sortDirection: query.sortDirection,
      search: query.search,
      communityId: query.communityId,
    });
    return apiResponse.ok({
      items,
      total: items.length,
      page: 1,
      pageSize: items.length,
    });
  }

  const result = await listAdminCommunityMembers(query);
  return apiResponse.ok(result);
}
