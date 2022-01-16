import type { ReactNode } from "react";

export type ModuleStage = {
  key: string;
  label: string;
  summary: ReactNode;
};

export type ModuleConfig = {
  title: string;
  module: string;
  summary: ReactNode;
  stages: ModuleStage[];
};
