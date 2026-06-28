import Link from "next/link";

import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";

import {
  ACTIONS_CLASS,
  CREATE_ACCOUNT_LABEL,
  DESCRIPTION,
  DESCRIPTION_CLASS,
  LOGIN_LABEL,
  SECTION_CLASS,
  TITLE,
  TITLE_CLASS,
} from "./landing/constants";

/**
 * Marketing landing page. Thin by design — real marketing content arrives in a
 * later phase. This proves the public route group and shell render.
 */
export default function LandingPage() {
  return (
    <Reveal immediate as="section" className={SECTION_CLASS}>
      <h1 className={TITLE_CLASS}>{TITLE}</h1>
      <p className={DESCRIPTION_CLASS}>{DESCRIPTION}</p>
      <div className={ACTIONS_CLASS}>
        <Button asChild size="lg">
          <Link href="/signup">{CREATE_ACCOUNT_LABEL}</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/login">{LOGIN_LABEL}</Link>
        </Button>
      </div>
    </Reveal>
  );
}
