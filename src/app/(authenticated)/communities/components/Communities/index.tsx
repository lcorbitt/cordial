"use client";

import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorState } from "@/components/shared/error-state";
import { Reveal } from "@/components/shared/reveal";

import {
  BACK_TO_DASHBOARD_LABEL,
  COMMUNITY_CARD_CLASS,
  EMPTY_DESCRIPTION,
  EMPTY_TITLE,
  ERROR_DESCRIPTION,
  ERROR_TITLE,
  LIST_CLASS,
  LOADING_BODY,
  LOADING_TEXT_CLASS,
  OPEN_HOME_LABEL,
  OPEN_HOME_TEXT_CLASS,
  PAGE_CLASS,
  SUBTITLE,
  SUBTITLE_CLASS,
  TITLE,
  TITLE_CLASS,
} from "./constants";
import { useCommunities } from "./useCommunities";

export function Communities() {
  const { communitiesQuery } = useCommunities();

  return (
    <div className={PAGE_CLASS}>
      <div>
        <h1 className={TITLE_CLASS}>{TITLE}</h1>
        <p className={SUBTITLE_CLASS}>{SUBTITLE}</p>
      </div>

      {communitiesQuery.isPending ? (
        <p className={LOADING_TEXT_CLASS}>{LOADING_BODY}</p>
      ) : communitiesQuery.isError ? (
        <ErrorState
          title={ERROR_TITLE}
          description={ERROR_DESCRIPTION}
          onRetry={() => communitiesQuery.refetch()}
          homeHref="/dashboard"
          homeLabel={BACK_TO_DASHBOARD_LABEL}
        />
      ) : communitiesQuery.data?.communities.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>{EMPTY_TITLE}</CardTitle>
            <CardDescription>{EMPTY_DESCRIPTION}</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <ul className={LIST_CLASS}>
          {communitiesQuery.data?.communities.map((community, index) => (
            <li key={community.id}>
              <Reveal delay={index * 50}>
                <Link href={`/communities/${community.slug}`}>
                  <Card className={COMMUNITY_CARD_CLASS}>
                    <CardHeader>
                      <CardTitle>{community.name}</CardTitle>
                      <CardDescription>/{community.slug}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className={OPEN_HOME_TEXT_CLASS}>{OPEN_HOME_LABEL}</p>
                    </CardContent>
                  </Card>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
