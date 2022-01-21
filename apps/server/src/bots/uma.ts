import { Probot } from "probot";
import { createProbot } from "../utils";
import { bots } from "../config";

export const app = (app: Probot) => {
  app.on(["installation", "installation_repositories"], async (context) => {
    console.log("Uma installed");
  });
};

export const instance = createProbot(bots.uma);
export const config = bots.uma;
