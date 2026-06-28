"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/shared/UserAvatar";

import { NotificationBell } from "../NotificationBell";
import { SignOutButton } from "../SignOutButton";
import { MEMBER_TOP_NAV_COPY } from "./constants";

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
        "shrink-0 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-muted text-foreground font-semibold"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
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
            label: MEMBER_TOP_NAV_COPY.dashboard,
            match: (path: string) => path === "/dashboard",
          },
        ]),
    {
      href: "/communities",
      label: MEMBER_TOP_NAV_COPY.communities,
      match: (path: string) => path.startsWith("/communities"),
    },
    {
      href: "/profile",
      label: MEMBER_TOP_NAV_COPY.profile,
      match: (path: string) => path === "/profile",
    },
    ...(isAdmin || isSuperAdmin
      ? [
          {
            href: adminHref,
            label: MEMBER_TOP_NAV_COPY.admin,
            match: (path: string) => path.startsWith("/admin"),
          },
        ]
      : []),
  ];

  return (
    <header className="bg-background border-b">
      <nav className="mx-auto flex h-14 w-full max-w-7xl items-center gap-4 px-4">
        <Link
          href={brandHref}
          className="text-primary shrink-0 font-serif text-xl font-bold"
        >
          {MEMBER_TOP_NAV_COPY.brand}
        </Link>

        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <NavTabLink
              key={tab.href}
              {...tab}
              isActive={tab.match(pathname)}
            />
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Input
            disabled
            aria-hidden
            placeholder={MEMBER_TOP_NAV_COPY.searchPlaceholder}
            className="hidden h-9 max-w-xs text-sm md:block"
          />
          <NotificationBell userId={userId} />
          <UserAvatar label={MEMBER_TOP_NAV_COPY.profile} />
          <SignOutButton />
        </div>
      </nav>
    </header>
  );
}
