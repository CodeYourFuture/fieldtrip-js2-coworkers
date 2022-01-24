import type { RequestHandler } from "express";
import { ProbotOctokit } from "probot";

export const userSession: RequestHandler = async (req, _, next) => {
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
      delete req.session.user;
    }
  }

  next();
};
