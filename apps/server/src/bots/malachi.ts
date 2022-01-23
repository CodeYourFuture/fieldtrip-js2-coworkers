import { Probot } from "probot";
import { Course, createProbot } from "../utils";
import { bots } from "../config";
import { Event, metadata } from "../utils";
import { actions, repo, triggers } from "../course";

export const app = (app: Probot) => {
  app.on(
    ["installation_repositories.added", "installation.created"],
    async (context) => {
      const event = new Event(context, repo);
      if (event.shouldBeIgnored) return;
      await actions.malachi.setup(event);
    }
  );

  for (const [eventName, handler] of Object.entries(triggers)) {
    app.on(eventName as any, async (context) => {
      if (context.payload.repository.name !== repo) return;

      const passed = (handler as any)(context.payload);
      if (!passed) return;

      const kv = await metadata(context.octokit, {
        owner: context.payload.repository.owner.login,
        repo,
        issue_number: 1,
      });

      const triggerValue = Course.createTriggerKey(eventName, handler);
      await kv.push("triggers", triggerValue);
    });
  }
};

export const instance = createProbot(bots.malachi);
export const config = bots.malachi;
