import type { SupabaseClient } from "@supabase/supabase-js";

import {
  AVATARS_BUCKET,
  buildAvatarPublicUrl,
  buildAvatarStoragePath,
  isAllowedAvatarContentType,
  type AvatarContentType,
} from "@shared/storage/avatar.ts";
import type { CreateAvatarUploadUrlResponse } from "@shared/dto/storage.dto.ts";

export class StorageValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StorageValidationError";
  }
}

/**
 * Storage use cases. Signed upload URLs are issued via the service client after
 * auth checks in the handler.
 */
export async function createAvatarUploadUrl(
  serviceClient: SupabaseClient,
  ownerId: string,
  contentType: string,
  supabaseUrl: string,
): Promise<CreateAvatarUploadUrlResponse> {
  if (!isAllowedAvatarContentType(contentType)) {
    throw new StorageValidationError(
      "Please choose a JPEG, PNG, or WebP image.",
    );
  }

  const typedContentType = contentType as AvatarContentType;
  const path = buildAvatarStoragePath(ownerId, typedContentType);

  const { data, error } = await serviceClient.storage
    .from(AVATARS_BUCKET)
    .createSignedUploadUrl(path, { upsert: true });

  if (error) {
    throw new Error(`Failed to sign upload URL: ${error.message}`);
  }

  return {
    bucket: AVATARS_BUCKET,
    path,
    token: data.token,
    publicUrl: buildAvatarPublicUrl(supabaseUrl, ownerId, typedContentType),
  };
}
