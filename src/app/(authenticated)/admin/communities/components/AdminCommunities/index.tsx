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
import { ErrorState } from "@/components/shared/error-state";

import {
  BACK_TO_DASHBOARD_LABEL,
  COMMUNITY_NAME_CLASS,
  COMMUNITY_SLUG_CLASS,
  CREATE_CARD_DESCRIPTION,
  CREATE_CARD_TITLE,
  CREATE_SUBMIT_LABEL,
  CREATING_LABEL,
  EMPTY_TEXT_CLASS,
  FIELD_CLASS,
  FORM_CLASS,
  INVITE_FIELD_CLASS,
  INVITE_LABEL,
  INVITE_PLACEHOLDER,
  INVITE_ROW_CLASS,
  LIST_CARD_DESCRIPTION,
  LIST_CARD_TITLE,
  LIST_CLASS,
  LIST_EMPTY_BODY,
  LIST_ERROR_DESCRIPTION,
  LIST_ERROR_TITLE,
  LIST_ITEM_CLASS,
  LIST_ITEM_HEADER_CLASS,
  LIST_LOADING_BODY,
  LOADING_TEXT_CLASS,
  NAME_LABEL,
  PAGE_CLASS,
  SENDING_INVITE_LABEL,
  SEND_INVITE_LABEL,
  SLUG_LABEL,
  SUBTITLE,
  SUBTITLE_CLASS,
  TITLE,
  TITLE_CLASS,
  VIEW_HOME_LABEL,
} from "./constants";
import { useAdminCommunities } from "./useAdminCommunities";

export function AdminCommunities() {
  const {
    form,
    adminQuery,
    setSlugTouched,
    inviteEmails,
    setInviteEmails,
    sendingInviteFor,
    nameField,
    handleNameChange,
    onSubmit,
    onSendInvite,
  } = useAdminCommunities();

  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <div className={PAGE_CLASS}>
      <div>
        <h1 className={TITLE_CLASS}>{TITLE}</h1>
        <p className={SUBTITLE_CLASS}>{SUBTITLE}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{CREATE_CARD_TITLE}</CardTitle>
          <CardDescription>{CREATE_CARD_DESCRIPTION}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className={FORM_CLASS} noValidate>
            <div className={FIELD_CLASS}>
              <Label htmlFor="name">{NAME_LABEL}</Label>
              <Input
                id="name"
                {...nameField}
                onChange={(event) => {
                  nameField.onChange(event);
                  handleNameChange(event);
                }}
              />
              <FieldError message={errors.name?.message} />
            </div>

            <div className={FIELD_CLASS}>
              <Label htmlFor="slug">{SLUG_LABEL}</Label>
              <Input
                id="slug"
                {...register("slug", {
                  onChange: () => setSlugTouched(true),
                })}
              />
              <FieldError message={errors.slug?.message} />
            </div>

            <Button type="submit" size="lg" disabled={isSubmitting}>
              {isSubmitting ? CREATING_LABEL : CREATE_SUBMIT_LABEL}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{LIST_CARD_TITLE}</CardTitle>
          <CardDescription>{LIST_CARD_DESCRIPTION}</CardDescription>
        </CardHeader>
        <CardContent>
          {adminQuery.isPending ? (
            <p className={LOADING_TEXT_CLASS}>{LIST_LOADING_BODY}</p>
          ) : adminQuery.isError ? (
            <ErrorState
              title={LIST_ERROR_TITLE}
              description={LIST_ERROR_DESCRIPTION}
              onRetry={() => adminQuery.refetch()}
              homeHref="/dashboard"
              homeLabel={BACK_TO_DASHBOARD_LABEL}
            />
          ) : adminQuery.data?.communities.length === 0 ? (
            <p className={EMPTY_TEXT_CLASS}>{LIST_EMPTY_BODY}</p>
          ) : (
            <ul className={LIST_CLASS}>
              {adminQuery.data?.communities.map((community) => (
                <li key={community.id} className={LIST_ITEM_CLASS}>
                  <div className={LIST_ITEM_HEADER_CLASS}>
                    <div>
                      <p className={COMMUNITY_NAME_CLASS}>{community.name}</p>
                      <p className={COMMUNITY_SLUG_CLASS}>/{community.slug}</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/communities/${community.slug}`}>
                        {VIEW_HOME_LABEL}
                      </Link>
                    </Button>
                  </div>

                  <div className={INVITE_ROW_CLASS}>
                    <div className={INVITE_FIELD_CLASS}>
                      <Label htmlFor={`invite-${community.id}`}>
                        {INVITE_LABEL}
                      </Label>
                      <Input
                        id={`invite-${community.id}`}
                        type="email"
                        placeholder={INVITE_PLACEHOLDER}
                        value={inviteEmails[community.id] ?? ""}
                        onChange={(event) =>
                          setInviteEmails((current) => ({
                            ...current,
                            [community.id]: event.target.value,
                          }))
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      disabled={sendingInviteFor === community.id}
                      onClick={() => onSendInvite(community.id, community.name)}
                    >
                      {sendingInviteFor === community.id
                        ? SENDING_INVITE_LABEL
                        : SEND_INVITE_LABEL}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
