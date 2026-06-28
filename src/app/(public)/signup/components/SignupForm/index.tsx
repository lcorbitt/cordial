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
  BACK_TO_LOGIN_LABEL,
  CARD_CLASS,
  CONTENT_CLASS,
  DESCRIPTION,
  DIVIDER,
  DIVIDER_CLASS,
  DIVIDER_LINE_CLASS,
  EMAIL_LABEL,
  FIELD_CLASS,
  FOOTER_CLASS,
  FORM_CLASS,
  HAS_ACCOUNT_BODY,
  LINK_CLASS,
  LOGIN_LINK_LABEL,
  PASSWORD_HELPER,
  PASSWORD_HELPER_CLASS,
  PASSWORD_LABEL,
  SUBMIT_LABEL,
  SUBMITTING_LABEL,
  SUCCESS_BUTTON_CLASS,
  SUCCESS_DESCRIPTION,
  SUCCESS_TITLE,
  TITLE,
} from "./constants";
import type { SignupFormProps } from "./types";
import { useSignupForm } from "./useSignupForm";

export function SignupForm({ nextPath = null }: SignupFormProps) {
  const { form, onSubmit, submittedEmail, loginHref } = useSignupForm({
    nextPath,
  });
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  if (submittedEmail) {
    return (
      <Card className={CARD_CLASS}>
        <CardHeader>
          <CardTitle>{SUCCESS_TITLE}</CardTitle>
          <CardDescription>
            {SUCCESS_DESCRIPTION.replace("{email}", submittedEmail)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            asChild
            variant="outline"
            size="lg"
            className={SUCCESS_BUTTON_CLASS}
          >
            <Link href={loginHref}>{BACK_TO_LOGIN_LABEL}</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

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
            <Label htmlFor="password">{PASSWORD_LABEL}</Label>
            <PasswordInput
              id="password"
              autoComplete="new-password"
              {...register("password")}
              aria-invalid={Boolean(errors.password)}
            />
            <FieldError message={errors.password?.message} />
            <p className={PASSWORD_HELPER_CLASS}>{PASSWORD_HELPER}</p>
          </div>

          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? SUBMITTING_LABEL : SUBMIT_LABEL}
          </Button>
        </form>

        <div className={DIVIDER_CLASS}>
          <span className={DIVIDER_LINE_CLASS} />
          {DIVIDER}
          <span className={DIVIDER_LINE_CLASS} />
        </div>

        <OAuthButtons />

        <p className={FOOTER_CLASS}>
          {HAS_ACCOUNT_BODY}{" "}
          <Link href={loginHref} className={LINK_CLASS}>
            {LOGIN_LINK_LABEL}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
