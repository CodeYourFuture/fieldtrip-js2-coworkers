import type { CourseAction } from "@notation/fieldtrip";
import { on } from "@notation/fieldtrip";

export const sprint1Actions: CourseAction[] = [
  {
    id: "add-malachi",
    label: "Add Malachi Bot to your repo",
    url: "/auth/install/malachi",
    passed: (state) => state.bots.includes("malachi"),
  },
  {
    id: "meet-malachi",
    label: "Meet Malachi",
    url: (state) => state.hooks.malachiIntro.html_url,
    passed: on(
      "issues.closed",
      (event, state) => event.issue.number === state.hooks.malachiIntro.number
    ),
  },
  {
    id: "add-uma",
    label: "Add Uma Bot to your repo",
    url: "/auth/install/uma",
    passed: (state) => state.bots.includes("uma"),
  },
  {
    id: "meet-uma",
    label: "Meet Uma",
    url: (state) => state.hooks.umaIntro.html_url,
    passed: on(
      "issues.closed",
      (event, state) => event.issue.number === state.hooks.umaIntro.number
    ),
  },
  {
    id: "add-amber",
    label: "Add Amber Bot to your repo",
    url: "/auth/install/amber",
    passed: (state) => state.bots.includes("amber"),
  },
  {
    id: "meet-amber",
    label: "Meet Amber",
    url: (state) => state.hooks.amberIntro.html_url,
    passed: on(
      "issues.closed",
      (event, state) => event.issue.number === state.hooks.amberIntro.number
    ),
  },
];
