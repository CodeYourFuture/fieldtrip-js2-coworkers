import type { CourseAction } from "../../types";
import { on } from "../../utils";

export const week1Actions: CourseAction[] = [
  {
    id: "add-malachi",
    label: "Add Malachi Bot to your repo",
    url: "/auth/install/malachi",
    passed: (state) => state.installedBots.includes("malachi"),
  },
  {
    id: "meet-malachi",
    label: "Meet Malachi",
    url: (state) =>
      `${state.enrollment?.repoUrl}/issues/${state.hooks.malachiIntro.number}`,
    passed: on(
      "issues.closed",
      (event, state) => event.issue.number === state.hooks.malachiIntro.number
    ),
  },
  {
    id: "add-uma",
    label: "Add Uma Bot to your repo",
    url: "/auth/install/uma",
    passed: (state) => state.installedBots.includes("uma"),
  },
  {
    id: "meet-uma",
    label: "Meet Uma",
    url: (state) =>
      `${state.enrollment?.repoUrl}/issues/${state.hooks.umaIntro.number}`,
    passed: on(
      "issues.closed",
      (event, state) => event.issue.number === state.hooks.umaIntro.number
    ),
  },
  {
    id: "add-amber",
    label: "Add Amber Bot to your repo",
    url: "/auth/install/amber",
    passed: (state) => state.installedBots.includes("amber"),
  },
  {
    id: "meet-amber",
    label: "Meet Amber",
    url: (state) =>
      `${state.enrollment?.repoUrl}/issues/${state.hooks.amberIntro.number}`,
    passed: on(
      "issues.closed",
      (event, state) => event.issue.number === state.hooks.amberIntro.number
    ),
  },
];
