import { Probot } from "probot";
import { createProbot } from "../utils";
import { bots } from "../config";
import { isRepo, createIssue } from "../utils/octokit";
import type { Context } from "../utils/octokit";

const issues = {
  create: {
    intro: (context: Context) =>
      createIssue({
        context,
        title: "Introducing your product owner",
        filePath: "week1/malachi/intro.md",
      }),
  },
};

export const app = (app: Probot) => {
  app.on(["installation_repositories.added"], async (context) => {
    if (!isRepo(context)) return;
    await issues.create.intro(context);
  });

  app.on(["installation.created"], async (context) => {
    if (!isRepo(context)) return;
    await issues.create.intro(context);
  });
};

export const instance = createProbot(bots.malachi);
export const config = bots.malachi;
