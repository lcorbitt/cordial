import "server-only";

import { Inngest } from "inngest";

import { env } from "@/lib/env/server";
import { logger } from "@/lib/logging/logger";
import type { AppEvent } from "@/lib/jobs/catalog";

/**
 * The underlying Inngest client. Functions register against this; application
 * code publishes through `events.publish()` rather than calling Inngest
 * directly, so the provider stays swappable.
 */
export const inngest = new Inngest({ id: "cordial" });

interface EventPublisher {
  publish(event: AppEvent): Promise<unknown>;
}

class InngestEventPublisher implements EventPublisher {
  async publish(event: AppEvent): Promise<unknown> {
    return inngest.send({ name: event.name, data: event.data });
  }
}

class ConsoleEventPublisher implements EventPublisher {
  async publish(event: AppEvent): Promise<unknown> {
    logger.info(
      { event: event.name, data: event.data },
      "events.publish (console provider — not delivered to Inngest)",
    );
    return undefined;
  }
}

let publisher: EventPublisher | undefined;

function getPublisher(): EventPublisher {
  if (publisher) return publisher;

  if (env.JOB_PROVIDER === "inngest" && env.INNGEST_EVENT_KEY) {
    publisher = new InngestEventPublisher();
  } else {
    publisher = new ConsoleEventPublisher();
  }

  return publisher;
}

/**
 * Publishes an event to the bus. Prefer this over `jobs.emit()` in new code.
 */
export const events = {
  publish(event: AppEvent): Promise<unknown> {
    return getPublisher().publish(event);
  },
};

/** @internal Exposed for unit tests only. */
export function resetPublisherForTests(): void {
  publisher = undefined;
}

/** @internal Exposed for unit tests only. */
export function setPublisherForTests(next: EventPublisher): void {
  publisher = next;
}

export type { EventPublisher };
