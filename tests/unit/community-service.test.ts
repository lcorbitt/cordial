import { describe, expect, it, vi } from "vitest";

import { getCommunityBySlug } from "../../supabase/functions/_models/communities.ts";
import { hasCommunityMembership } from "../../supabase/functions/_models/community_members.ts";
import { getCommunityBySlugForUser } from "../../supabase/functions/_services/community/community.service.ts";
import {
  toDetail,
  toSummary,
} from "../../supabase/functions/_services/community/mappers";

vi.mock("../../supabase/functions/_models/communities.ts", () => ({
  getCommunityBySlug: vi.fn(),
  getCommunityById: vi.fn(),
  insertCommunity: vi.fn(),
  listCommunities: vi.fn(),
  listCommunitiesForExport: vi.fn(),
  listCommunitiesPaginated: vi.fn(),
  normalizeCommunitySortColumn: vi.fn(),
  defaultSortDirectionForCommunityColumn: vi.fn(),
  slugExists: vi.fn(),
  slugExistsExcept: vi.fn(),
  updateCommunityRow: vi.fn(),
}));

vi.mock("../../supabase/functions/_models/community_members.ts", () => ({
  hasCommunityMembership: vi.fn(),
  insertCommunityMember: vi.fn(),
}));

vi.mock("../../supabase/functions/_models/community_invites.ts", () => ({
  findPendingByCommunityAndEmail: vi.fn(),
  findPendingByTokenHash: vi.fn(),
  getAuthUserIdByEmail: vi.fn(),
  insertInvite: vi.fn(),
  markAccepted: vi.fn(),
}));

vi.mock("../../supabase/functions/_models/profiles.ts", () => ({
  getProfileByOwnerId: vi.fn(),
}));

vi.mock("../../supabase/functions/_models/roles.ts", () => ({
  getRoleIdBySlug: vi.fn(),
}));

vi.mock("../../supabase/functions/_services/events/publisher.ts", () => ({
  publishEvent: vi.fn(),
}));

describe("community mappers", () => {
  it("maps a community row to a summary DTO", () => {
    expect(
      toSummary({
        id: "c1",
        name: "Cordial HQ",
        slug: "cordial-hq",
      }),
    ).toEqual({
      id: "c1",
      name: "Cordial HQ",
      slug: "cordial-hq",
    });
  });

  it("maps a community row to a detail DTO with settings", () => {
    expect(
      toDetail({
        id: "c1",
        name: "Cordial HQ",
        slug: "cordial-hq",
        settings: { theme: "default" },
      }),
    ).toEqual({
      id: "c1",
      name: "Cordial HQ",
      slug: "cordial-hq",
      settings: { theme: "default" },
    });
  });

  it("defaults missing settings to an empty object", () => {
    expect(
      toDetail({
        id: "c1",
        name: "Cordial HQ",
        slug: "cordial-hq",
        settings: undefined as unknown as Record<string, unknown>,
      }).settings,
    ).toEqual({});
  });
});

describe("getCommunityBySlugForUser", () => {
  it("returns null when the caller is not a member", async () => {
    vi.mocked(getCommunityBySlug).mockResolvedValue({
      id: "c1",
      name: "Cordial HQ",
      slug: "cordial-hq",
      settings: {},
    });
    vi.mocked(hasCommunityMembership).mockResolvedValue(false);

    await expect(
      getCommunityBySlugForUser({} as never, "user-a", "cordial-hq"),
    ).resolves.toBeNull();
  });

  it("returns community detail when the caller is a member", async () => {
    vi.mocked(getCommunityBySlug).mockResolvedValue({
      id: "c1",
      name: "Cordial HQ",
      slug: "cordial-hq",
      settings: { theme: "default" },
    });
    vi.mocked(hasCommunityMembership).mockResolvedValue(true);

    await expect(
      getCommunityBySlugForUser({} as never, "user-a", "cordial-hq"),
    ).resolves.toEqual({
      id: "c1",
      name: "Cordial HQ",
      slug: "cordial-hq",
      settings: { theme: "default" },
    });
  });
});
