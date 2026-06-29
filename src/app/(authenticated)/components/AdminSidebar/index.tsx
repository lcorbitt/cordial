"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flag,
  LayoutDashboard,
  ScrollText,
  Settings,
  Shield,
  UserRound,
  Users,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

import {
  ADMIN_SECTION_LABEL,
  AUDIT_LOGS_LABEL,
  ASIDE_CLASS,
  BACK_LINK_CLASS,
  BACK_TO_COMMUNITIES_LABEL,
  BACK_TO_DASHBOARD_LABEL,
  FEATURE_FLAGS_LABEL,
  FOOTER_CLASS,
  HEADER_CLASS,
  MANAGE_COMMUNITIES_LABEL,
  MEMBERS_LABEL,
  MOBILE_NAV_CLASS,
  MOBILE_SECTION_DIVIDER_CLASS,
  MOBILE_TAB_ACTIVE_CLASS,
  MOBILE_TAB_CLASS,
  MOBILE_TAB_INACTIVE_CLASS,
  MODERATION_LABEL,
  NAV_ICON_CLASS,
  NAV_LABEL_CLASS,
  NAV_LINK_ACTIVE_CLASS,
  NAV_LINK_CLASS,
  NAV_LINK_INACTIVE_CLASS,
  OVERVIEW_LABEL,
  PLATFORM_SETTINGS_LABEL,
  PRODUCT_NAME,
  PRODUCT_NAME_CLASS,
  SECTION_CLASS,
  SECTION_DIVIDER_CLASS,
  SECTION_LABEL_CLASS,
  SECTION_LINKS_CLASS,
  SECTIONS_CLASS,
  SUPER_ADMIN_SECTION_LABEL,
  USERS_LABEL,
} from "./constants";

interface AdminSidebarProps {
  isSuperAdmin: boolean;
}

interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const SUPER_ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    href: "/admin/overview",
    label: OVERVIEW_LABEL,
    icon: LayoutDashboard,
  },
  {
    href: "/admin/audit",
    label: AUDIT_LOGS_LABEL,
    icon: ScrollText,
  },
  {
    href: "/admin/users",
    label: USERS_LABEL,
    icon: Users,
  },
  {
    href: "/admin/settings",
    label: PLATFORM_SETTINGS_LABEL,
    icon: Settings,
  },
];

const PLATFORM_ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    href: "/admin/communities",
    label: MANAGE_COMMUNITIES_LABEL,
    icon: UsersRound,
  },
  {
    href: "/admin/members",
    label: MEMBERS_LABEL,
    icon: UserRound,
  },
  {
    href: "/admin/flags",
    label: FEATURE_FLAGS_LABEL,
    icon: Flag,
  },
  {
    href: "/admin/moderation",
    label: MODERATION_LABEL,
    icon: Shield,
  },
];

function isActivePath(pathname: string, href: string): boolean {
  if (href === "/admin/overview") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarNavLink({
  item,
  isActive,
}: {
  item: AdminNavItem;
  isActive: boolean;
}) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        NAV_LINK_CLASS,
        isActive ? NAV_LINK_ACTIVE_CLASS : NAV_LINK_INACTIVE_CLASS,
      )}
    >
      <Icon className={NAV_ICON_CLASS} aria-hidden />
      <span className={NAV_LABEL_CLASS}>{item.label}</span>
    </Link>
  );
}

function SidebarNavSection({
  label,
  items,
  pathname,
}: {
  label: string;
  items: AdminNavItem[];
  pathname: string;
}) {
  return (
    <div className={SECTION_CLASS}>
      <p className={SECTION_LABEL_CLASS}>{label}</p>
      <div className={SECTION_LINKS_CLASS}>
        {items.map((item) => (
          <SidebarNavLink
            key={item.href}
            item={item}
            isActive={isActivePath(pathname, item.href)}
          />
        ))}
      </div>
    </div>
  );
}

function MobileNavTab({
  item,
  isActive,
}: {
  item: AdminNavItem;
  isActive: boolean;
}) {
  return (
    <Link
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
}

export function AdminSidebar({ isSuperAdmin }: AdminSidebarProps) {
  const pathname = usePathname();
  const backHref = isSuperAdmin ? "/communities" : "/dashboard";
  const backLabel = isSuperAdmin
    ? BACK_TO_COMMUNITIES_LABEL
    : BACK_TO_DASHBOARD_LABEL;

  return (
    <aside className={ASIDE_CLASS}>
      <div className={HEADER_CLASS}>
        <p className={PRODUCT_NAME_CLASS}>{PRODUCT_NAME}</p>
      </div>

      <nav className={SECTIONS_CLASS}>
        {isSuperAdmin ? (
          <>
            <SidebarNavSection
              label={SUPER_ADMIN_SECTION_LABEL}
              items={SUPER_ADMIN_NAV_ITEMS}
              pathname={pathname}
            />
            <div className={SECTION_DIVIDER_CLASS} role="presentation" />
          </>
        ) : null}
        <SidebarNavSection
          label={ADMIN_SECTION_LABEL}
          items={PLATFORM_ADMIN_NAV_ITEMS}
          pathname={pathname}
        />
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

  return (
    <nav aria-label={PRODUCT_NAME} className={MOBILE_NAV_CLASS}>
      {isSuperAdmin
        ? SUPER_ADMIN_NAV_ITEMS.map((item) => (
            <MobileNavTab
              key={item.href}
              item={item}
              isActive={isActivePath(pathname, item.href)}
            />
          ))
        : null}
      {isSuperAdmin ? (
        <div className={MOBILE_SECTION_DIVIDER_CLASS} role="presentation" />
      ) : null}
      {PLATFORM_ADMIN_NAV_ITEMS.map((item) => (
        <MobileNavTab
          key={item.href}
          item={item}
          isActive={isActivePath(pathname, item.href)}
        />
      ))}
    </nav>
  );
}
