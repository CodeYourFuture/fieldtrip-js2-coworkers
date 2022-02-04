import PQueue from "p-queue";
import courses from "@packages/courses";
import { Course } from "../services/course";
import { Github } from "../services/github";
import { db, enrollments, events } from "../services/db";
import { createProbot } from "../utils";
import { bots } from "../config";
import { taskq } from "../services/taskq";
import type { Bots } from "@packages/courses/types";

// @todo get course using event payload repo
const course = courses.js2;
const triggers = Course.getHooks(course);

// @todo Make database able to handle concurrent writes (json_set)
const writeQueues = new Map();
const getWriteQueue = (enrollmentKey: any) => {
  const queueKey = JSON.stringify(enrollmentKey);

  if (!writeQueues.has(queueKey)) {
    writeQueues.set(queueKey, new PQueue({ concurrency: 1 }));
  }

  return writeQueues.get(queueKey);
};

const getActionByTriggerId = (id: string) => {
  const trigger = triggers.find((trigger) => trigger.id === id);
  return trigger && "action" in trigger.hook && trigger.hook.action;
};

type Params = {
  event: {
    trigger_id: string;
    username: string;
    course_id: string;
  };
};

export const processTrigger = taskq.handler<void, Params>(async (self) => {
  const { params } = self;
  const event = await events(db).findOneRequired(params.event);

  const { trigger_id: triggerId, course_id: courseId, username } = params.event;
  const {
    bot_name: botName,
    event_name: eventName,
    payload,
    installation_id: installationId,
  } = event;

  const action = getActionByTriggerId(triggerId);
  const bot = createProbot(bots[botName as Bots]);
  const authedBot = await bot.auth(installationId);

  const github = new Github(
    {
      octokit: authedBot,
      payload,
      name: eventName as any,
      // can assume course.repo as other repos are filtered out by the event producer
      repo: (o) => ({ repo: course.repo, owner: username, ...o }),
    },
    { targetRepo: course.repo }
  );

  const enrollmentKey = { username, course_id: courseId };
  const writeQueue = getWriteQueue(enrollmentKey);

  if (action) {
    await writeQueue.add(async () => {
      console.log(`Executing ${triggerId}`);
      const latestState = await enrollments(db).findOneRequired(enrollmentKey);
      const result = await action(github, latestState);
      await enrollments(db).update(enrollmentKey, {
        hooks: { ...latestState.hooks, [triggerId]: result },
      });
    });
  }

  await writeQueue.add(async () => {
    const latestState = await enrollments(db).findOneRequired(enrollmentKey);
    await enrollments(db).update(enrollmentKey, {
      milestones: [...latestState.milestones, triggerId],
    });
  });
});
