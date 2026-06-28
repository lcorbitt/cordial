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
  if (!updatedAt) return avatarUrl;

  const separator = avatarUrl.includes("?") ? "&" : "?";
  return `${avatarUrl}${separator}v=${encodeURIComponent(updatedAt)}`;
}
