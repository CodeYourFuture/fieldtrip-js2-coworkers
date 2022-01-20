import type { RequestHandler } from "express";
import { ProbotOctokit } from "probot";

export const userSession: RequestHandler = async (req, _, next) => {
  req.locals = { user: null, bots: {} };

  if (req.session.user?.auth) {
    const { auth } = req.session.user;
    try {
      const octokit = new ProbotOctokit({ auth });
      const user = await octokit.users.getAuthenticated();
      req.locals.user = {
        ...user.data,
        octokit,
      };
    } catch (err) {
      console.log("User credentials expired");
      delete req.session.user;
    }
  }

  next();
};
