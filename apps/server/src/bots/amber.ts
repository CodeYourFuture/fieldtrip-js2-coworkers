import { Probot } from "probot";

export const amber = (app: Probot) => {
  app.on(["*"], async (context) => {
    context.log(context);
  });
  app.on(["installation", "installation_repositories"], async (context) => {
    context.log(context);
  });
};
