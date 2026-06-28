import { describe, expect, it } from "vitest";

import { resolveAvatarDisplayUrl } from "@/lib/profile/avatar-url";
import {
  buildAvatarPublicUrl,
  buildAvatarStoragePath,
  isAllowedAvatarContentType,
  isValidAvatarUrlForUser,
} from "@shared/storage/avatar";
import { buildCommunityMemberJoinedNotification } from "@/lib/jobs/notifications/templates";

describe("shared/storage/avatar", () => {
  const supabaseUrl = "http://127.0.0.1:54521";
  const userId = "11111111-1111-1111-1111-111111111111";

  it("builds a stable avatar storage path", () => {
    expect(buildAvatarStoragePath(userId, "image/png")).toBe(
      `${userId}/avatar.png`,
    );
  });

  it("builds a public avatar URL", () => {
    expect(buildAvatarPublicUrl(supabaseUrl, userId, "image/jpeg")).toBe(
      `${supabaseUrl}/storage/v1/object/public/avatars/${userId}/avatar.jpg`,
    );
  });

  it("accepts allowed avatar content types", () => {
    expect(isAllowedAvatarContentType("image/webp")).toBe(true);
    expect(isAllowedAvatarContentType("image/gif")).toBe(false);
  });

  it("validates avatar URLs for the owning user", () => {
    const valid = `${supabaseUrl}/storage/v1/object/public/avatars/${userId}/avatar.webp`;
    expect(isValidAvatarUrlForUser(valid, supabaseUrl, userId)).toBe(true);
    expect(
      isValidAvatarUrlForUser(
        `${supabaseUrl}/storage/v1/object/public/avatars/${userId}/avatar.gif`,
        supabaseUrl,
        userId,
      ),
    ).toBe(false);
    expect(
      isValidAvatarUrlForUser(
        "https://example.com/avatar.png",
        supabaseUrl,
        userId,
      ),
    ).toBe(false);
  });
});

describe("resolveAvatarDisplayUrl", () => {
  it("appends a cache-busting version from updatedAt", () => {
    const url =
      "http://127.0.0.1:54521/storage/v1/object/public/avatars/u1/avatar.jpg";
    expect(resolveAvatarDisplayUrl(url, "2026-01-03T12:00:00.000Z")).toBe(
      `${url}?v=2026-01-03T12%3A00%3A00.000Z`,
    );
  });

  it("returns undefined when avatarUrl is missing", () => {
    expect(
      resolveAvatarDisplayUrl(null, "2026-01-03T12:00:00.000Z"),
    ).toBeUndefined();
  });
});

describe("notification job templates", () => {
  it("builds community member joined copy", () => {
    expect(
      buildCommunityMemberJoinedNotification({
        memberName: "Alex",
        communityName: "GoverNerds HQ",
      }),
    ).toEqual({
      title: "New Community Member",
      body: "Alex joined GoverNerds HQ.",
    });
  });

  it("falls back when member name is blank", () => {
    expect(
      buildCommunityMemberJoinedNotification({
        memberName: "  ",
        communityName: "GoverNerds HQ",
      }).body,
    ).toBe("Someone joined GoverNerds HQ.");
  });
});
