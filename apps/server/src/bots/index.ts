import { Probot } from "probot";
import PQueue from "p-queue";
import courses from "@packages/courses";
import type { Bots } from "@packages/courses/types";
import { Course, Store, createProbot, Bot } from "../utils";
import { bots } from "../config";

const course = courses.js2;
const repo = "js2";

const hooks = Course.getHooks(course);
const hooksByBotName = hooks.reduce((acc, hook) => {
  if (!acc[hook.hook.botName]) acc[hook.hook.botName] = [];
  acc[hook.hook.botName].push(hook);
  return acc;
}, {} as Record<string, ReturnType<typeof Course.getHooks>>);

const createBot = (botName: Bots) => {
  const botHooks = hooksByBotName[botName];
  const q = new PQueue({ concurrency: 1 });

  const app = (app: Probot) => {
    if (!botHooks) return;

    for (const hook of botHooks) {
      const { event, predicate, action } = hook.hook;

      app.on(event as any, async (context) => {
        const bot = new Bot(context, repo);
        if (bot.eventShouldBeIgnored) return;
        const store = new Store(context.repo());
        const state = await store.getAll();

        const passed = predicate(context.payload, state, bot);
        if (!passed) return;

        if (!action) {
          await store.add("passed", hook.id);
        } else {
          await q.add(async () => {
            const result = await action(bot, await store.getAll());
            await store.set(["hooks", hook.id], result);
          });
        }
      });
    }
  };

  return {
    app,
    instance: createProbot(bots[botName]),
    config: bots[botName],
  };
};

export const cyf = createBot("cyf");
export const malachi = createBot("malachi");
export const uma = createBot("uma");
export const amber = createBot("amber");
