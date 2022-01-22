import { Probot } from "probot";
import { createProbot } from "../utils";
import { bots } from "../config";
import {
  isRepo,
  createIssue,
  createProject,
  createProjectColumn,
  createProjectCard,
} from "../utils/octokit";
import type { Context } from "../utils/octokit";

const actions = {
  setup: async (context: Context) => {
    const project = await createProject({
      context,
      name: "Co-worker tools",
      body: "A collection of tools for co-workers",
    });

    const columnNames = ["Todo", "In progress", "Blocked", "Done"];

    const [todoCol] = await Promise.all(
      columnNames.map((columnName) =>
        createProjectColumn({
          context,
          projectId: project.data.id,
          name: columnName,
        })
      )
    );

    const cardIssue = await createIssue({
      context,
      title: "Do some work",
      body: "Details",
    });

    await createProjectCard({
      context,
      columnId: todoCol.data.id,
      issueNumber: cardIssue.data.id,
    });

    await createIssue({
      context,
      title: "Introducing your product owner",
      body: "week1/malachi/intro.md",
    });
  },
};

export const app = (app: Probot) => {
  app.on(["installation_repositories.added"], async (context) => {
    if (!isRepo(context)) return;
    await actions.setup(context);
  });

  app.on(["installation.created"], async (context) => {
    if (!isRepo(context)) return;
    await actions.setup(context);
  });
};

export const instance = createProbot(bots.malachi);
export const config = bots.malachi;
