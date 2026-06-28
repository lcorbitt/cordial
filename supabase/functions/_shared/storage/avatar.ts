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

export function buildAvatarPublicUrl(
  supabaseUrl: string,
  ownerId: string,
  contentType: AvatarContentType,
): string {
  const path = buildAvatarStoragePath(ownerId, contentType);
  const base = supabaseUrl.replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${AVATARS_BUCKET}/${path}`;
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
  supabaseUrl: string,
  userId: string,
): boolean {
  const base = supabaseUrl.replace(/\/$/, "");
  const prefix = `${base}/storage/v1/object/public/${AVATARS_BUCKET}/${userId}/avatar.`;
  if (!avatarUrl.startsWith(prefix)) return false;
  const suffix = avatarUrl.slice(prefix.length);
  return suffix === "jpg" || suffix === "png" || suffix === "webp";
}
