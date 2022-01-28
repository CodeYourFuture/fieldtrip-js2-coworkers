import type {
  EmitterWebhookEventName,
  EmitterWebhookEvent,
} from "@octokit/webhooks";
import { StoreData } from "@packages/courses/types";

export function on<EventName extends EmitterWebhookEventName>(
  event: EventName,
  handler: HandlerFunction<EventName>
) {
  return { event, handler };
}

export type HandlerFunction<TName extends EmitterWebhookEventName> = (
  event: EmitterWebhookEvent<TName>["payload"],
  state: StoreData
) => boolean;
