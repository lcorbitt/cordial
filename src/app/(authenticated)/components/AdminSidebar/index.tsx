"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flag,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import { ADMIN_SIDEBAR_COPY } from "./constants";

interface AdminSidebarProps {
  isSuperAdmin: boolean;
}

interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  superAdminOnly?: boolean;
  comingSoon?: boolean;
}

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    href: "/admin/overview",
    label: ADMIN_SIDEBAR_COPY.overview,
    icon: LayoutDashboard,
    superAdminOnly: true,
  },
  {
    href: "/admin/communities",
    label: ADMIN_SIDEBAR_COPY.manageCommunities,
    icon: UsersRound,
  },
  {
    href: "/admin/flags",
    label: ADMIN_SIDEBAR_COPY.featureFlags,
    icon: Flag,
    comingSoon: true,
  },
  {
    href: "/admin/users",
    label: ADMIN_SIDEBAR_COPY.users,
    icon: Users,
    comingSoon: true,
  },
  {
    href: "/admin/moderation",
    label: ADMIN_SIDEBAR_COPY.moderation,
    icon: Shield,
    comingSoon: true,
  },
  {
    href: "/admin/settings",
    label: ADMIN_SIDEBAR_COPY.platformSettings,
    icon: Settings,
    superAdminOnly: true,
    comingSoon: true,
  },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/admin/overview") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({ isSuperAdmin }: AdminSidebarProps) {
  const pathname = usePathname();
  const visibleItems = ADMIN_NAV_ITEMS.filter(
    (item) => !item.superAdminOnly || isSuperAdmin,
  );
  const backHref = isSuperAdmin ? "/communities" : "/dashboard";
  const backLabel = isSuperAdmin
    ? ADMIN_SIDEBAR_COPY.backToCommunities
    : ADMIN_SIDEBAR_COPY.backToDashboard;

  return (
    <aside className="border-border bg-background sticky top-14 hidden w-56 shrink-0 flex-col border-r md:flex md:min-h-[calc(100dvh-3.5rem)]">
      <div className="border-border border-b px-4 py-4">
        <p className="text-sm font-semibold">{ADMIN_SIDEBAR_COPY.title}</p>
        <p className="text-muted-foreground text-xs">
          {ADMIN_SIDEBAR_COPY.subtitle}
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-muted text-foreground font-semibold"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.comingSoon ? (
                <span className="text-muted-foreground shrink-0 text-[10px] font-normal tracking-wide uppercase">
                  {ADMIN_SIDEBAR_COPY.comingSoon}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-border border-t p-3">
        <Link
          href={backHref}
          className="text-muted-foreground hover:text-foreground hover:bg-accent block rounded-md px-3 py-2 text-sm font-medium transition-colors"
        >
          {backLabel}
        </Link>
      </div>
    </aside>
  );
}

export function AdminSidebarMobile({ isSuperAdmin }: AdminSidebarProps) {
  const pathname = usePathname();
  const visibleItems = ADMIN_NAV_ITEMS.filter(
    (item) => !item.superAdminOnly || isSuperAdmin,
  );

  return (
    <nav
      aria-label={ADMIN_SIDEBAR_COPY.title}
      className="border-border flex gap-1 overflow-x-auto border-b px-4 py-2 md:hidden"
    >
      {visibleItems.map((item) => {
        const isActive = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "bg-muted text-foreground font-semibold"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
