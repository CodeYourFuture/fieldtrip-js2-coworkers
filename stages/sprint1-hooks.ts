import type { CourseHook } from "@notation/fieldtrip";
import { on } from "@notation/fieldtrip";

export const sprint1Hooks: CourseHook[] = [
  {
    id: "malachiIntro",
    hook: on.malachi(
      ["installation_repositories.added", "installation.created"],
      () => true,
      (malachi) => {
        return malachi.createIssue({
          title: "Introducing your product owner",
          body: "sprint1/issues/malachi-intro.md",
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
          name: "Coworker tools",
          body: "A collection of tools for coworkers",
        });

        const columnNames = {
          todo: "Todo",
          doing: "In Progress",
          review: "Review/QA",
          blocked: "Blocked",
          done: "Done",
        };

        const columns = {} as { [key: string]: any };

        for (const [key, label] of Object.entries(columnNames)) {
          columns[key] = await malachi.createProjectColumn({
            projectId: project.id,
            name: label,
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
    id: "setupIssue",
    hook: on.malachi(
      ["installation_repositories.added", "installation.created"],
      () => true,
      async (malachi) => {
        return malachi.createIssue({
          title: "Set up repo (Uma)",
          body: "./sprint1/tasks/set-up-repo.md",
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
    id: "storeDataIssue",
    hook: on.malachi(
      ["installation_repositories.added", "installation.created"],
      () => true,
      (malachi) => {
        return malachi.createIssue({
          title: "Store member data for use in digital tools",
          body: "./sprint1/tasks/store-data.md",
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
          position: "bottom",
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
          body: "./sprint1/tasks/list-command.md",
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
    id: "umaIntro",
    hook: on.uma(
      ["installation_repositories.added", "installation.created"],
      () => true,
      (uma) => {
        return uma.createIssue({
          title: "Introducing your technical lead",
          body: "sprint1/issues/uma-intro.md",
        });
      }
    ),
  },
  {
    id: "storeDataCardComment",
    hook: on.uma(
      ["installation_repositories.added", "installation.created"],
      () => true,
      async (uma, state) => {
        await uma.createIssueComment({
          issueNumber: state.hooks.storeDataIssue?.number,
          body: "./sprint1/tasks/store-data-comment.md",
        });
      }
    ),
  },
  {
    id: "setupPr",
    hook: on.uma(
      ["installation_repositories.added", "installation.created"],
      () => true,
      async (uma, state) => {
        await uma.moveProjectCard({
          cardId: state.hooks.setupCard.id,
          columnId: state.hooks.board.columns.review.id,
        });

        await uma.createBranch("setup-repo");

        await uma.putFile({
          path: "README.md",
          content: "sprint1/prs/repo-setup/README.md",
          branch: "setup-repo",
        });

        await uma.putFile({
          path: "members.js",
          content: "sprint1/prs/repo-setup/members.js",
          branch: "setup-repo",
        });

        await uma.putFile({
          path: ".github/pull_request_template.md",
          content: "sprint1/prs/repo-setup/pull_request_template.md",
          branch: "setup-repo",
        });

        return uma.createPullRequest({
          from: "setup-repo",
          to: "main",
          title: "Set up repo",
          body: `sprint1/prs/repo-setup/description.md?issueNumber=${state.hooks.setupIssue?.number}`,
          reviewers: [uma.username],
        });
      }
    ),
  },
  {
    id: "moveSetupCardToDone",
    priority: 0,
    hook: on.uma(
      "pull_request.closed",
      (event, state) => event.pull_request.id === state.hooks.setupPr.id,
      (amber, state) => {
        return amber.moveProjectCard({
          cardId: state.hooks.setupCard.id,
          columnId: state.hooks.board.columns.done.id,
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
          body: "sprint1/issues/amber-intro.md",
        });
      }
    ),
  },
  {
    id: "cliPr",
    hook: on.uma(
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

        await uma.putFile({
          path: "README.md",
          content: "sprint1/prs/cli-setup/README.md",
          branch: "setup-cli",
        });

        await uma.putFile({
          path: "cli.js",
          content: "sprint1/prs/cli-setup/cli.js",
          branch: "setup-cli",
        });

        await uma.putFile({
          path: "package.json",
          content: "sprint1/prs/cli-setup/package.json",
          branch: "setup-cli",
        });

        const pr = await uma.createPullRequest({
          from: "setup-cli",
          to: "main",
          title: "Set up CLI",
          body: `sprint1/prs/cli-setup/description.md?issueNumber=${state.hooks.listCommandIssue.number}`,
          reviewers: [uma.username],
        });

        await uma.createIssueComment({
          issueNumber: state.hooks.listCommandIssue.number,
          body: `./sprint1/tasks/list-command-comment.md?prNumber=${pr.number}`,
        });

        return pr;
      }
    ),
  },
];
