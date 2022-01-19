import type { Stage } from "../../types";

export const week1: Stage = {
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
      label: "Meet Malachi",
      // @todo allow functions for url fields
      url: "https://github.com/djgrant/js2/issues/1",
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
