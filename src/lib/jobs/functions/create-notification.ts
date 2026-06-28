import { inngest } from "@/lib/providers/jobs/publisher";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/database.types";
import type { NotificationCreateData } from "@/lib/jobs/catalog";

/**
 * Persists in-app notifications off the request path. Welcome notifications are
 * idempotent so auth callback retries never duplicate rows.
 */
export const createNotification = inngest.createFunction(
  {
    id: "create-notification",
    name: "Create notification",
    triggers: [{ event: "notification/create" }],
  },
  async ({ event }) => {
    const data = event.data as NotificationCreateData;
    const supabase = createAdminClient();

    if (data.type === "system.welcome") {
      const { data: existing, error: lookupError } = await supabase
        .from("notifications")
        .select("id")
        .eq("user_id", data.userId)
        .eq("type", data.type)
        .limit(1)
        .maybeSingle();

      if (lookupError) {
        throw new Error(
          `Failed to check welcome notification: ${lookupError.message}`,
        );
      }
      if (existing) return { created: false, skipped: true };
    }

    const { error } = await supabase.from("notifications").insert({
      user_id: data.userId,
      type: data.type,
      title: data.title,
      body: data.body,
      action_url: data.actionUrl ?? null,
      metadata: (data.metadata ?? {}) as Json,
    });

    if (error)
      throw new Error(`Failed to create notification: ${error.message}`);
    return { created: true };
  },
);
