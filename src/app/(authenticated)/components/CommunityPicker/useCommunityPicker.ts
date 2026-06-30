"use client";

import { usePathname } from "next/navigation";

import {
  useAdminCommunitiesQuery,
  useCommunitiesQuery,
  useCommunityQuery,
} from "@/hooks/queries/useCommunity";
import { useAppRouter } from "@/hooks/use-app-router";

import { LOADING_LABEL } from "./constants";
import { getCommunitySlugFromPath, resolveActiveCommunity } from "./utils";

interface UseCommunityPickerOptions {
  isSuperAdmin: boolean;
}

export function useCommunityPicker({
  isSuperAdmin,
}: UseCommunityPickerOptions) {
  const router = useAppRouter();
  const pathname = usePathname();
  const activeSlug = getCommunitySlugFromPath(pathname);

  const memberCommunitiesQuery = useCommunitiesQuery({
    enabled: !isSuperAdmin,
  });
  const adminCommunitiesQuery = useAdminCommunitiesQuery(
    {
      page: 1,
      pageSize: 100,
      sortColumn: "name",
      sortDirection: "asc",
      search: "",
    },
    { enabled: isSuperAdmin },
  );
  const communityQuery = useCommunityQuery(activeSlug ?? "");

  const communitiesQuery = isSuperAdmin
    ? adminCommunitiesQuery
    : memberCommunitiesQuery;

  const communities = isSuperAdmin
    ? adminCommunitiesQuery.data?.items
    : memberCommunitiesQuery.data?.communities;
  const { name: displayName, slug: selectedSlug } = resolveActiveCommunity({
    pathname,
    communities,
    activeCommunityName: communityQuery.data?.name,
    activeSlug,
  });

  const label =
    communitiesQuery.isPending && !communitiesQuery.data
      ? LOADING_LABEL
      : displayName;

  function selectCommunity(slug: string) {
    router.push(`/communities/${slug}`);
  }

  return {
    communities: communities ?? [],
    displayName: label,
    selectedSlug,
    isPending: communitiesQuery.isPending && !communitiesQuery.data,
    isEmpty: !communitiesQuery.isPending && communities?.length === 0,
    selectCommunity,
  };
}
