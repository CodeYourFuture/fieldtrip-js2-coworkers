import type { Stage } from "../../types";

export const week1: Stage = {
  key: "week-1",
  label: "Week 1",
  summary: "./meta/week1.md",
  actions: [
    {
      label: "Add Malachi Bot to your repo",
      url: "/auth/install/malachi",
      passed: (context) => Object.keys(context.bots).includes("malachi"),
    },
    {
      label: "Meet Malachi",
      url: (context) => `https://github.com/${context.user.login}/js2/issues/1`,
      // @todo project card is assigned to user
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
