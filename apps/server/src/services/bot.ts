import { Probot } from "probot";
import courses from "@packages/courses";
import { Course } from "../services/course";
import { Github } from "../services/github";
import { db, enrollments } from "../services/db";
import { createProbot, createOrderedQueue } from "../utils";
import { bots } from "../config";
import type { Bots } from "@packages/courses/types";

// @todo get course using event payload repo
const course = courses.js2;

const triggers = Course.getHooks(course);

let i = 0;
const triggersByBotName = {} as Record<
  string,
  { priority?: number; trigger: ReturnType<typeof Course.getHooks>[number] }[]
>;
for (const trigger of triggers) {
  if (!triggersByBotName[trigger.hook.botName]) {
    triggersByBotName[trigger.hook.botName] = [];
  }
  if ("action" in trigger.hook && trigger.hook.action) {
    triggersByBotName[trigger.hook.botName].push({
      priority: i++,
      trigger,
    });
  } else {
    triggersByBotName[trigger.hook.botName].push({ trigger });
  }
}

// @todo this queue should be moved into the persistence layer
// element may take days before they can be dequeued
const queues = new Map();

export const createBot = (botName: Bots) => {
  const botTriggers = triggersByBotName[botName];

  const app = (app: Probot) => {
    if (!botTriggers) return;

    for (const botTrigger of botTriggers) {
      const { trigger, priority } = botTrigger;
      const { event, predicate } = trigger.hook;
      const action = "action" in trigger.hook ? trigger.hook.action : null;
      console.log(trigger, priority);

      app.on(event as any, async (context) => {
        console.log(botName, event);
        const github = new Github(context, course.repo);
        if (github.eventShouldBeIgnored) return;

        const primaryKey = {
          username: github.repo().owner,
          course_id: course.id,
        };

        const queueKey = JSON.stringify(primaryKey);

        if (!queues.has(queueKey)) {
          queues.set(queueKey, createOrderedQueue());
        }

        const queue = queues.get(queueKey);

        const state = await enrollments(db).findOneRequired(primaryKey);

        if (state.milestones.includes(trigger.id)) return;

        let passed;
        try {
          passed = predicate(context.payload, state, github);
        } catch (err) {
          passed = false;
        }

        if (!passed) return;

        if (action) {
          await queue.add(
            async () => {
              console.log(`Executing ${trigger.id}`);
              const latestState = await enrollments(db).findOneRequired(
                primaryKey
              );
              const result = await action(github, latestState);
              // @todo replace this with jsonb_set query
              await enrollments(db).update(primaryKey, {
                hooks: { ...latestState.hooks, [trigger.id]: result },
              });
            },
            { priority }
          );
        }

        // @todo replace this with jsonb_set query
        await queue.add(async () => {
          const latestState = await enrollments(db).findOneRequired(primaryKey);
          await enrollments(db).update(primaryKey, {
            milestones: [...latestState.milestones, trigger.id],
          });
        });
      });
    }
  };

  return {
    app,
    instance: createProbot(bots[botName]),
    config: bots[botName],
  };
};
