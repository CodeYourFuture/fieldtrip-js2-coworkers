import type { CourseStage } from "../../types";
import { on } from "../../utils";

export const week1: CourseStage = {
  key: "week-1",
  label: "Week 1",
  summary: (context) =>
    context.enrollment ? "./meta/week1-enrolled.md" : "./meta/week1.md",
  actions: [
    {
      id: "add-malachi",
      label: "Add Malachi Bot to your repo",
      url: "/auth/install/malachi",
      passed: (context) => Object.keys(context.bots).includes("malachi"),
    },
    {
      id: "meet-malachi",
      label: "Meet Malachi",
      url: (context) =>
        `https://github.com/${context.user.login}/${context.repo}/issues/1`,
      passed: on("issues.closed", (event) => event.issue.number === 1),
    },
    {
      id: "add-uma",
      label: "Add Uma Bot to your repo",
      url: "/auth/install/uma",
      passed: (context) => Object.keys(context.bots).includes("uma"),
    },
    {
      id: "meet-uma",
      label: "Meet Uma",
      url: (context) =>
        `https://github.com/${context.user.login}/${context.repo}/issues/2`,
      passed: on("issues.closed", (event) => event.issue.number === 2),
    },
    {
      id: "add-amber",
      label: "Add Amber Bot to your repo",
      url: "/auth/install/amber",
      passed: (context) => Object.keys(context.bots).includes("amber"),
    },
  ],
};
