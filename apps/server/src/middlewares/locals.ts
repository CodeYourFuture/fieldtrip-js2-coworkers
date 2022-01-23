import { RequestHandler } from "express";

export const locals: RequestHandler = (req, res, next) => {
  req.locals = {
    repo: "js2",
    user: null,
    bots: {},
    enrollment: null,
    meta: { triggers: [] },
  };
  next();
};
