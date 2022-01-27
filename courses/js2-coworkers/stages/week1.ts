import type { CourseStage } from "../../types";
import { on } from "../../utils";

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
      url: (state) => `${state.enrollment.repoUrl}/issues/1`,
      passed: on(
        "issues.closed",
        (event) => event.issue.title === "Introducing your product owner"
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
      url: (state) => `${state.enrollment.repoUrl}/issues/2`,
      passed: on(
        "issues.closed",
        (event) => event.issue.title === "Introducing your technical lead"
      ),
    },
    {
      id: "add-amber",
      label: "Add Amber Bot to your repo",
      url: "/auth/install/amber",
      passed: (state) => state.installedBots.includes("amber"),
    },
  ],
  milestones: [
    {
      id: "merge-setup-pr",
      label: "Merge setup PR",
      passed: on(
        "pull_request.closed",
        (event) => event.pull_request.title === "Set up repo"
      ),
    },
    {
      id: "assign-first-issue",
      label: "Assign first issue to self",
      passed: on(
        "issues.assigned",
        (event) =>
          event.issue.title === "Store member data for use in digital tools"
      ),
    },
    {
      id: "move-first-issue",
      label: "Move first issue to In Progress",
      passed: false,
      // on(
      // "project_card.moved",
      // (event, state) => event.project_card.column_id === state.getColumnId("in-progress")
      // ),
    },
  ],
};
