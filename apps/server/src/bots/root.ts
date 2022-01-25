import { Probot } from "probot";
import { emitter } from "../emitter";
import { Course, Metadata, createProbot } from "../utils";
import { course, repo } from "../course";
import { bots } from "../config";

export const instance = createProbot(bots.root);
export const config = bots.root;

export const app = (app: Probot) => {
  const triggerActions = Course.getTriggers(course);

  for (const action of triggerActions) {
    const { event, handler } = action.passed;

    app.on(event as any, async (context) => {
      if (context.repo().repo !== repo) return;

      const passed = (handler as any)(context.payload);
      if (!passed) return;

      const metadata = new Metadata(
        context.octokit,
        context.issue({ issue_number: 1 })
      );

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
