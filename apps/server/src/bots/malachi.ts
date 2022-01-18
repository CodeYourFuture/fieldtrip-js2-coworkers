import { Probot } from "probot";

export const malachi = (app: Probot) => {
  app.on(["installation", "installation_repositories"], async (context) => {
    context.log(context);
  });
};
