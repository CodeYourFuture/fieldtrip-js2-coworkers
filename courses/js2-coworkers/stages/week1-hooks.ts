import type { CourseHook } from "../../types";
import { on } from "../../utils";

export const week1Hooks: CourseHook[] = [
  {
    id: "malachiIntro",
    hook: on.malachi(
      ["installation_repositories.added", "installation.created"],
      () => true,
      (malachi) => {
        return malachi.createIssue({
          title: "Introducing your product owner",
          body: "week1/issues/malachi-intro.md",
        });
      }
    ),
  },
  {
    id: "board",
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
    id: "setupIssue",
    hook: on.malachi(
      ["installation_repositories.added", "installation.created"],
      () => true,
      async (malachi) => {
        return malachi.createIssue({
          title: "Set up repo (Uma)",
          body: "./week1/tasks/set-up-repo.md",
        });
      }
    ),
  },
  {
    id: "setupCard",
    hook: on.malachi(
      "issues.opened",
      (event, state) => event.issue.id === state.hooks.setupIssue.id,
      async (malachi, state) => {
        return malachi.createProjectCard({
          columnId: state.hooks.board.columns[0].id,
          issueId: state.hooks.setupIssue.issue.id,
        });
      }
    ),
  },
  {
    id: "storeDataIssue",
    hook: on.malachi(
      ["installation_repositories.added", "installation.created"],
      () => true,
      (malachi) => {
        return malachi.createIssue({
          title: "Store member data for use in digital tools",
          body: "./week1/tasks/store-data.md",
        });
      }
    ),
  },
  {
    id: "storeDataCard",
    hook: on.malachi(
      "issues.opened",
      (event, state) => event.issue.id === state.hooks.storeDataIssue.id,
      (malachi, state) => {
        const issue = state.hooks.storeDataIssue;
        return malachi.createProjectCard({
          columnId: state.hooks.board.columns[0].id,
          issueId: issue.id,
        });
      }
    ),
  },
  {
    id: "umaIntro",
    hook: on.uma(
      ["installation_repositories.added", "installation.created"],
      () => true,
      (uma) => {
        return uma.createIssue({
          title: "Introducing your technical lead",
          body: "week1/issues/uma-intro.md",
        });
      }
    ),
  },
  {
    id: "amberIntro",
    hook: on.amber(
      ["installation_repositories.added", "installation.created"],
      () => true,
      (amber) => {
        return amber.createIssue({
          title: "Introducing your scrum master",
          body: "week1/issues/amber-intro.md",
        });
      }
    ),
  },
  {
    id: "initialPr",
    hook: on.uma(
      "issues.opened",
      (event, state) => event.issue.id === state.hooks.setupIssue.id,
      async (uma, state) => {
        await uma.createBranch("setup-repo");

        await uma.updateFile({
          path: "README.md",
          content: "week1/prs/repo-setup/README.md",
          branch: "setup-repo",
        });

        await uma.createFile({
          path: "members.js",
          content: "week1/prs/repo-setup/members.js",
          branch: "setup-repo",
        });

        return uma.createPullRequest({
          from: "setup-repo",
          to: "main",
          title: "Set up repo",
          body: `week1/prs/repo-setup/description.md?issueNumber=${state.hooks.setupCard.issue.number}`,
          reviewers: [uma.username],
        });
      }
    ),
  },
  {
    id: "storeDataCardComment",
    hook: on.uma(
      "issues.opened",
      (event, state) => event.issue.id === state.hooks.storeDataIssue.id,
      async (uma, state) => {
        await uma.createIssueComment({
          issueNumber: state.hooks.storeDataIssue.number,
          body: "./week1/tasks/store-data-comment.md",
        });
      }
    ),
  },
];
