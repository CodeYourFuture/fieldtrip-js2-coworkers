import type {
  EmitterWebhookEventName,
  EmitterWebhookEvent,
} from "@octokit/webhooks";

export function on<EventName extends EmitterWebhookEventName>(
  event: EventName,
  handler: HandlerFunction<EventName>
) {
  return { event, handler };
}

export type HandlerFunction<TName extends EmitterWebhookEventName> = (
  event: EmitterWebhookEvent<TName>["payload"]
) => boolean;
