import { Probot } from "probot";
import { createProbot } from "../utils";
import { bots } from "../config";

export const app = (app: Probot) => {
  app.on(["installation", "installation_repositories"], async (context) => {
    context.log("Amber installed");
  });
};

export const instance = createProbot(bots.amber);
export const config = bots.amber;
