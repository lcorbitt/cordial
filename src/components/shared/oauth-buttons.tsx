"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { signInWithOAuth, type OAuthProvider } from "@/lib/auth/client";
import { showUserError } from "@/lib/toast/user-message";

import { ROOT_CLASS } from "./oauth-buttons/constants";

const OAUTH_ERROR_FALLBACK = "We could not start sign-in. Please try again.";

/**
 * Continue-with-Google / Continue-with-Microsoft buttons. Shared across login
 * and signup. Labels are explicit and recognizable for our audience.
 */
export function OAuthButtons() {
  const [pending, setPending] = useState<OAuthProvider | null>(null);

  async function handleClick(provider: OAuthProvider) {
    setPending(provider);
    try {
      await signInWithOAuth(provider);
      // On success the browser is redirected, so no further UI is needed.
    } catch (error) {
      showUserError(error, OAUTH_ERROR_FALLBACK);
      setPending(null);
    }
  }

  return (
    <div className={ROOT_CLASS}>
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => handleClick("google")}
        disabled={pending !== null}
      >
        {pending === "google" ? "Connecting…" : "Continue with Google"}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => handleClick("azure")}
        disabled={pending !== null}
      >
        {pending === "azure" ? "Connecting…" : "Continue with Microsoft"}
      </Button>
    </div>
  );
}
