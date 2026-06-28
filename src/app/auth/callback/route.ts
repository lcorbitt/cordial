import { NextResponse, type NextRequest } from "next/server";

import { sanitizeNextPath } from "@/lib/auth/next-path";
import { jobs } from "@/lib/providers/jobs/client";
import { logger } from "@/lib/logging/logger";
import { createAdminClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NOTIFICATION_TYPES } from "@shared/notification/types";

/**
 * Auth callback bridge. Handles the PKCE code exchange for OAuth (Google,
 * Microsoft), magic links, and email confirmations. This is the narrow auth
 * route exception — it is not a domain API.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeNextPath(searchParams.get("next")) ?? "/dashboard";

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      try {
        const admin = createAdminClient();
        const { data: existingWelcome } = await admin
          .from("notifications")
          .select("id")
          .eq("user_id", data.user.id)
          .eq("type", NOTIFICATION_TYPES.SYSTEM_WELCOME)
          .maybeSingle();

        if (!existingWelcome) {
          await jobs.emit({
            name: "user/created",
            data: {
              userId: data.user.id,
              email: data.user.email ?? "",
            },
          });
        }
      } catch (emitError) {
        logger.error(
          {
            userId: data.user.id,
            error:
              emitError instanceof Error
                ? emitError.message
                : String(emitError),
          },
          "auth.callback user/created publish failed",
        );
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=Sorry, we could not sign you in. Please try again.`,
  );
}
