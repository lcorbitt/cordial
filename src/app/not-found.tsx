import Link from "next/link";

import {
  DESCRIPTION,
  GO_TO_DASHBOARD_LABEL,
  GO_TO_HOME_LABEL,
  PAGE_CLASS,
  TITLE,
} from "@/app/not-found/constants";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className={PAGE_CLASS}>
      <ErrorState
        title={TITLE}
        description={DESCRIPTION}
        homeHref="/"
        homeLabel={GO_TO_HOME_LABEL}
      >
        <Button asChild variant="secondary">
          <Link href="/dashboard">{GO_TO_DASHBOARD_LABEL}</Link>
        </Button>
      </ErrorState>
    </div>
  );
}
