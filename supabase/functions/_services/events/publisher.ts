import type { ProfileUpdatedEventData } from "@shared/dto/events.dto.ts";
import type {
  CommunityCreatedEventData,
  CommunityInviteSentEventData,
  CommunityMemberJoinedEventData,
} from "@shared/dto/events.dto.ts";

/**
 * Typed event catalog for Edge Function publishers. Domain events are emitted
 * after successful writes; integration commands are emitted by orchestrators.
 */
export type EdgeDomainEvent =
  | { name: "profile/updated"; data: ProfileUpdatedEventData }
  | { name: "community/created"; data: CommunityCreatedEventData }
  | { name: "community/member-joined"; data: CommunityMemberJoinedEventData }
  | { name: "community/invite-sent"; data: CommunityInviteSentEventData };

export type EdgeEvent = EdgeDomainEvent;

interface EventPublisher {
  publish(event: EdgeEvent): Promise<void>;
}

class InngestEventPublisher implements EventPublisher {
  constructor(private readonly eventKey: string) {}

  async publish(event: EdgeEvent): Promise<void> {
    const res = await fetch(`https://inn.gs/e/${this.eventKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: event.name, data: event.data }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(
        `Inngest event publish failed (${res.status}): ${body || res.statusText}`,
      );
    }
  }
}

class ConsoleEventPublisher implements EventPublisher {
  publish(event: EdgeEvent): Promise<void> {
    console.info(
      JSON.stringify({
        level: "info",
        msg: "events.publish (console provider — not delivered to Inngest)",
        event: event.name,
        data: event.data,
      }),
    );
    return Promise.resolve();
  }
}

let publisher: EventPublisher | undefined;

function getPublisher(): EventPublisher {
  if (publisher) return publisher;

  const eventKey = Deno.env.get("INNGEST_EVENT_KEY");
  publisher = eventKey
    ? new InngestEventPublisher(eventKey)
    : new ConsoleEventPublisher();

  return publisher;
}

/**
 * Publishes a domain event to the event bus. Fire-and-forget: failures are
 * logged but never propagate to the caller — the DB write already succeeded.
 */
export async function publishEvent(event: EdgeEvent): Promise<void> {
  try {
    await getPublisher().publish(event);
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        msg: "events.publish failed",
        event: event.name,
        error: error instanceof Error ? error.message : String(error),
      }),
    );
  }
}

/** @internal Exposed for unit tests only. */
export function resetPublisherForTests(): void {
  publisher = undefined;
}

/** @internal Exposed for unit tests only. */
export function setPublisherForTests(next: EventPublisher): void {
  publisher = next;
}

export type { EventPublisher };
