import type { AuthenticatedLocals, Locals } from "./";

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
  id: string;
  label: string;
  url: ((context: AuthenticatedLocals) => string) | string;
  passed: boolean | ((context: AuthenticatedLocals) => boolean) | ActionTrigger;
};

export type ActionTrigger = {
  event: string;
  handler: (...args: any) => boolean;
};
