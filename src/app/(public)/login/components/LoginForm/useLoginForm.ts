"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useAppRouter } from "@/hooks/use-app-router";
import { loginSchema, type LoginInput } from "@/lib/auth/schemas";
import { buildAuthHref } from "@/lib/auth/next-path";
import { sendMagicLink, signInWithPassword } from "@/lib/auth/client";
import { showUserError } from "@/lib/toast/user-message";

import {
  TOAST_ERROR,
  TOAST_MAGIC_ERROR,
  TOAST_MAGIC_SENT,
  TOAST_WELCOME,
} from "./constants";
import type { UseLoginFormOptions } from "./types";

/**
 * Colocated UI orchestration for the login form: form state, submission,
 * toasts, and navigation. Auth itself runs through the centralized auth client.
 */
export function useLoginForm({ nextPath = null }: UseLoginFormOptions = {}) {
  const router = useAppRouter();
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const destination = nextPath ?? "/dashboard";

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginInput) {
    try {
      await signInWithPassword(values.email, values.password);
      toast.success(TOAST_WELCOME);
      router.push(destination);
      router.refresh();
    } catch (error) {
      showUserError(error, TOAST_ERROR);
    }
  }

  async function onMagicLink() {
    const email = form.getValues("email");
    const result = await form.trigger("email");
    if (!result) return;

    try {
      await sendMagicLink(email, destination);
      setMagicLinkSent(true);
      toast.success(TOAST_MAGIC_SENT);
    } catch (error) {
      showUserError(error, TOAST_MAGIC_ERROR);
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    onMagicLink,
    magicLinkSent,
    signupHref: buildAuthHref("/signup", nextPath),
  };
}
