import type { CourseStage } from "../../types";

export const week1: CourseStage = {
  key: "week-1",
  label: "Week 1",
  summary: (context) =>
    context.enrollment ? "./meta/week1-enrolled.md" : "./meta/week1.md",
  actions: [
    {
      label: "Add Malachi Bot to your repo",
      url: "/auth/install/malachi",
      passed: (context) => Object.keys(context.bots).includes("malachi"),
    },
    {
      label: "Meet Malachi",
      url: (context) => `https://github.com/${context.user.login}/js2/issues/1`,
      // passed: (context) => context.repo.issueIsClose({ issueNumber: 1 }),
      passed: () => false,
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
