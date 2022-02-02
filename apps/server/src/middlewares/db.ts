import { RequestHandler } from "express";

export const db: RequestHandler = async (req, res, next) => {
  const { user, course } = req.locals;
  if (!user) return next();
  if (!course) return next();

  req.locals.enrollmentKey = { username: user.login, course_id: course.id };

  next();
};
