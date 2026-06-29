"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { UserAvatar } from "@/components/shared/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppRouter } from "@/hooks/use-app-router";
import { signOut } from "@/lib/auth/client";

import {
  DROPDOWN_CLASS,
  ITEM_CLASS,
  SETTINGS_LABEL,
  SIGN_OUT_ERROR_MESSAGE,
  SIGN_OUT_LABEL,
  SIGNING_OUT_LABEL,
  TRIGGER_CLASS,
  TRIGGER_LABEL,
} from "./constants";

export function UserAvatarMenu() {
  const router = useAppRouter();
  const [signOutPending, setSignOutPending] = useState(false);

  async function handleSignOut() {
    setSignOutPending(true);
    try {
      await signOut();
      router.push("/login");
      router.refresh();
    } catch {
      toast.error(SIGN_OUT_ERROR_MESSAGE);
      setSignOutPending(false);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={TRIGGER_CLASS}
          aria-label={TRIGGER_LABEL}
        >
          <UserAvatar linkToProfile={false} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={DROPDOWN_CLASS}>
        <DropdownMenuItem asChild className={ITEM_CLASS}>
          <Link href="/settings">{SETTINGS_LABEL}</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className={ITEM_CLASS}
          disabled={signOutPending}
          onSelect={(event) => {
            event.preventDefault();
            void handleSignOut();
          }}
        >
          {signOutPending ? SIGNING_OUT_LABEL : SIGN_OUT_LABEL}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
