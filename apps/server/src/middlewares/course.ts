import { RequestHandler } from "express";
import courses from "@packages/courses";

export const course: RequestHandler = (req, res, next) => {
  const id = req.params.id;
  if (id) {
    req.locals.course = courses[id];
  }
  next();
};
