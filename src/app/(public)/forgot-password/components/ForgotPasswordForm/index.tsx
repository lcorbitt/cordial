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

import {
  BACK_TO_LOGIN_LABEL,
  CARD_CLASS,
  DESCRIPTION,
  EMAIL_LABEL,
  FIELD_CLASS,
  FORM_CLASS,
  SUBMIT_LABEL,
  SUBMITTING_LABEL,
  SUCCESS_BUTTON_CLASS,
  SUCCESS_DESCRIPTION,
  SUCCESS_TITLE,
  TITLE,
} from "./constants";
import { useForgotPasswordForm } from "./useForgotPasswordForm";

export function ForgotPasswordForm() {
  const { form, sent, onSubmit } = useForgotPasswordForm();
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  if (sent) {
    return (
      <Card className={CARD_CLASS}>
        <CardHeader>
          <CardTitle>{SUCCESS_TITLE}</CardTitle>
          <CardDescription>{SUCCESS_DESCRIPTION}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            asChild
            variant="outline"
            size="lg"
            className={SUCCESS_BUTTON_CLASS}
          >
            <Link href="/login">{BACK_TO_LOGIN_LABEL}</Link>
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
      <CardContent>
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
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? SUBMITTING_LABEL : SUBMIT_LABEL}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
