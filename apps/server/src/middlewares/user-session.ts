import { getUserOctokit } from "../utils";
import type { RequestHandler } from "express";

export const userSession: RequestHandler = async (req, _, next) => {
  req.locals = { user: null, bots: {} };

  if (req.session.user?.auth) {
    const { auth } = req.session.user;
    try {
      const octokit = getUserOctokit(auth);
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
