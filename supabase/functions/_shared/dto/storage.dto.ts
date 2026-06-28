/**
 * Wire contracts for storage endpoints.
 */
export interface CreateAvatarUploadUrlBody {
  contentType: "image/jpeg" | "image/png" | "image/webp";
}

export interface CreateAvatarUploadUrlResponse {
  bucket: string;
  path: string;
  token: string;
  publicUrl: string;
}
