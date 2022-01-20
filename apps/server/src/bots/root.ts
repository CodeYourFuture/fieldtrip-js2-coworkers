import { Probot } from "probot";
import { createProbot } from "../utils";
import * as config from "../config";

export const app = (app: Probot) => {
  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    await context.octokit.issues.createComment(issueComment);
  });

  app.on(["installation", "installation_repositories"], async (context) => {
    context.log("Root installed");
  });
};

export const instance = createProbot(config.bots.root);
