import type { CourseStage } from "../../types";
import { on } from "../../utils";
import { week1Hooks } from "./week1-hooks";

export const week1: CourseStage = {
  key: "week-1",
  label: "Week 1",
  summary: (state) => (state ? "./meta/week1-enrolled.md" : "./meta/week1.md"),
  actions: [
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
        `${state.enrollment.repoUrl}/issues/${state.hooks.malachiIntro.number}`,
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
        `${state.enrollment.repoUrl}/issues/${state.hooks.umaIntro.number}`,
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
        `${state.enrollment.repoUrl}/issues/${state.hooks.amberIntro.number}`,
      passed: on(
        "issues.closed",
        (event, state) => event.issue.number === state.hooks.amberIntro.number
      ),
    },
  ],
  milestones: [
    {
      id: "merge-initial-pr",
      label: "Merge setup PR",
      passed: on(
        "pull_request.closed",
        (event, state) => event.pull_request.id === state.hooks.setupPr.id
      ),
    },
    {
      id: "assign-first-issue",
      label: "Assign first issue to self",
      passed: on(
        "issues.assigned",
        (event, state) => event.issue.id === state.hooks.storeDataIssue.id
      ),
    },
    {
      id: "move-initial-card",
      label: "Move first issue to In Progress",
      passed: on(
        "project_card.moved",
        (event, state) =>
          event.project_card.id === state.hooks.storeDataCard.id &&
          event.project_card.column_id === state.hooks.board.columns.doing.id
      ),
    },
  ],
  hooks: week1Hooks,
};
