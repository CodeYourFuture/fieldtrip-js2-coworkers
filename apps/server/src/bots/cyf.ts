import { Probot } from "probot";
import { Course, Store, createProbot } from "../utils";
import { course, repo } from "../course";
import { bots } from "../config";

export const instance = createProbot(bots.cyf);
export const config = bots.cyf;

export const app = (app: Probot) => {
  const triggerActions = Course.getTriggers(course);

  for (const action of triggerActions) {
    const { event, handler } = action.passed;

    app.on(event as any, async (context) => {
      if (context.repo().repo !== repo) return;

      const store = new Store(context.repo());

      const passed = (handler as any)(context.payload);
      if (!passed) return;

      await store.add("triggers", action.id);
    });
  }
};
