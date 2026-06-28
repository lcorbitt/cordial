"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useAppRouter } from "@/hooks/use-app-router";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/auth/schemas";
import { updatePassword } from "@/lib/auth/client";
import { showUserError } from "@/lib/toast/user-message";

import { TOAST_ERROR, TOAST_SUCCESS } from "./constants";

/**
 * Colocated orchestration for the reset-password form.
 */
export function useResetPasswordForm() {
  const router = useAppRouter();

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "" },
  });

  async function onSubmit(values: ResetPasswordInput) {
    try {
      await updatePassword(values.password);
      toast.success(TOAST_SUCCESS);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      showUserError(error, TOAST_ERROR);
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
  };
}
