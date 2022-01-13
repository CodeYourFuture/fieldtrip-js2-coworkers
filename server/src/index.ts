import { ApplicationFunctionOptions, Probot, run } from "probot";
import { api } from "./api";
import { probot } from "./probot";
import { webapp } from "./webapp";

export const server = (
  app: Probot,
  { getRouter }: ApplicationFunctionOptions
) => {
  const apiRouter = getRouter!("/api");
  const appRouter = getRouter!("/");

  probot(app);
  api(apiRouter, app);
  webapp(appRouter);
};

run(server);
