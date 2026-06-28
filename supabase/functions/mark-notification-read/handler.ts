import { z } from "zod";

import type { HandlerContext } from "@http/context.ts";
import { apiResponse } from "@http/response.ts";
import {
  markNotificationRead,
  NotificationValidationError,
} from "@services/notification/notification.service.ts";

const bodySchema = z
  .object({
    notificationId: z.string().uuid().optional(),
    all: z.boolean().optional(),
  })
  .refine((value) => value.all === true || value.notificationId !== undefined, {
    message: "Please choose a notification to mark as read.",
  });

/**
 * HTTP adapter for marking one or all notifications as read.
 */
export async function handle(ctx: HandlerContext): Promise<Response> {
  if (ctx.req.method !== "PATCH") {
    return apiResponse.error(405, "validation_error", "Method not allowed.");
  }
  if (!ctx.user || !ctx.userClient) return apiResponse.unauthorized();

  let json: unknown;
  try {
    json = await ctx.req.json();
  } catch {
    return apiResponse.badRequest("Please send a valid request.");
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return apiResponse.badRequest("Please check the fields and try again.", {
      issues: parsed.error.flatten().fieldErrors,
    });
  }

  try {
    const result = await markNotificationRead(
      ctx.userClient,
      ctx.user.id,
      parsed.data,
    );
    return apiResponse.ok(result);
  } catch (error) {
    if (error instanceof NotificationValidationError) {
      return apiResponse.badRequest(error.message);
    }
    throw error;
  }
}
