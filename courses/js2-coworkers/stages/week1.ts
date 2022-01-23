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
      url: (context) =>
        `https://github.com/${context.user.login}/${context.repo}/issues/1`,
      passed: {
        "issues.closed": (event) => event.issue.number === 1,
      },
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
