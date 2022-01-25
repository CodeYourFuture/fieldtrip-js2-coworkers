import { Probot } from "probot";
import { Event, createProbot } from "../utils";
import { actions, repo } from "../course";
import { bots } from "../config";

export const app = (app: Probot) => {
  app.on(
    ["installation_repositories.added", "installation.created"],
    async (context) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const event = new Event(context, repo);
      if (event.shouldBeIgnored) return;
      await actions.malachi.intro(event);
      await actions.malachi.setupBoard(event);
    }
  );
};

export const instance = createProbot(bots.malachi);
export const config = bots.malachi;
