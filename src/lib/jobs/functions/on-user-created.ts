import { events, inngest } from "@/lib/providers/jobs/publisher";
import type { UserCreatedData } from "@/lib/jobs/catalog";
import { WELCOME_NOTIFICATION } from "@/lib/jobs/notifications/templates";

/**
 * Reacts to a new user. The database trigger already creates the profile row
 * and assigns the default `member` role, so here we fan out side effects:
 * welcome email, welcome notification, and an audit entry. Kept small and idempotent.
 */
export const onUserCreated = inngest.createFunction(
  {
    id: "on-user-created",
    name: "On user created",
    triggers: [{ event: "user/created" }],
  },
  async ({ event, step }) => {
    const data = event.data as UserCreatedData;

    await step.run("send-welcome-email", async () =>
      events.publish({
        name: "email/send",
        data: {
          template: "notification",
          to: data.email,
          payload: {
            heading: "Welcome to GoverNerds",
            body: "Your account is ready. We are glad you are here.",
          },
        },
      }),
    );

    await step.run("welcome-notification", async () =>
      events.publish({
        name: "notification/create",
        data: {
          userId: data.userId,
          type: "system.welcome",
          title: WELCOME_NOTIFICATION.title,
          body: WELCOME_NOTIFICATION.body,
          actionUrl: WELCOME_NOTIFICATION.actionUrl,
        },
      }),
    );

    await step.run("audit", async () =>
      events.publish({
        name: "audit/log",
        data: {
          actorId: data.userId,
          action: "user.created",
          resourceType: "user",
          resourceId: data.userId,
        },
      }),
    );

    return { handled: true };
  },
);
