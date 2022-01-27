import type { StoreData } from "./";

export type CourseConfig = {
  id: string;
  title: string;
  module: string;
  summary: string;
  stages: CourseStage[];
  enrollment?: {
    repoUrl: string;
  };
};

export type CourseStage = {
  key: string;
  label: string;
  summary: ((context: StoreData | null) => string) | string;
  actions?: CourseAction[];
  milestones?: CourseMilestone[];
};

export type CourseAction = {
  id: string;
  label: string;
  url: ((context: StoreData) => string) | string;
  passed: Passed;
};

export type CourseMilestone = {
  id: string;
  label: string;
  passed: Passed;
};

export type ActionTrigger = {
  event: string;
  handler: (...args: any) => boolean;
};

export type Passed =
  | boolean
  | ActionTrigger
  | ((context: StoreData) => boolean);
