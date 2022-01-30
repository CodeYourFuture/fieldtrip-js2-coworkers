import { RequestHandler } from "express";
import { Store } from "../utils/store";

export const store: RequestHandler = async (req, res, next) => {
  const { user, course } = req.locals;
  if (!user) return next();
  if (!course) return next();
  const store = new Store({ owner: user.login, repo: course.repo });
  store.set("installedBots", Object.keys(req.locals.bots));
  req.locals.store = store;
  next();
};
