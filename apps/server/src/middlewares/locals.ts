import { RequestHandler } from "express";

export const locals: RequestHandler = (req, res, next) => {
  req.locals = {
    course: null,
    user: null,
    bots: {},
    primaryKey: null,
  };
  next();
};
