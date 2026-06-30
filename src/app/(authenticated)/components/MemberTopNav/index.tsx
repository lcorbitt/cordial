"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { CommunityPicker } from "../CommunityPicker";
import { NotificationBell } from "../NotificationBell";
import { ProfileMenu } from "../ProfileMenu";
import {
  ACTIONS_CLASS,
  DASHBOARD_LABEL,
  HEADER_CLASS,
  NAV_CLASS,
  NAV_FULL_WIDTH_CLASS,
  NAV_SPACER_CLASS,
  SEARCH_INPUT_CLASS,
  SEARCH_PLACEHOLDER,
  TAB_LINK_ACTIVE_CLASS,
  TAB_LINK_CLASS,
  TAB_LINK_INACTIVE_CLASS,
  TABS_CLASS,
} from "./constants";

interface MemberTopNavProps {
  isAdmin: boolean;
  isSuperAdmin: boolean;
  layout?: "default" | "admin";
}

interface NavTabConfig {
  href: string;
  label: string;
  match: (pathname: string) => boolean;
}

function NavTabLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        TAB_LINK_CLASS,
        isActive ? TAB_LINK_ACTIVE_CLASS : TAB_LINK_INACTIVE_CLASS,
      )}
    >
      {label}
    </Link>
  );
}

export function MemberTopNav({
  isAdmin,
  isSuperAdmin,
  layout = "default",
}: MemberTopNavProps) {
  const pathname = usePathname();

  const tabs: NavTabConfig[] = isSuperAdmin
    ? []
    : [
        {
          href: "/dashboard",
          label: DASHBOARD_LABEL,
          match: (path: string) => path === "/dashboard",
        },
      ];

  return (
    <header className={HEADER_CLASS}>
      <nav className={layout === "admin" ? NAV_FULL_WIDTH_CLASS : NAV_CLASS}>
        <CommunityPicker isSuperAdmin={isSuperAdmin} />

        {tabs.length > 0 ? (
          <div className={TABS_CLASS}>
            {tabs.map((tab) => (
              <NavTabLink
                key={tab.href}
                {...tab}
                isActive={tab.match(pathname)}
              />
            ))}
          </div>
        ) : (
          <div className={NAV_SPACER_CLASS} />
        )}

        <div className={ACTIONS_CLASS}>
          <Input
            disabled
            aria-hidden
            placeholder={SEARCH_PLACEHOLDER}
            className={SEARCH_INPUT_CLASS}
          />
          <NotificationBell />
          <ProfileMenu isAdmin={isAdmin} isSuperAdmin={isSuperAdmin} />
        </div>
      </nav>
    </header>
  );
}
