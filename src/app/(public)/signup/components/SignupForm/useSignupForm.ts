"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { signupSchema, type SignupInput } from "@/lib/auth/schemas";
import { buildAuthHref } from "@/lib/auth/next-path";
import { signUpWithPassword } from "@/lib/auth/client";
import { showUserError } from "@/lib/toast/user-message";

import { TOAST_ERROR, TOAST_SUCCESS } from "./constants";
import type { UseSignupFormOptions } from "./types";

/**
 * Colocated UI orchestration for signup. On success we show a "check your
 * email" state because email verification is required before first login.
 */
export function useSignupForm({ nextPath = null }: UseSignupFormOptions = {}) {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const destination = nextPath ?? "/dashboard";

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: SignupInput) {
    try {
      await signUpWithPassword(values.email, values.password, destination);
      setSubmittedEmail(values.email);
      toast.success(TOAST_SUCCESS);
    } catch (error) {
      showUserError(error, TOAST_ERROR);
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    submittedEmail,
    loginHref: buildAuthHref("/login", nextPath),
  };
}
