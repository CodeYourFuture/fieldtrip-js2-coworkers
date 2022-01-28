import type {
  EmitterWebhookEventName,
  EmitterWebhookEvent,
} from "@octokit/webhooks";
import { StoreData } from "@packages/courses/types";
import { Bot } from "../utils";
import type { Hook, EventAssertion } from "../types/course";

export type Predicate<E extends EmitterWebhookEventName> = (
  event: EmitterWebhookEvent<E>["payload"],
  state: StoreData
) => boolean;

export type Action = (bot: Bot, state: StoreData) => Promise<unknown>;

export function on<E extends EmitterWebhookEventName>(
  event: E | E[],
  predicate: Predicate<E>
): EventAssertion;

export function on<E extends EmitterWebhookEventName>(
  event: E | E[],
  predicate: Predicate<E>,
  action: Action
): Hook;

export function on<E extends EmitterWebhookEventName>(
  this: string,
  event: string | string[],
  predicate: (...args: any) => boolean,
  action?: (...args: any) => Promise<unknown>
): unknown {
  const botName = this || "cyf";
  return { event, predicate, action, botName };
}

on.amber = on.bind("amber");
on.malachi = on.bind("malachi");
on.uma = on.bind("uma");
