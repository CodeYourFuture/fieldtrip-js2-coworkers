import { ApplicationFunctionOptions, Probot, run } from "probot";
import { webapp } from "./webapp";
import { probot } from "./probot";

export const server = (
  app: Probot,
  { getRouter }: ApplicationFunctionOptions
) => {
  const router = getRouter!("/probot");

  probot(app);
  webapp(router);
};

run(server);
