import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ACTIONS_CLASS,
  CARD_CLASS,
  CONTENT_CLASS,
  DESCRIPTION_CLASS,
  GO_HOME,
  ROOT_CLASS,
  TITLE_CLASS,
  TRY_AGAIN,
} from "./error-state/constants";

interface ErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
  homeHref?: string;
  homeLabel?: string;
  children?: ReactNode;
}

/**
 * Branded error UI for boundaries and query failures. Never shows raw errors
 * or stack traces — plain language only.
 */
export function ErrorState({
  title,
  description,
  onRetry,
  homeHref = "/",
  homeLabel = GO_HOME,
  children,
}: ErrorStateProps) {
  return (
    <div className={ROOT_CLASS}>
      <Card className={CARD_CLASS}>
        <CardHeader>
          <CardTitle className={TITLE_CLASS}>{title}</CardTitle>
          <CardDescription className={DESCRIPTION_CLASS}>
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className={CONTENT_CLASS}>
          {children}
          <div className={ACTIONS_CLASS}>
            {onRetry ? (
              <Button type="button" onClick={onRetry}>
                {TRY_AGAIN}
              </Button>
            ) : null}
            <Button asChild variant="outline">
              <Link href={homeHref}>{homeLabel}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
