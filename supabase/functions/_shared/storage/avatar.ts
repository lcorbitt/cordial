/**
 * Cross-runtime avatar storage policy. Imported by Edge services and the
 * Next.js app via @shared/storage/avatar.
 */

export const AVATARS_BUCKET = "avatars" as const;

export const AVATAR_MAX_BYTES = 2 * 1024 * 1024;

export const AVATAR_ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export type AvatarContentType = (typeof AVATAR_ALLOWED_CONTENT_TYPES)[number];

const CONTENT_TYPE_TO_EXT: Record<AvatarContentType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function getAvatarExtension(contentType: AvatarContentType): string {
  return CONTENT_TYPE_TO_EXT[contentType];
}

export function buildAvatarStoragePath(
  ownerId: string,
  contentType: AvatarContentType,
): string {
  return `${ownerId}/avatar.${getAvatarExtension(contentType)}`;
}

export type SupabaseUrlReader = (key: string) => string | undefined;

/** Browser-reachable Supabase base URL (storage public URLs, validation). */
export function resolveBrowserSupabaseUrl(read: SupabaseUrlReader): string {
  return read("NEXT_PUBLIC_SUPABASE_URL") ?? read("SUPABASE_URL") ?? "";
}

/** Distinct Supabase base URLs (public + internal) for avatar URL validation. */
export function resolveSupabaseUrlCandidates(
  read: SupabaseUrlReader,
): string[] {
  const urls = [read("NEXT_PUBLIC_SUPABASE_URL"), read("SUPABASE_URL")].filter(
    (url): url is string => Boolean(url),
  );
  return [...new Set(urls.map((url) => url.replace(/\/$/, "")))];
}

export function buildAvatarPublicUrl(
  supabaseUrl: string,
  ownerId: string,
  contentType: AvatarContentType,
): string {
  const path = buildAvatarStoragePath(ownerId, contentType);
  const base = supabaseUrl.replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${AVATARS_BUCKET}/${path}`;
}

const AVATAR_STORAGE_PUBLIC_PATH_PREFIX = `/storage/v1/object/public/${AVATARS_BUCKET}/`;

/** Rewrites internal storage hosts (e.g. local `kong`) to a browser URL. */
export function normalizeAvatarStorageUrl(
  avatarUrl: string,
  publicSupabaseUrl: string,
): string {
  try {
    const parsed = new URL(avatarUrl);
    if (!parsed.pathname.startsWith(AVATAR_STORAGE_PUBLIC_PATH_PREFIX)) {
      return avatarUrl;
    }
    const base = publicSupabaseUrl.replace(/\/$/, "");
    return `${base}${parsed.pathname}`;
  } catch {
    return avatarUrl;
  }
}

export function isAllowedAvatarContentType(
  contentType: string,
): contentType is AvatarContentType {
  return (AVATAR_ALLOWED_CONTENT_TYPES as readonly string[]).includes(
    contentType,
  );
}

export function isValidAvatarUrlForUser(
  avatarUrl: string,
  supabaseUrl: string | string[],
  userId: string,
): boolean {
  const bases = (Array.isArray(supabaseUrl) ? supabaseUrl : [supabaseUrl])
    .map((url) => url.replace(/\/$/, ""))
    .filter(Boolean);

  for (const base of bases) {
    const prefix = `${base}/storage/v1/object/public/${AVATARS_BUCKET}/${userId}/avatar.`;
    if (!avatarUrl.startsWith(prefix)) continue;
    const suffix = avatarUrl.slice(prefix.length);
    if (suffix === "jpg" || suffix === "png" || suffix === "webp") {
      return true;
    }
  }

  return false;
}
