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

        const columnNames = {
          todo: "Todo",
          doing: "In Progress",
          review: "Review/QA",
          blocked: "Blocked",
          done: "Done",
        };

        const columns = {} as { [key: string]: any };

        for (const columnName of Object.values(columnNames)) {
          columns[columnName] = await malachi.createProjectColumn({
            projectId: project.id,
            name: columnName,
          });
        }

        return {
          id: project.id,
          columns,
        };
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
          columnId: state.hooks.board.columns.todo.id,
          issueId: issue.id,
          position: "top",
        });
      }
    ),
  },
  {
    id: "listCommandIssue",
    hook: on.malachi(
      ["installation_repositories.added", "installation.created"],
      () => true,
      (malachi) => {
        return malachi.createIssue({
          title: "Create CLI command to list members",
          body: "./week1/tasks/list-command.md",
        });
      }
    ),
  },
  {
    id: "listCommandCard",
    hook: on.malachi(
      "issues.opened",
      (event, state) => event.issue.id === state.hooks.listCommandIssue.id,
      (malachi, state) => {
        const issue = state.hooks.listCommandIssue;
        return malachi.createProjectCard({
          columnId: state.hooks.board.columns.todo.id,
          issueId: issue.id,
          position: "bottom",
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
          columnId: state.hooks.board.columns.todo.id,
          issueId: state.hooks.setupIssue.id,
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
          body: `week1/prs/repo-setup/description.md?issueNumber=${state.hooks.setupIssue.number}`,
          reviewers: [uma.username],
        });
      }
    ),
  },
  {
    id: "cliPr",
    hook: on(
      "project_card.moved",
      (event, state) => {
        const cols = state.hooks.board.columns;
        const isDataCard =
          event.project_card.id === state.hooks.storeDataCard.id;
        const devDone = [cols.review.id, cols.done.id].includes(
          event.project_card.column_id
        );
        return isDataCard && devDone;
      },
      async (uma, state) => {
        await uma.createBranch("setup-cli");

        await uma.updateFile({
          path: "README.md",
          content: "week1/prs/cli-setup/README.md",
          branch: "setup-cli",
        });

        await uma.createFile({
          path: "members.js",
          content: "week1/prs/cli-setup/cli.js",
          branch: "setup-cli",
        });

        await uma.createFile({
          path: "package.json",
          content: "week1/prs/cli-setup/package.json",
          branch: "setup-cli",
        });

        return uma.createPullRequest({
          from: "setup-cli",
          to: "main",
          title: "Set up repo",
          body: `week1/prs/cli-setup/description.md?issueNumber=${state.hooks.listCommandIssue.number}`,
          reviewers: [uma.username],
        });
      }
    ),
  },
  {
    id: "listCommandCardComment",
    hook: on.uma(
      "pull_request.opened",
      (event, state) => event.pull_request.id === state.hooks.cliPr.id,
      async (uma, state) => {
        await uma.createIssueComment({
          issueNumber: state.hooks.storeDataIssue.number,
          body: `./week1/tasks/list-command-comment.md?prNumber=${state.hooks.cliPr.number}`,
        });
      }
    ),
  },
];
