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
    id: "setupCard",
    hook: on.malachi(
      ["installation_repositories.added", "installation.created"],
      () => true,
      async (malachi, state) => {
        const issue = await malachi.createIssue({
          title: "Set up repo (Uma)",
          body: "./week1/tasks/set-up-repo.md",
        });

        const card = await malachi.createProjectCard({
          columnId: state.hooks.board.columns[0].id,
          issueId: issue.id,
        });

        return { issue, card };
      }
    ),
  },
  {
    id: "storeDataCard",
    hook: on.malachi(
      ["installation_repositories.added", "installation.created"],
      () => true,
      async (malachi, state) => {
        const issue = await malachi.createIssue({
          title: "Store member data for use in digital tools",
          body: "./week1/tasks/store-data.md",
        });

        const card = await malachi.createProjectCard({
          columnId: state.hooks.board.columns[0].id,
          issueId: issue.id,
        });

        return { issue: issue, card: card };
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
    id: "initialPr",
    hook: on.uma(
      "issues.opened",
      // @todo can't use the ouput of initialCards because the event fires before the hook result is stored
      // so either need to put all events in a queue so they are processed after the results of the previous step are stored
      // or could emit the end of a hook to all other hooks so declare dependencies on each other
      (event) => event.issue.title === "Set up repo (Uma)",
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
];
