import { describe, expect, it } from "vitest";

import { resolveAvatarDisplayUrl } from "@/lib/profile/avatar-url";
import {
  buildAvatarPublicUrl,
  buildAvatarStoragePath,
  isAllowedAvatarContentType,
  isValidAvatarUrlForUser,
  normalizeAvatarStorageUrl,
  resolveBrowserSupabaseUrl,
  resolveSupabaseUrlCandidates,
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

  it("validates avatar URLs against multiple Supabase base URLs", () => {
    const kongUrl = `http://kong:8000/storage/v1/object/public/avatars/${userId}/avatar.png`;
    expect(
      isValidAvatarUrlForUser(
        kongUrl,
        [supabaseUrl, "http://kong:8000"],
        userId,
      ),
    ).toBe(true);
  });

  it("prefers the browser Supabase URL over the internal Docker URL", () => {
    const env = {
      NEXT_PUBLIC_SUPABASE_URL: "http://127.0.0.1:54521",
      SUPABASE_URL: "http://kong:8000",
    };
    expect(
      resolveBrowserSupabaseUrl((key) => env[key as keyof typeof env]),
    ).toBe("http://127.0.0.1:54521");
    expect(
      resolveSupabaseUrlCandidates((key) => env[key as keyof typeof env]),
    ).toEqual(["http://127.0.0.1:54521", "http://kong:8000"]);
  });

  it("rewrites internal storage hosts to the public Supabase URL", () => {
    const internal = `http://kong:8000/storage/v1/object/public/avatars/${userId}/avatar.png`;
    expect(normalizeAvatarStorageUrl(internal, supabaseUrl)).toBe(
      `${supabaseUrl}/storage/v1/object/public/avatars/${userId}/avatar.png`,
    );
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

  it("rewrites internal storage hosts before cache busting", () => {
    const internal =
      "http://kong:8000/storage/v1/object/public/avatars/u1/avatar.png";
    const publicBase = "http://127.0.0.1:54521";
    expect(resolveAvatarDisplayUrl(internal, "2026-01-03T12:00:00.000Z")).toBe(
      `${publicBase}/storage/v1/object/public/avatars/u1/avatar.png?v=2026-01-03T12%3A00%3A00.000Z`,
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
        communityName: "Cordial HQ",
      }),
    ).toEqual({
      title: "New Community Member",
      body: "Alex joined Cordial HQ.",
    });
  });

  it("falls back when member name is blank", () => {
    expect(
      buildCommunityMemberJoinedNotification({
        memberName: "  ",
        communityName: "Cordial HQ",
      }).body,
    ).toBe("Someone joined Cordial HQ.");
  });
});
