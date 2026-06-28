"use client";

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

import {
  CARD_CLASS,
  DESCRIPTION,
  FIELD_CLASS,
  FORM_CLASS,
  PASSWORD_LABEL,
  SUBMIT_LABEL,
  SUBMITTING_LABEL,
  TITLE,
} from "./constants";
import { useResetPasswordForm } from "./useResetPasswordForm";

export function ResetPasswordForm() {
  const { form, onSubmit } = useResetPasswordForm();
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <Card className={CARD_CLASS}>
      <CardHeader>
        <CardTitle>{TITLE}</CardTitle>
        <CardDescription>{DESCRIPTION}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className={FORM_CLASS} noValidate>
          <div className={FIELD_CLASS}>
            <Label htmlFor="password">{PASSWORD_LABEL}</Label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              {...register("password")}
              aria-invalid={Boolean(errors.password)}
            />
            <FieldError message={errors.password?.message} />
          </div>
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? SUBMITTING_LABEL : SUBMIT_LABEL}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
