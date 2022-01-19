import type { Express } from "express";

export type CourseConfig = {
  id: string;
  title: string;
  module: string;
  summary: string;
  stages: Stage[];
};

export type Stage = {
  key: string;
  label: string;
  summary: string;
  actions: Action[];
};

export type Action = {
  label: string;
  url: string;
  passed: ((context: Locals) => boolean) | boolean;
};

type Locals = Express["request"]["locals"];
