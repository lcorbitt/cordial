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

import { PROFILE_COPY } from "./constants";
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
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {PROFILE_COPY.title}
        </h1>
        <p className="text-muted-foreground text-lg">{PROFILE_COPY.subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{PROFILE_COPY.avatarTitle}</CardTitle>
          <CardDescription>{PROFILE_COPY.avatarDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          {profileQuery.isPending ? (
            <p className="text-muted-foreground">{PROFILE_COPY.loading}</p>
          ) : profileQuery.isError ? null : (
            <div className="flex flex-wrap items-center gap-4">
              <UserAvatar
                className="h-20 w-20"
                fallbackClassName="text-xl"
                linkToProfile={false}
              />
              <div className="flex flex-col gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
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
                    ? PROFILE_COPY.avatarUploading
                    : PROFILE_COPY.avatarUpload}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{PROFILE_COPY.detailsTitle}</CardTitle>
          <CardDescription>{PROFILE_COPY.detailsDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          {profileQuery.isPending ? (
            <p className="text-muted-foreground">{PROFILE_COPY.loading}</p>
          ) : profileQuery.isError ? (
            <ErrorState
              title={PROFILE_COPY.errorTitle}
              description={PROFILE_COPY.errorDescription}
              onRetry={() => profileQuery.refetch()}
              homeHref="/dashboard"
              homeLabel={PROFILE_COPY.backToDashboard}
            />
          ) : (
            <form
              onSubmit={onSubmit}
              className="flex max-w-md flex-col gap-4"
              noValidate
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="displayName">
                  {PROFILE_COPY.displayNameLabel}
                </Label>
                <Input id="displayName" {...register("displayName")} />
                <p className="text-muted-foreground text-sm">
                  {PROFILE_COPY.displayNameHelper}
                </p>
                <FieldError message={errors.displayName?.message} />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="bio">{PROFILE_COPY.bioLabel}</Label>
                <textarea
                  id="bio"
                  rows={4}
                  className="border-input bg-background ring-offset-background focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-base focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  {...register("bio")}
                />
                <FieldError message={errors.bio?.message} />
              </div>

              <div className="flex flex-wrap gap-3">
                <Button type="submit" size="lg" disabled={isSaving || !isDirty}>
                  {isSaving ? PROFILE_COPY.saving : PROFILE_COPY.save}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={isSaving}
                  onClick={resetForm}
                >
                  {PROFILE_COPY.reset}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
