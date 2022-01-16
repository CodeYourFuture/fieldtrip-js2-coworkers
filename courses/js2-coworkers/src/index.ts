import type { ModuleConfig } from "@packages/course-utils";

export const config: ModuleConfig = {
  title: "Co-worker Discovery Tools",
  module: "JS2",
  summary: "./summary.md",
  stages: [{ key: "week-1", label: "Week 1", summary: "./week1.md" }],
};

export default config;
