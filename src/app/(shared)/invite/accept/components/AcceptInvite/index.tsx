"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorState } from "@/components/shared/error-state";

import {
  ACCEPTING_BODY,
  AUTH_ACTIONS_CLASS,
  AUTH_CARD_CLASS,
  AUTH_DESCRIPTION,
  AUTH_PAGE_CLASS,
  AUTH_TITLE,
  CHECKING_BODY,
  ERROR_FALLBACK_BODY,
  ERROR_PAGE_CLASS,
  ERROR_TITLE,
  GO_HOME_LABEL,
  LOADING_PAGE_CLASS,
  LOADING_TEXT_CLASS,
  LOGIN_LABEL,
  SIGNUP_LABEL,
} from "./constants";
import { useAcceptInvite } from "./useAcceptInvite";

export function AcceptInvite() {
  const { state, errorMessage, loginHref, signupHref } = useAcceptInvite();

  if (state === "checking" || state === "accepting") {
    return (
      <div className={LOADING_PAGE_CLASS}>
        <p className={LOADING_TEXT_CLASS}>
          {state === "checking" ? CHECKING_BODY : ACCEPTING_BODY}
        </p>
      </div>
    );
  }

  if (state === "needs_auth") {
    return (
      <div className={AUTH_PAGE_CLASS}>
        <Card className={AUTH_CARD_CLASS}>
          <CardHeader>
            <CardTitle>{AUTH_TITLE}</CardTitle>
            <CardDescription>{AUTH_DESCRIPTION}</CardDescription>
          </CardHeader>
          <CardContent className={AUTH_ACTIONS_CLASS}>
            <Button asChild size="lg">
              <Link href={loginHref}>{LOGIN_LABEL}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={signupHref}>{SIGNUP_LABEL}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={ERROR_PAGE_CLASS}>
      <ErrorState
        title={ERROR_TITLE}
        description={errorMessage ?? ERROR_FALLBACK_BODY}
        homeHref="/"
        homeLabel={GO_HOME_LABEL}
      />
    </div>
  );
}
