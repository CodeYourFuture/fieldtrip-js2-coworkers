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

const hooks = Course.getHooks(course);
const hooksByBotName = hooks.reduce((acc, hook) => {
  if (!acc[hook.hook.botName]) acc[hook.hook.botName] = [];
  acc[hook.hook.botName].push(hook);
  return acc;
}, {} as Record<string, ReturnType<typeof Course.getHooks>>);

// @todo this queue should be moved into the persistence layer
// element may take days before they can be dequeued
const queues = new Map();

export const createBot = (botName: Bots) => {
  const botHooks = hooksByBotName[botName];

  const app = (app: Probot) => {
    if (!botHooks) return;

    for (let i = 0; i < botHooks.length; i++) {
      const hook = botHooks[i];
      const { event, predicate, action } = hook.hook;

      app.on(event as any, async (context) => {
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

        if (state.milestones.includes(hook.id)) return;

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
              console.log(`Executing ${hook.id}`);
              const latestState = await enrollments(db).findOneRequired(
                primaryKey
              );
              const result = await action(github, latestState);
              // @todo replace this with jsonb_set query
              await enrollments(db).update(primaryKey, {
                hooks: { ...latestState.hooks, [hook.id]: result },
              });
            },
            { priority: i }
          );
        }

        // @todo replace this with jsonb_set query
        await queue.add(async () => {
          const latestState = await enrollments(db).findOneRequired(primaryKey);
          await enrollments(db).update(primaryKey, {
            milestones: [...latestState.milestones, hook.id],
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
