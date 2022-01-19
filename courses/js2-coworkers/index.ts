import { CourseConfig, Stage } from "server";

const week1: Stage = {
  key: "week-1",
  label: "Week 1",
  summary: "./week1.md",
  actions: [
    { label: "Add MalachiBot to your repo", url: "/auth/install/malachi" },
    { label: "Add AmberBot to your repo", url: "/auth/install/amber" },
  ],
};

const config: CourseConfig = {
  id: "js2",
  title: "Co-worker Discovery Tools",
  module: "JS2",
  summary: "./summary.md",
  stages: [week1],
};

export const js2 = config;
