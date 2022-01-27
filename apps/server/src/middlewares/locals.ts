import { RequestHandler } from "express";
import { Store } from "../utils";

export const locals: RequestHandler = (req, res, next) => {
  req.locals = {
    repo: "js2",
    user: null,
    bots: {},
    store: null,
  };
  next();
};
