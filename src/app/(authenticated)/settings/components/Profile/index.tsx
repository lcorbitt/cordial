"use client";

import { useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserAvatar } from "@/components/shared/UserAvatar";
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
  ACTIONS_CLASS,
  AVATAR_ACTIONS_CLASS,
  AVATAR_CLASS,
  AVATAR_DESCRIPTION,
  AVATAR_FALLBACK_CLASS,
  AVATAR_ROW_CLASS,
  AVATAR_TITLE,
  AVATAR_UPLOAD_LABEL,
  AVATAR_UPLOADING_LABEL,
  BACK_TO_DASHBOARD_LABEL,
  BIO_LABEL,
  DETAILS_DESCRIPTION,
  DETAILS_TITLE,
  DISPLAY_NAME_HELPER,
  DISPLAY_NAME_LABEL,
  ERROR_DESCRIPTION,
  ERROR_TITLE,
  FIELD_CLASS,
  FILE_INPUT_CLASS,
  FORM_CLASS,
  HELPER_TEXT_CLASS,
  LOADING_BODY,
  LOADING_TEXT_CLASS,
  PAGE_CLASS,
  RESET_LABEL,
  SAVE_LABEL,
  SAVING_LABEL,
  SUBTITLE,
  SUBTITLE_CLASS,
  TEXTAREA_CLASS,
  TITLE,
  TITLE_CLASS,
} from "./constants";
import { useProfile } from "./useProfile";

export function Profile() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    form,
    onSubmit,
    onAvatarSelected,
    resetForm,
    profileQuery,
    isSaving,
    isUploadingAvatar,
    isDirty,
  } = useProfile();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className={PAGE_CLASS}>
      <div>
        <h1 className={TITLE_CLASS}>{TITLE}</h1>
        <p className={SUBTITLE_CLASS}>{SUBTITLE}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{AVATAR_TITLE}</CardTitle>
          <CardDescription>{AVATAR_DESCRIPTION}</CardDescription>
        </CardHeader>
        <CardContent>
          {profileQuery.isPending ? (
            <p className={LOADING_TEXT_CLASS}>{LOADING_BODY}</p>
          ) : profileQuery.isError ? null : (
            <div className={AVATAR_ROW_CLASS}>
              <UserAvatar
                className={AVATAR_CLASS}
                fallbackClassName={AVATAR_FALLBACK_CLASS}
                linkToProfile={false}
              />
              <div className={AVATAR_ACTIONS_CLASS}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className={FILE_INPUT_CLASS}
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    void onAvatarSelected(file);
                    event.target.value = "";
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={isUploadingAvatar}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploadingAvatar
                    ? AVATAR_UPLOADING_LABEL
                    : AVATAR_UPLOAD_LABEL}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{DETAILS_TITLE}</CardTitle>
          <CardDescription>{DETAILS_DESCRIPTION}</CardDescription>
        </CardHeader>
        <CardContent>
          {profileQuery.isPending ? (
            <p className={LOADING_TEXT_CLASS}>{LOADING_BODY}</p>
          ) : profileQuery.isError ? (
            <ErrorState
              title={ERROR_TITLE}
              description={ERROR_DESCRIPTION}
              onRetry={() => profileQuery.refetch()}
              homeHref="/dashboard"
              homeLabel={BACK_TO_DASHBOARD_LABEL}
            />
          ) : (
            <form onSubmit={onSubmit} className={FORM_CLASS} noValidate>
              <div className={FIELD_CLASS}>
                <Label htmlFor="displayName">{DISPLAY_NAME_LABEL}</Label>
                <Input id="displayName" {...register("displayName")} />
                <p className={HELPER_TEXT_CLASS}>{DISPLAY_NAME_HELPER}</p>
                <FieldError message={errors.displayName?.message} />
              </div>

              <div className={FIELD_CLASS}>
                <Label htmlFor="bio">{BIO_LABEL}</Label>
                <textarea
                  id="bio"
                  rows={4}
                  className={TEXTAREA_CLASS}
                  {...register("bio")}
                />
                <FieldError message={errors.bio?.message} />
              </div>

              <div className={ACTIONS_CLASS}>
                <Button type="submit" size="lg" disabled={isSaving || !isDirty}>
                  {isSaving ? SAVING_LABEL : SAVE_LABEL}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={isSaving}
                  onClick={resetForm}
                >
                  {RESET_LABEL}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
