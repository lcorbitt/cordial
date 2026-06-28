import Link from "next/link";
import type { ReactNode } from "react";

import {
  BRAND_CLASS,
  HEADER_CLASS,
  HEADER_INNER_CLASS,
  MAIN_CLASS,
  ROOT_CLASS,
} from "./constants";

/**
 * Shared group layout (Phase 1 stub): minimal chrome for pages visible to both
 * guests and signed-in users, such as help and legal pages. No auth gate.
 */
export default function SharedLayout({ children }: { children: ReactNode }) {
  return (
    <div className={ROOT_CLASS}>
      <header className={HEADER_CLASS}>
        <div className={HEADER_INNER_CLASS}>
          <Link href="/" className={BRAND_CLASS}>
            GoverNerds
          </Link>
        </div>
      </header>
      <main id="main-content" className={MAIN_CLASS}>
        {children}
      </main>
    </div>
  );
}
