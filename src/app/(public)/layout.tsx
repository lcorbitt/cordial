import Link from "next/link";
import type { ReactNode } from "react";

import { PRODUCT_NAME } from "@/config/brand";

import {
  BRAND_CLASS,
  FOOTER_CLASS,
  FOOTER_INNER_CLASS,
  FOOTER_LINK_CLASS,
  HEADER_CLASS,
  HELP_LINK_LABEL,
  LOGIN_LINK_CLASS,
  LOGIN_LINK_LABEL,
  MAIN_CLASS,
  NAV_ACTIONS_CLASS,
  NAV_CLASS,
  ROOT_CLASS,
  SIGNUP_LINK_CLASS,
  SIGNUP_LINK_LABEL,
} from "./shell/constants";

/**
 * Public layout: minimal chrome for marketing and auth pages. No product shell
 * and no auth gate — anyone can view these routes. Individual auth pages
 * redirect already-signed-in users to the dashboard.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className={ROOT_CLASS}>
      <header className={HEADER_CLASS}>
        <nav className={NAV_CLASS}>
          <Link href="/" className={BRAND_CLASS}>
            {PRODUCT_NAME}
          </Link>
          <div className={NAV_ACTIONS_CLASS}>
            <Link href="/login" className={LOGIN_LINK_CLASS}>
              {LOGIN_LINK_LABEL}
            </Link>
            <Link href="/signup" className={SIGNUP_LINK_CLASS}>
              {SIGNUP_LINK_LABEL}
            </Link>
          </div>
        </nav>
      </header>
      <main id="main-content" className={MAIN_CLASS}>
        {children}
      </main>
      <footer className={FOOTER_CLASS}>
        <div className={FOOTER_INNER_CLASS}>
          <span>
            &copy; {new Date().getFullYear()} {PRODUCT_NAME}
          </span>
          <Link href="/help" className={FOOTER_LINK_CLASS}>
            {HELP_LINK_LABEL}
          </Link>
        </div>
      </footer>
    </div>
  );
}
