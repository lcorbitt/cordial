"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldError } from "@/components/shared/field-error";
import { OAuthButtons } from "@/components/shared/oauth-buttons";
import { PasswordInput } from "@/components/shared/password-input";

import {
  CARD_CLASS,
  CONTENT_CLASS,
  DESCRIPTION,
  DIVIDER,
  DIVIDER_CLASS,
  DIVIDER_LINE_CLASS,
  EMAIL_LABEL,
  FIELD_CLASS,
  FOOTER_CLASS,
  FORGOT_PASSWORD_LINK_CLASS,
  FORGOT_PASSWORD_LINK_LABEL,
  FORM_CLASS,
  LINK_CLASS,
  MAGIC_LINK_LABEL,
  NEW_HERE_BODY,
  PASSWORD_LABEL,
  PASSWORD_LABEL_ROW_CLASS,
  SIGNUP_LINK_LABEL,
  SUBMIT_LABEL,
  SUBMITTING_LABEL,
  TITLE,
} from "./constants";
import type { LoginFormProps } from "./types";
import { useLoginForm } from "./useLoginForm";

export function LoginForm({ nextPath = null }: LoginFormProps) {
  const { form, onSubmit, onMagicLink, signupHref } = useLoginForm({
    nextPath,
  });
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
      <CardContent className={CONTENT_CLASS}>
        <form onSubmit={onSubmit} className={FORM_CLASS} noValidate>
          <div className={FIELD_CLASS}>
            <Label htmlFor="email">{EMAIL_LABEL}</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              aria-invalid={Boolean(errors.email)}
            />
            <FieldError message={errors.email?.message} />
          </div>

          <div className={FIELD_CLASS}>
            <div className={PASSWORD_LABEL_ROW_CLASS}>
              <Label htmlFor="password">{PASSWORD_LABEL}</Label>
              <Link
                href="/forgot-password"
                className={FORGOT_PASSWORD_LINK_CLASS}
              >
                {FORGOT_PASSWORD_LINK_LABEL}
              </Link>
            </div>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              {...register("password")}
              aria-invalid={Boolean(errors.password)}
            />
            <FieldError message={errors.password?.message} />
          </div>

          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? SUBMITTING_LABEL : SUBMIT_LABEL}
          </Button>
        </form>

        <Button type="button" variant="ghost" onClick={onMagicLink}>
          {MAGIC_LINK_LABEL}
        </Button>

        <div className={DIVIDER_CLASS}>
          <span className={DIVIDER_LINE_CLASS} />
          {DIVIDER}
          <span className={DIVIDER_LINE_CLASS} />
        </div>

        <OAuthButtons />

        <p className={FOOTER_CLASS}>
          {NEW_HERE_BODY}{" "}
          <Link href={signupHref} className={LINK_CLASS}>
            {SIGNUP_LINK_LABEL}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
