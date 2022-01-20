import { Probot } from "probot";
import { createProbot } from "../utils";
import * as config from "../config";

export const app = (app: Probot) => {
  app.on(["installation", "installation_repositories"], async (context) => {
    console.log("Uma installed");
  });
};

export const instance = createProbot(config.bots.uma);
