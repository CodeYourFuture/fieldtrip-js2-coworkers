import { Probot } from "probot";
import { createProbot } from "../utils";
import * as config from "../config";

export const app = (app: Probot) => {
  app.on(["installation", "installation_repositories"], async (context) => {
    context.log(context);
  });
};

export const instance = createProbot(config.bots.amber);
