import type { ModuleConfig } from "src/types/courses";
import { importMDX } from "mdx.macro";
import { prose } from "src/utils";

export const Summary = prose(importMDX.sync("./summary.md"));
export const Week1 = prose(importMDX.sync("./week1.md"));

export const config: ModuleConfig = {
  title: "Co-worker discovery tools",
  module: "JS2",
  summary: <Summary />,
  stages: [
    { key: "week-1", label: "Week 1", summary: <Week1 /> },
    { key: "week-2", label: "Week 2", summary: <div /> },
    { key: "week-3", label: "Week 3", summary: <div /> },
  ],
};
