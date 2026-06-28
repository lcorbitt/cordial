"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { NotificationBell } from "../NotificationBell";
import { UserAvatarMenu } from "../UserAvatarMenu";
import {
  ACTIONS_CLASS,
  ADMIN_LABEL,
  BRAND_CLASS,
  BRAND_LABEL,
  COMMUNITIES_LABEL,
  DASHBOARD_LABEL,
  HEADER_CLASS,
  NAV_CLASS,
  SEARCH_INPUT_CLASS,
  SEARCH_PLACEHOLDER,
  TAB_LINK_ACTIVE_CLASS,
  TAB_LINK_CLASS,
  TAB_LINK_INACTIVE_CLASS,
  TABS_CLASS,
} from "./constants";

interface MemberTopNavProps {
  userId: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
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
  userId,
  isAdmin,
  isSuperAdmin,
}: MemberTopNavProps) {
  const pathname = usePathname();
  const brandHref = isSuperAdmin ? "/admin/overview" : "/dashboard";
  const adminHref = isSuperAdmin ? "/admin/overview" : "/admin/communities";

  const tabs: NavTabConfig[] = [
    ...(isSuperAdmin
      ? []
      : [
          {
            href: "/dashboard",
            label: DASHBOARD_LABEL,
            match: (path: string) => path === "/dashboard",
          },
        ]),
    {
      href: "/communities",
      label: COMMUNITIES_LABEL,
      match: (path: string) => path.startsWith("/communities"),
    },
    ...(isAdmin || isSuperAdmin
      ? [
          {
            href: adminHref,
            label: ADMIN_LABEL,
            match: (path: string) => path.startsWith("/admin"),
          },
        ]
      : []),
  ];

  return (
    <header className={HEADER_CLASS}>
      <nav className={NAV_CLASS}>
        <Link href={brandHref} className={BRAND_CLASS}>
          {BRAND_LABEL}
        </Link>

        <div className={TABS_CLASS}>
          {tabs.map((tab) => (
            <NavTabLink
              key={tab.href}
              {...tab}
              isActive={tab.match(pathname)}
            />
          ))}
        </div>

        <div className={ACTIONS_CLASS}>
          <Input
            disabled
            aria-hidden
            placeholder={SEARCH_PLACEHOLDER}
            className={SEARCH_INPUT_CLASS}
          />
          <NotificationBell userId={userId} />
          <UserAvatarMenu />
        </div>
      </nav>
    </header>
  );
}
