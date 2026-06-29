"use client";

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

import { AdminCommunitiesTable } from "../AdminCommunitiesTable";
import {
  CREATE_CARD_DESCRIPTION,
  CREATE_CARD_TITLE,
  CREATE_SUBMIT_LABEL,
  CREATING_LABEL,
  FIELD_CLASS,
  FORM_CLASS,
  LIST_CARD_DESCRIPTION,
  LIST_CARD_TITLE,
  NAME_LABEL,
  PAGE_CLASS,
  SLUG_LABEL,
  SUBTITLE,
  SUBTITLE_CLASS,
  TITLE,
  TITLE_CLASS,
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
        <CardContent className="p-0">
          <AdminCommunitiesTable
            adminQuery={adminQuery}
            inviteEmails={inviteEmails}
            setInviteEmails={setInviteEmails}
            sendingInviteFor={sendingInviteFor}
            onSendInvite={onSendInvite}
          />
        </CardContent>
      </Card>
    </div>
  );
}
