import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createAvatarUploadUrl } from "@/frontend/services/storage.service";
import { updateProfile } from "@/frontend/services/profile.service";
import {
  invalidateProfileQueries,
  setProfileQueryData,
} from "@/hooks/queries/useProfile";
import { createClient } from "@/lib/supabase/client";
import {
  AVATAR_MAX_BYTES,
  isAllowedAvatarContentType,
} from "@shared/storage/avatar";

export class AvatarUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AvatarUploadError";
  }
}

/**
 * Avatar upload: sign URL via Edge Function, upload to Storage, save profile URL.
 */
export function useAvatarUploadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      if (file.size > AVATAR_MAX_BYTES) {
        throw new AvatarUploadError("Please choose an image under 2 MB.");
      }
      if (!isAllowedAvatarContentType(file.type)) {
        throw new AvatarUploadError(
          "Please choose a JPEG, PNG, or WebP image.",
        );
      }

      const signed = await createAvatarUploadUrl({
        contentType: file.type,
      });

      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from(signed.bucket)
        .uploadToSignedUrl(signed.path, signed.token, file, { upsert: true });

      if (uploadError) {
        throw new AvatarUploadError(
          "We could not upload your photo. Please try again.",
        );
      }

      return updateProfile({ avatarUrl: signed.publicUrl });
    },
    onSuccess: (profile) => {
      setProfileQueryData(queryClient, profile);
      void invalidateProfileQueries(queryClient);
    },
  });
}
