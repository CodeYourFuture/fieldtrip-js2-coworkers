import { ApplicationFunctionOptions, Probot, run } from "probot";
import { api } from "./routers/api";
import { auth } from "./routers/auth";
import { probot } from "./routers/probot";
import { webapp } from "./routers/webapp";
import { session } from "./middlewares/session";
import { probotConfig } from "./config";

export const server = (
  app: Probot,
  { getRouter }: ApplicationFunctionOptions
) => {
  const authRouter = getRouter!("/auth").use(session);
  const apiRouter = getRouter!("/api").use(session);
  const appRouter = getRouter!("/");

  probot(app);
  auth(authRouter, app);
  api(apiRouter, app);
  webapp(appRouter);
};

run(server, { env: probotConfig });
