import type { SupabaseClient } from "@supabase/supabase-js";

import {
  getProfileByOwnerId,
  isDisplayNameTaken,
  updateProfileByOwnerId,
  type ProfileRow,
} from "@models/profiles.ts";
import { createServiceClient } from "@services/db.ts";
import { publishEvent } from "@services/events/publisher.ts";
import type {
  ProfileResponse,
  UpdateProfileBody,
} from "@shared/dto/profile.dto.ts";
import {
  isDisplayNameEmpty,
  normalizeDisplayName,
  PROFILE_CONFLICT_FIELDS,
  PROFILE_CONFLICT_REASONS,
} from "@shared/profile/validation.ts";
import { isValidAvatarUrlForUser } from "@shared/storage/avatar.ts";

export class ProfileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProfileValidationError";
  }
}

export class ProfileConflictError extends Error {
  readonly reason: string;
  readonly field: string;

  constructor(reason: string, field: string) {
    super("Profile conflict.");
    this.name = "ProfileConflictError";
    this.reason = reason;
    this.field = field;
  }
}

const PATCH_KEY_TO_FIELD: Record<string, string> = {
  display_name: "displayName",
  bio: "bio",
  avatar_url: "avatarUrl",
};

/**
 * Profile use cases. Owns validation and mapping between DB rows and wire DTOs.
 * The caller's RLS-bound client is passed in so row security applies.
 */
function toResponse(row: ProfileRow): ProfileResponse {
  return {
    id: row.id,
    ownerId: row.owner_id,
    displayName: row.display_name,
    avatarUrl: row.avatar_url,
    bio: row.bio,
    updatedAt: row.updated_at,
  };
}

export async function getProfile(
  client: SupabaseClient,
  userId: string,
): Promise<ProfileResponse | null> {
  const row = await getProfileByOwnerId(client, userId);
  return row ? toResponse(row) : null;
}

export async function updateProfile(
  client: SupabaseClient,
  userId: string,
  body: UpdateProfileBody,
): Promise<ProfileResponse> {
  const patch: {
    display_name?: string | null;
    bio?: string;
    avatar_url?: string;
  } = {};

  if (body.displayName !== undefined) {
    const normalized = normalizeDisplayName(body.displayName);
    if (isDisplayNameEmpty(normalized)) {
      patch.display_name = null;
    } else {
      const serviceClient = createServiceClient();
      if (await isDisplayNameTaken(serviceClient, normalized, userId)) {
        throw new ProfileConflictError(
          PROFILE_CONFLICT_REASONS.displayNameTaken,
          PROFILE_CONFLICT_FIELDS.displayName,
        );
      }
      patch.display_name = normalized;
    }
  }

  if (body.bio !== undefined) patch.bio = body.bio;
  if (body.avatarUrl !== undefined) {
    const supabaseUrl =
      Deno.env.get("SUPABASE_URL") ??
      Deno.env.get("NEXT_PUBLIC_SUPABASE_URL") ??
      "";
    if (
      !supabaseUrl ||
      !isValidAvatarUrlForUser(body.avatarUrl, supabaseUrl, userId)
    ) {
      throw new ProfileValidationError(
        "Please upload your photo using the profile uploader.",
      );
    }
    patch.avatar_url = body.avatarUrl;
  }

  let row: ProfileRow;
  try {
    row = await updateProfileByOwnerId(client, userId, patch);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("profiles_display_name_unique_idx")
    ) {
      throw new ProfileConflictError(
        PROFILE_CONFLICT_REASONS.displayNameTaken,
        PROFILE_CONFLICT_FIELDS.displayName,
      );
    }
    throw error;
  }

  const response = toResponse(row);

  const changedFields = Object.keys(patch).map(
    (key) => PATCH_KEY_TO_FIELD[key] ?? key,
  );

  await publishEvent({
    name: "profile/updated",
    data: {
      profileId: response.id,
      ownerId: response.ownerId,
      displayName: response.displayName,
      changedFields,
    },
  });

  return response;
}
