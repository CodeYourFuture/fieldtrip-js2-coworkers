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
          body: "week1/malachi/intro.md",
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
    id: "initialCards",
    hook: on.malachi(
      ["installation_repositories.added", "installation.created"],
      () => true,
      async (malachi, state) => {
        const umaIssue = await malachi.createIssue({
          title: "Set up repo (Uma)",
          body: "./week1/tasks/set-up-repo.md",
        });

        await malachi.createProjectCard({
          columnId: state.hooks.board.columns[0].id,
          issueNumber: umaIssue.id,
        });

        const studentIssue = await malachi.createIssue({
          title: "Store member data for use in digital tools",
          body: "./week1/tasks/store-data.md",
        });

        const studentCard = await malachi.createProjectCard({
          columnId: state.hooks.board.columns[0].id,
          issueNumber: studentIssue.id,
        });

        return { issue: studentIssue, card: studentCard };
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
          body: "week1/uma/intro.md",
        });
      }
    ),
  },
  {
    id: "initialPr",
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
];
