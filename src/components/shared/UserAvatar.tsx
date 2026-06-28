"use client";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfileQuery } from "@/hooks/queries/useProfile";
import { resolveAvatarDisplayUrl } from "@/lib/profile/avatar-url";
import { cn } from "@/lib/utils";

import { CLASS, PROFILE_LINK_CLASS } from "./UserAvatar/constants";

interface UserAvatarProps {
  className?: string;
  fallbackClassName?: string;
  /** When false, renders the avatar without a profile link. */
  linkToProfile?: boolean;
  label?: string;
}

function getFallbackInitial(displayName: string | null | undefined): string {
  const trimmed = displayName?.trim();
  if (!trimmed) return "?";
  return trimmed.charAt(0).toUpperCase();
}

/**
 * Shared profile avatar driven by the warm TanStack profile query. Used anywhere
 * the signed-in user's photo should appear in the authenticated shell.
 */
export function UserAvatar({
  className,
  fallbackClassName,
  linkToProfile = true,
  label,
}: UserAvatarProps) {
  const profileQuery = useProfileQuery();
  const displayName = profileQuery.data?.displayName;
  const src = resolveAvatarDisplayUrl(
    profileQuery.data?.avatarUrl,
    profileQuery.data?.updatedAt,
  );

  const avatar = (
    <Avatar className={cn(CLASS, className)}>
      <AvatarImage src={src} alt="" />
      <AvatarFallback className={fallbackClassName}>
        {getFallbackInitial(displayName)}
      </AvatarFallback>
    </Avatar>
  );

  if (!linkToProfile) return avatar;

  return (
    <Link
      href="/settings"
      className={PROFILE_LINK_CLASS}
      aria-label={label ?? "Settings"}
    >
      {avatar}
    </Link>
  );
}
