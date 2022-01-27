import { RequestHandler } from "express";
import { Store } from "../utils/store";

export const store: RequestHandler = async (req, res, next) => {
  const { bots, user, repo } = req.locals;
  if (!user) return next();
  const store = new Store({ owner: user.login, repo });
  store.set("installedBots", Object.keys(req.locals.bots));
  req.locals.store = store;
  next();
};
