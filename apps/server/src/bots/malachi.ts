import { Probot } from "probot";
import { emitter } from "../emitter";
import { Event, Course, Metadata, createProbot } from "../utils";
import { course, actions, repo } from "../course";
import { bots } from "../config";

export const app = (app: Probot) => {
  app.on(
    ["installation_repositories.added", "installation.created"],
    async (context) => {
      const event = new Event(context, repo);
      if (event.shouldBeIgnored) return;
      // @todo await repo creation (I think there might be a race condition here)
      await actions.malachi.setup(event);
    }
  );

  const triggerActions = Course.getTriggers(course);
  for (const action of triggerActions) {
    const { event, handler } = action.passed;
    app.on(event as any, async (context) => {
      if (context.payload.repository.name !== repo) return;

      const passed = (handler as any)(context.payload);
      if (!passed) return;

      const metadataIssue = {
        owner: context.payload.repository.owner.login,
        repo,
        issue_number: 1,
      };
      const metadata = new Metadata(context.octokit, metadataIssue);
      const added = await metadata.add("triggers", action.id);

      if (added) {
        emitter.emit("clientUpdate", {
          type: "trigger:passed",
          username: context.payload.sender.login,
          repo,
          actionId: action.id,
        });
      }
    });
  }
};

export const instance = createProbot(bots.malachi);
export const config = bots.malachi;
