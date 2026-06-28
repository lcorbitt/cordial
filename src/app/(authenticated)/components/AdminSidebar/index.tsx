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

import {
  ASIDE_CLASS,
  BACK_LINK_CLASS,
  BACK_TO_COMMUNITIES_LABEL,
  BACK_TO_DASHBOARD_LABEL,
  COMING_SOON_BADGE_CLASS,
  COMING_SOON_LABEL,
  FEATURE_FLAGS_LABEL,
  FOOTER_CLASS,
  HEADER_CLASS,
  MANAGE_COMMUNITIES_LABEL,
  MOBILE_NAV_CLASS,
  MOBILE_TAB_ACTIVE_CLASS,
  MOBILE_TAB_CLASS,
  MOBILE_TAB_INACTIVE_CLASS,
  MODERATION_LABEL,
  NAV_CLASS,
  NAV_ICON_CLASS,
  NAV_LABEL_CLASS,
  NAV_LINK_ACTIVE_CLASS,
  NAV_LINK_CLASS,
  NAV_LINK_INACTIVE_CLASS,
  OVERVIEW_LABEL,
  PLATFORM_SETTINGS_LABEL,
  SUBTITLE,
  SUBTITLE_CLASS,
  TITLE,
  TITLE_CLASS,
  USERS_LABEL,
} from "./constants";

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
    label: OVERVIEW_LABEL,
    icon: LayoutDashboard,
    superAdminOnly: true,
  },
  {
    href: "/admin/communities",
    label: MANAGE_COMMUNITIES_LABEL,
    icon: UsersRound,
  },
  {
    href: "/admin/flags",
    label: FEATURE_FLAGS_LABEL,
    icon: Flag,
    comingSoon: true,
  },
  {
    href: "/admin/users",
    label: USERS_LABEL,
    icon: Users,
    comingSoon: true,
  },
  {
    href: "/admin/moderation",
    label: MODERATION_LABEL,
    icon: Shield,
    comingSoon: true,
  },
  {
    href: "/admin/settings",
    label: PLATFORM_SETTINGS_LABEL,
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
    ? BACK_TO_COMMUNITIES_LABEL
    : BACK_TO_DASHBOARD_LABEL;

  return (
    <aside className={ASIDE_CLASS}>
      <div className={HEADER_CLASS}>
        <p className={TITLE_CLASS}>{TITLE}</p>
        <p className={SUBTITLE_CLASS}>{SUBTITLE}</p>
      </div>

      <nav className={NAV_CLASS}>
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePath(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                NAV_LINK_CLASS,
                isActive ? NAV_LINK_ACTIVE_CLASS : NAV_LINK_INACTIVE_CLASS,
              )}
            >
              <Icon className={NAV_ICON_CLASS} aria-hidden />
              <span className={NAV_LABEL_CLASS}>{item.label}</span>
              {item.comingSoon ? (
                <span className={COMING_SOON_BADGE_CLASS}>
                  {COMING_SOON_LABEL}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className={FOOTER_CLASS}>
        <Link href={backHref} className={BACK_LINK_CLASS}>
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
    <nav aria-label={TITLE} className={MOBILE_NAV_CLASS}>
      {visibleItems.map((item) => {
        const isActive = isActivePath(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              MOBILE_TAB_CLASS,
              isActive ? MOBILE_TAB_ACTIVE_CLASS : MOBILE_TAB_INACTIVE_CLASS,
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
