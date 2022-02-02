import * as bots from "../services/bots";
import type { RequestHandler } from "express";
import { enrollments, db } from "../services/db";

type Bots = typeof bots;

export const botSessions: RequestHandler = async (req, _, next) => {
  // Only authorise bots if the user is logged in
  if (!req.locals.user) return next();

  // Object.keys does not have generic types so needs to be cast
  const botNames = Object.keys(bots) as (keyof Bots)[];
  const botSessions = Object.entries(req.session.bots || {}) as [
    keyof Bots,
    number
  ][];

  // Authorised bots with an installation ID in the session
  for (const [botName, installationId] of botSessions) {
    const bot = bots[botName];
    try {
      const authedBot = await bot.instance.auth(installationId);
      req.locals.bots[botName] = {
        octokit: authedBot,
        installationId,
      };
    } catch {
      delete req.session.bots![botName];
      delete req.locals.bots![botName];
    }
  }

  for (const botName of botNames) {
    if (req.locals.bots[botName]) continue;

    // Check users with no session if they have a previous installation we can use
    try {
      const bot = bots[botName];
      const authedBot = await bot.instance.auth();
      const res = await authedBot.request(
        "GET /users/{username}/installation",
        {
          username: req.locals.user.login,
        }
      );
      req.session!.bots = {
        ...req.session!.bots,
        [botName]: res.data.id,
      };
      req.locals.bots[botName] = {
        octokit: authedBot,
        installationId: res.data.id,
      };
    } catch {}
  }

  await enrollments(db).update(req.locals.enrollmentKey, {
    bots: Object.keys(req.locals.bots),
  });

  // At some point I'll need to check the bot is installed in the correct repo
  // GET /repos/{owner}/{repo}/installation should hopefully work
  // Or, making a request to the user repo on behalf of the bot would presumably
  // tell us by the status code whether it exists or we have access to it
  // For now we can just assume users are installing the bot in the correct repo

  next();
};
