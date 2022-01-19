import * as bots from "../bots";
import type { RequestHandler } from "express";

type Bots = typeof bots;

export const botSessions: RequestHandler = async (req, _, next) => {
  // Only authorise bots if the user is logged in
  if (!req.locals.user) return next();

  const botNames = Object.keys(bots) as (keyof Bots)[];
  const botSessions = Object.entries(req.session.bots || {}) as [
    keyof Bots,
    number
  ][];

  // Authorised bots with an installation ID in the session
  for (const [botName, installationId] of botSessions) {
    const bot = bots[botName];
    try {
      const authedBot = await bot.instance.auth();
      req.locals.bots[botName] = {
        octokit: authedBot,
        installationId,
      };
    } catch {
      delete req.session.bots![botName];
    }
  }

  for (const botName of botNames) {
    if (req.locals.bots[botName]) continue;

    // Check user doesn't have bot installed i.e. if session for bot is missing
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

  // At some point I'll need to check the bot is installed in the correct repo
  // GET /repos/{owner}/{repo}/installation should hopefully work
  // For now we can just assume users are installing the bot in the correct repo

  next();
};
