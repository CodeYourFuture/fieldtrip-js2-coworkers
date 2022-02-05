import * as bots from "../services/bots";
import type { RequestHandler } from "express";
import { enrollments, db } from "../services/db";
import { Bots } from "../types";
import { getInstallationId } from "../utils";

const botNames = Object.keys(bots) as Bots[];

export const botSessions: RequestHandler = async (req, _, next) => {
  // Only authorise bots if the user is logged in
  if (!req.locals.user) return next();

  // Authorised bots with an installation ID in the session
  for (const botName of botNames) {
    const bot = bots[botName];

    try {
      const installationId = await getInstallationId(
        bot.instance,
        req.locals.user.login
      );

      const authedBot = await bot.instance.auth(installationId);

      req.locals.bots[botName] = {
        octokit: authedBot,
        installationId,
      };

      req.session!.bots = {
        ...req.session!.bots,
        [botName]: installationId,
      };
    } catch {
      delete req.session.bots![botName];
      delete req.locals.bots![botName];
    }
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
