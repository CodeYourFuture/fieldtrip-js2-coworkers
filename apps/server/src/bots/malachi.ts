import { Probot } from "probot";
import { createProbot } from "../utils";
import { bots } from "../config";
import { isRepo, createIssue, createProject } from "../utils/octokit";
import type { Context } from "../utils/octokit";

const actions = {
  setup: async (context: Context) => {
    const [issue, project] = await Promise.all([
      createIssue({
        context,
        title: "Introducing your product owner",
        filePath: "week1/malachi/intro.md",
      }),
      createProject({
        context,
        name: "Co-worker tools",
        body: "A collection of tools for co-workers",
      }),
    ]);
    context.log(project);
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
