import type {
  EmitterWebhookEventName,
  EmitterWebhookEvent,
} from "@octokit/webhooks";
import type { PullRequest, Issue } from "@octokit/webhooks-types";
import type { Enrollments, Hook, EventAssertion } from "../types";
import { Github } from "../services";
import { Context } from "probot";

export type Predicate<E extends EmitterWebhookEventName> = (
  event: EmitterWebhookEvent<E>["payload"],
  state: Enrollments
) => boolean;

export type Action = (github: Github, state: Enrollments) => Promise<unknown>;

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

export const prRefsIssue = (pr: PullRequest, issue: Issue) => {
  const links = [`#${issue.number}`, issue.html_url];
  return links.some((substr) => pr.body?.includes(substr));
};

export const prByOwner = (event: Context<"pull_request">["payload"]) => {
  return event.repository.owner.login === event.pull_request.user.login;
};
