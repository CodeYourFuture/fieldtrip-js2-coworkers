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
      url: (state) =>
        `${state.enrollment.repoUrl}/issues/${state.hooks["malachi-intro"].number}`,
      passed: on(
        "issues.closed",
        (event, state) =>
          event.issue.number === state.hooks["malachi-intro"].number
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
        `${state.enrollment.repoUrl}/issues/${state.hooks["uma-intro"].number}`,
      passed: on(
        "issues.closed",
        (event, state) => event.issue.number === state.hooks["uma-intro"].number
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
      id: "merge-initial-pr",
      label: "Merge setup PR",
      passed: on(
        "pull_request.closed",
        (event, state) => event.pull_request.id === state.hooks["initial-pr"].id
      ),
    },
    {
      id: "assign-first-issue",
      label: "Assign first issue to self",
      passed: on(
        "issues.assigned",
        (event) =>
          // event.issue.title === "Store member data for use in digital tools"
          event.issue.title === "Set up repo"
      ),
    },
    {
      id: "move-initial-card",
      label: "Move first issue to In Progress",
      passed: on(
        "project_card.moved",
        (event, state) =>
          event.project_card.id === state.hooks["initial-card"].id &&
          event.project_card.column_id ===
            state.hooks["board-setup"].columns[1].id
      ),
    },
  ],
  hooks: [
    {
      id: "malachi-intro",
      hook: on.malachi(
        ["installation_repositories.added", "installation.created"],
        () => true,
        (malachi) => {
          return malachi.createIssue({
            title: "Introducing your product owner",
            body: "week1/malachi/intro.md",
          });
        }
      ),
    },
    {
      id: "board-setup",
      hook: on.malachi(
        ["installation_repositories.added", "installation.created"],
        () => true,
        async (malachi) => {
          const project = await malachi.createProject({
            name: "Co-worker tools",
            body: "A collection of tools for co-workers",
          });

          const columnNames = ["Todo", "In Progress", "Blocked", "Done"];

          const columns = await Promise.all(
            columnNames.map((columnName) =>
              malachi.createProjectColumn({
                projectId: project.id,
                name: columnName,
              })
            )
          );

          return {
            id: project.id,
            columns: columns.map((column) => ({
              id: column.id,
              name: column.name,
            })),
          };
        }
      ),
    },

    {
      id: "initial-card",
      hook: on.malachi(
        ["installation_repositories.added", "installation.created"],
        () => true,
        async (malachi, state) => {
          const task = await malachi.createIssue({
            title: "Set up repo",
            body: "./week1/tasks/set-up-repo.md",
          });

          return malachi.createProjectCard({
            columnId: state.hooks["board-setup"].columns[0].id,
            issueNumber: task.id,
          });
        }
      ),
    },
    {
      id: "uma-intro",
      hook: on.uma(
        ["installation_repositories.added", "installation.created"],
        () => true,
        (uma) => {
          return uma.createIssue({
            title: "Introducing your technical lead",
            body: "week1/uma/intro.md",
          });
        }
      ),
    },
    {
      id: "initial-pr",
      hook: on.uma(
        ["installation_repositories.added", "installation.created"],
        () => true,
        async (uma) => {
          await uma.createBranch("setup-repo");

          await uma.updateFile({
            path: "README.md",
            content: "#JS",
            branch: "setup-repo",
          });

          return uma.createPullRequest({
            from: "setup-repo",
            to: "main",
            title: "Set up repo",
            body: "Set up repo",
            reviewers: [uma.user.login],
          });
        }
      ),
    },
  ],
};
