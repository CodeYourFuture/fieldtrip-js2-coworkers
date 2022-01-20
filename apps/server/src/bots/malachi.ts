import { Probot } from "probot";
import { createProbot } from "../utils";
import * as config from "../config";

const events = [
  {
    type: "bot_installed",
    action: {
      type: "create_issue",
      payload: {
        title: "Introducing your product owner",
        body: "./week1/malachi/intro-issue.md",
      },
    },
  },
];

const getAction = (action: { type: string; payload: any }, context: any) => {
  switch (action.type) {
    case "create_issue":
      return context.octokit.issues.create({
        owner: context.payload.installation.account.login,
        repo: "js2",
        title: action.payload.title,
        body: action.payload.body,
      });
    default:
      return undefined;
  }
};

export const app = (app: Probot) => {
  for (const event of events) {
    if (event.type === "bot_installed") {
      app.on("installation_repositories.added", async (context) => {
        const { repositories_added } = context.payload;
        const selectedRepo = repositories_added.find(
          (repo) => repo.name === "js2"
        );
        if (!selectedRepo) return;
        const action = getAction(event.action, context);
        await action();
      });
      app.on("installation.created", async (context) => {
        const { repositories } = context.payload;
        const selectedRepo = repositories.find((repo) => repo.name === "js2");
        if (!selectedRepo) return;
        const action = getAction(event.action, context);
        await action();
      });
    }
  }
};

export const instance = createProbot(config.bots.malachi);
