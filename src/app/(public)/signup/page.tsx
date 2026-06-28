import { redirectIfAuthenticated } from "@/server/loaders/session";
import { sanitizeNextPath } from "@/lib/auth/next-path";

import { CENTER_WRAPPER_CLASS } from "../auth/constants";
import { SignupForm } from "./components/SignupForm";

interface SignupPageProps {
  searchParams: Promise<{ next?: string }>;
}

/**
 * Signup page. Thin delegate: gate already-signed-in users, then render the
 * colocated form component.
 */
export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { next } = await searchParams;
  const nextPath = sanitizeNextPath(next);
  await redirectIfAuthenticated(nextPath ?? "/dashboard");

  return (
    <div className={CENTER_WRAPPER_CLASS}>
      <SignupForm nextPath={nextPath} />
    </div>
  );
}
