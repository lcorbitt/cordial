"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorState } from "@/components/shared/error-state";

import {
  BACK_TO_COMMUNITIES_LABEL,
  BODY_PREFIX,
  BODY_SUFFIX,
  BODY_TEXT_CLASS,
  CARD_DESCRIPTION,
  CARD_TITLE,
  ERROR_DESCRIPTION,
  ERROR_TITLE,
  LOADING_BODY,
  LOADING_TEXT_CLASS,
  NOT_FOUND_DESCRIPTION,
  NOT_FOUND_TITLE,
  PAGE_CLASS,
  SLUG_CLASS,
  TITLE_CLASS,
} from "./constants";
import { useCommunityHome } from "./useCommunityHome";

export function CommunityHome() {
  const { communityQuery, slug, isNotFound } = useCommunityHome();

  return (
    <div className={PAGE_CLASS}>
      {communityQuery.isPending ? (
        <p className={LOADING_TEXT_CLASS}>{LOADING_BODY}</p>
      ) : communityQuery.isError ? (
        <ErrorState
          title={isNotFound ? NOT_FOUND_TITLE : ERROR_TITLE}
          description={isNotFound ? NOT_FOUND_DESCRIPTION : ERROR_DESCRIPTION}
          onRetry={() => communityQuery.refetch()}
          homeHref="/communities"
          homeLabel={BACK_TO_COMMUNITIES_LABEL}
        />
      ) : (
        <>
          <div>
            <h1 className={TITLE_CLASS}>{communityQuery.data?.name}</h1>
            <p className={SLUG_CLASS}>/{slug}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{CARD_TITLE}</CardTitle>
              <CardDescription>{CARD_DESCRIPTION}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className={BODY_TEXT_CLASS}>
                {BODY_PREFIX} <strong>{communityQuery.data?.name}</strong>.{" "}
                {BODY_SUFFIX}
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
