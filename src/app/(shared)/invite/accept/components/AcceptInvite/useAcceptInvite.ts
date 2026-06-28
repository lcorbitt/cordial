"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useAppRouter } from "@/hooks/use-app-router";
import { useAcceptInviteMutation } from "@/hooks/mutations/useCommunity";
import { buildAuthHref, sanitizeNextPath } from "@/lib/auth/next-path";
import { createClient } from "@/lib/supabase/client";
import { EdgeFunctionError } from "@/lib/edge-function-fetch";
import { runMutationWithToast } from "@/lib/toast/mutation-toast";

import {
  INVALID_LINK_BODY,
  TOAST_ERROR,
  TOAST_LOADING,
  TOAST_SUCCESS,
} from "./constants";
import type { AcceptInviteState } from "./types";

/**
 * Colocated orchestration for accepting a community invitation.
 */
export function useAcceptInvite() {
  const searchParams = useSearchParams();
  const router = useAppRouter();
  const token = searchParams.get("token") ?? "";
  const { mutateAsync: acceptInviteAsync } = useAcceptInviteMutation();
  const startedRef = useRef(false);
  const [state, setState] = useState<AcceptInviteState>(() =>
    token ? "checking" : "error",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(() =>
    token ? null : INVALID_LINK_BODY,
  );

  const returnPath = sanitizeNextPath(
    token ? `/invite/accept?token=${encodeURIComponent(token)}` : null,
  );
  const loginHref = buildAuthHref("/login", returnPath);
  const signupHref = buildAuthHref("/signup", returnPath);

  useEffect(() => {
    if (!token || startedRef.current) return;
    startedRef.current = true;

    let cancelled = false;

    async function run() {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (cancelled) return;

      if (!session) {
        setState("needs_auth");
        return;
      }

      setState("accepting");
      try {
        const result = await runMutationWithToast(
          acceptInviteAsync({ token }),
          {
            loading: TOAST_LOADING,
            success: TOAST_SUCCESS,
            errorFallback: TOAST_ERROR,
          },
        );
        router.push(`/communities/${result.communitySlug}`);
        router.refresh();
      } catch (error) {
        if (cancelled) return;
        setState("error");
        if (error instanceof EdgeFunctionError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage(TOAST_ERROR);
        }
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [token, acceptInviteAsync, router]);

  return {
    state,
    errorMessage,
    loginHref,
    signupHref,
  };
}
