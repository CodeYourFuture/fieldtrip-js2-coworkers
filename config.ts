import { CourseConfig, Stage } from "server";

const week1: Stage = {
  key: "week-1",
  label: "Week 1",
  summary: "./week1.md",
  actions: [
    {
      label: "Add Malachi Bot to your repo",
      url: "/auth/install/malachi",
      passed: (context) => Object.keys(context.bots).includes("malachi"),
    },
    {
      label: "Add Amber Bot to your repo",
      url: "/auth/install/amber",
      passed: (context) => Object.keys(context.bots).includes("amber"),
    },
    {
      label: "Add Uma Bot to your repo",
      url: "/auth/install/amber",
      passed: (context) => Object.keys(context.bots).includes("uma"),
    },
  ],
};

const config: CourseConfig = {
  id: "js2",
  title: "Co-worker Discovery Tools",
  module: "JS2",
  summary: "./summary.md",
  stages: [week1],
};

export default config;
