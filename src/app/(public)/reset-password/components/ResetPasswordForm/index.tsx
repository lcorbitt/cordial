"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldError } from "@/components/shared/field-error";
import { PasswordInput } from "@/components/shared/password-input";
import { useAppRouter } from "@/hooks/use-app-router";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/auth/schemas";
import { updatePassword } from "@/lib/auth/client";

/**
 * Sets a new password. The user arrives here from the reset email link, which
 * has already established a recovery session via the auth callback.
 */
export function ResetPasswordForm() {
  const router = useAppRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "" },
  });

  async function onSubmit(values: ResetPasswordInput) {
    try {
      await updatePassword(values.password);
      toast.success("Your password has been updated.");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error(
        "We could not update your password. Please request a new link.",
      );
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Choose a new password</CardTitle>
        <CardDescription>Pick something you will remember.</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">New password</Label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              {...register("password")}
              aria-invalid={Boolean(errors.password)}
            />
            <FieldError message={errors.password?.message} />
          </div>
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Update password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
