const INVITE_TTL_DAYS = 7;

/**
 * Generates an opaque invite token and its SHA-256 hash for storage.
 */
export async function generateInviteToken(): Promise<{
  token: string;
  tokenHash: string;
}> {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const token = base64UrlEncode(bytes);
  const tokenHash = await sha256Hex(token);
  return { token, tokenHash };
}

export function inviteExpiresAt(): string {
  const expires = new Date();
  expires.setDate(expires.getDate() + INVITE_TTL_DAYS);
  return expires.toISOString();
}

export function hashInviteToken(token: string): Promise<string> {
  return sha256Hex(token);
}

function base64UrlEncode(bytes: Uint8Array): string {
  const binary = String.fromCharCode(...bytes);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export { INVITE_TTL_DAYS };
