import { Probot } from "probot";

export const amber = (app: Probot) => {
  app.on(["installation", "installation_repositories"], async (context) => {
    context.log(context);
  });
};