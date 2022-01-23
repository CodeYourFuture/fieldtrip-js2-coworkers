import { AuthenticatedLocals, Locals } from "./";
import {
  EmitterWebhookEventName,
  EmitterWebhookEvent,
} from "@octokit/webhooks";

export type CourseConfig = {
  id: string;
  title: string;
  module: string;
  summary: string;
  stages: CourseStage[];
};

export type CourseStage = {
  key: string;
  label: string;
  summary: ((context: Locals) => string) | string;
  actions: CourseAction[];
};

export type CourseAction = {
  label: string;
  url: ((context: AuthenticatedLocals) => string) | string;
  passed:
    | boolean
    | ((context: AuthenticatedLocals) => boolean)
    | {
        [EventName in EmitterWebhookEventName]?: HandlerFunction<EventName>;
      };
};

export type HandlerFunction<TName extends EmitterWebhookEventName> = (
  event: EmitterWebhookEvent<TName>["payload"]
) => any;
