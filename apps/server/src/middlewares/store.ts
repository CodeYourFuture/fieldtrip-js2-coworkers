import { RequestHandler } from "express";
import { Store } from "../services";

export const store: RequestHandler = async (req, res, next) => {
  const { user, course } = req.locals;
  if (!user) return next();
  if (!course) return next();

  const store = new Store({ owner: user.login, repo: course.repo });
  const storeInitialised = await store.wasInitialised();

  if (!storeInitialised) {
    // @todo also check if repo already exists
    await store.init({
      courseId: req.params.id,
      passed: [],
      installedBots: [],
      enrollment: null,
      hooks: {},
    });
  }

  req.locals.store = store;

  next();
};
