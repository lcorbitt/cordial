"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { invalidateCommunityQueries } from "@/hooks/queries/useCommunity";
import {
  useCreateCommunityMutation,
  useSendCommunityInviteMutation,
} from "@/hooks/mutations/useCommunity";
import { suggestSlugFromName } from "@/lib/community/slug";
import { runMutationWithToast } from "@/lib/toast/mutation-toast";
import { useAppRouter } from "@/hooks/use-app-router";

import {
  TOAST_CREATE_ERROR,
  TOAST_CREATE_LOADING,
  TOAST_CREATE_SUCCESS,
  TOAST_INVITE_ERROR,
  TOAST_INVITE_LOADING,
  TOAST_INVITE_SUCCESS,
} from "./constants";
import { createCommunitySchema, type CreateCommunityInput } from "./types";

/**
 * Colocated orchestration for admin community management.
 */
export function useAdminCommunities() {
  const router = useAppRouter();
  const queryClient = useQueryClient();
  const createMutation = useCreateCommunityMutation();
  const sendInviteMutation = useSendCommunityInviteMutation();
  const [slugTouched, setSlugTouched] = useState(false);
  const [inviteEmails, setInviteEmails] = useState<Record<string, string>>({});
  const [sendingInviteFor, setSendingInviteFor] = useState<string | null>(null);

  const form = useForm<CreateCommunityInput>({
    resolver: zodResolver(createCommunitySchema),
    defaultValues: { name: "", slug: "" },
  });

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!slugTouched) {
      form.setValue("slug", suggestSlugFromName(event.target.value), {
        shouldValidate: true,
      });
    }
  }

  async function onSubmit(values: CreateCommunityInput) {
    const community = await runMutationWithToast(
      createMutation.mutateAsync(values),
      {
        loading: TOAST_CREATE_LOADING,
        success: TOAST_CREATE_SUCCESS,
        errorFallback: TOAST_CREATE_ERROR,
      },
    );
    form.reset();
    setSlugTouched(false);
    await invalidateCommunityQueries(queryClient);
    router.push(`/communities/${community.slug}`);
    router.refresh();
  }

  async function onSendInvite(communityId: string, communityName: string) {
    const email = inviteEmails[communityId]?.trim();
    if (!email) return;

    setSendingInviteFor(communityId);
    try {
      await runMutationWithToast(
        sendInviteMutation.mutateAsync({ communityId, email }),
        {
          loading: TOAST_INVITE_LOADING,
          success: TOAST_INVITE_SUCCESS.replace("{name}", communityName),
          errorFallback: TOAST_INVITE_ERROR,
        },
      );
      setInviteEmails((current) => ({ ...current, [communityId]: "" }));
    } finally {
      setSendingInviteFor(null);
    }
  }

  const nameField = form.register("name");

  return {
    form,
    slugTouched,
    setSlugTouched,
    inviteEmails,
    setInviteEmails,
    sendingInviteFor,
    nameField,
    handleNameChange,
    onSubmit: form.handleSubmit(onSubmit),
    onSendInvite,
  };
}
