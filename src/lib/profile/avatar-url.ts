import { normalizeAvatarStorageUrl } from "@shared/storage/avatar";

/**
 * Builds a display URL for profile avatars. Storage paths are stable per user,
 * so we append the profile `updatedAt` timestamp to bust browser caches after
 * re-uploads.
 */
export function resolveAvatarDisplayUrl(
  avatarUrl: string | null | undefined,
  updatedAt: string | null | undefined,
): string | undefined {
  if (!avatarUrl) return undefined;

  const publicSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const normalized = publicSupabaseUrl
    ? normalizeAvatarStorageUrl(avatarUrl, publicSupabaseUrl)
    : avatarUrl;
  if (!updatedAt) return normalized;

  const separator = normalized.includes("?") ? "&" : "?";
  return `${normalized}${separator}v=${encodeURIComponent(updatedAt)}`;
}
