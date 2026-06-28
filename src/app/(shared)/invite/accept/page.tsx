import { Suspense } from "react";

import {
  CHECKING_FALLBACK,
  FALLBACK_MESSAGE_CLASS,
  FALLBACK_WRAPPER_CLASS,
} from "./constants";
import { AcceptInvite } from "./components/AcceptInvite";

/**
 * Community invitation acceptance page. Works for signed-in and guest users.
 */
export default function AcceptInvitePage() {
  return (
    <Suspense
      fallback={
        <div className={FALLBACK_WRAPPER_CLASS}>
          <p className={FALLBACK_MESSAGE_CLASS}>{CHECKING_FALLBACK}</p>
        </div>
      }
    >
      <AcceptInvite />
    </Suspense>
  );
}
