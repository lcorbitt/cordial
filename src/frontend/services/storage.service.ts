import { edgeFunctionFetch } from "@/lib/edge-function-fetch";
import { EDGE_FUNCTION_SLUGS } from "@/config/edge-function-slugs";
import type {
  CreateAvatarUploadUrlBody,
  CreateAvatarUploadUrlResponse,
} from "@shared/dto/storage.dto";

/**
 * Browser-side HTTP adapters for storage uploads.
 */
export function createAvatarUploadUrl(
  body: CreateAvatarUploadUrlBody,
): Promise<CreateAvatarUploadUrlResponse> {
  return edgeFunctionFetch<
    CreateAvatarUploadUrlResponse,
    CreateAvatarUploadUrlBody
  >(EDGE_FUNCTION_SLUGS.createAvatarUploadUrl, { method: "POST", body });
}
