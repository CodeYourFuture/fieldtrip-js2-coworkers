import { Probot } from "probot";

export const probot = (app: Probot) => {
  app.on("issues.opened", async (context) => {
    const issueComment = context.issue({
      body: "Thanks for opening this issue!",
    });
    await context.octokit.issues.createComment(issueComment);
  });
  app.on(["installation", "installation_repositories"], async (context) => {
    context.log(context);
  });
};