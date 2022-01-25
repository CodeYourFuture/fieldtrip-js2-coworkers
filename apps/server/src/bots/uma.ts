import { Probot } from "probot";
import { Event, createProbot } from "../utils";
import { actions, repo } from "../course";
import { bots } from "../config";

export const app = (app: Probot) => {
  app.on(
    ["installation_repositories.added", "installation.created"],
    async (context) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const event = new Event(context, repo);
      if (event.shouldBeIgnored) return;
      await actions.uma.intro(event);
      await actions.uma.createSetupPR(event);
    }
  );
};

export const instance = createProbot(bots.uma);
export const config = bots.uma;
