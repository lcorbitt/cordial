"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useAppRouter } from "@/hooks/use-app-router";
import { loginSchema, type LoginInput } from "@/lib/auth/schemas";
import { sendMagicLink, signInWithPassword } from "@/lib/auth/client";

/**
 * Colocated UI orchestration for the login form: form state, submission,
 * toasts, and navigation. Auth itself runs through the centralized auth client.
 */
export function useLoginForm() {
  const router = useAppRouter();
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: LoginInput) {
    try {
      await signInWithPassword(values.email, values.password);
      toast.success("Welcome back!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("That email or password did not match. Please try again.");
    }
  }

  async function onMagicLink() {
    const email = form.getValues("email");
    const result = await form.trigger("email");
    if (!result) return;

    try {
      await sendMagicLink(email);
      setMagicLinkSent(true);
      toast.success("Check your email for a sign-in link.");
    } catch {
      toast.error("We could not send the link. Please try again.");
    }
  }

  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    onMagicLink,
    magicLinkSent,
  };
}
