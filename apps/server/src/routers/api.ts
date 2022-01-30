import courses from "@packages/courses";
import { Router } from "express";
import { Course, Store } from "../services";

export const api = Router();

api.get("/user", async (req, res) => {
  const { user } = req.locals;
  if (!user) {
    res.sendStatus(401);
  } else {
    res.json({
      login: user.login,
      avatar_url: user.avatar_url,
    });
  }
});

api.get("/courses", async (req, res) => {
  res.json(Object.keys(courses));
});

api.get("/courses/:id", async (req, res, next) => {
  const courseConfig = req.locals.course;
  if (!courseConfig) return res.send(404);
  try {
    const storeData = await req.locals.store?.getAll();
    const course = new Course(courseConfig, storeData);
    const compiledCourse = await course.compile();
    res.send(compiledCourse);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

api.post("/courses/:id", async (req, res, next) => {
  const { user, course } = req.locals;

  if (!user) return res.send(403);
  if (!course) return res.send(404);

  const store = new Store({
    repo: course.repo,
    owner: user.login,
  });

  try {
    const { data: repo } = await user.octokit.request("POST /user/repos", {
      name: course.repo,
      auto_init: true,
    });

    await store.init({
      courseId: req.params.id,
      passed: [],
      installedBots: [],
      enrollment: {
        username: user.login,
        repoUrl: repo.html_url,
      },
      hooks: {},
    });

    res.sendStatus(201);
  } catch (err) {
    // if this fails it could mean:
    // a) repo already exists
    // b) user uninstall the root app, but didn't revoke its oauth privileges
    // c) the store did not initilise
    next(err);
  }
});

api.delete("/courses/:id", async (req, res, next) => {
  const { user, course } = req.locals;
  if (!user) return res.send(403);
  if (!course) return res.send(400);
  try {
    await user.octokit.request("DELETE /repos/{username}/{name}", {
      username: user.login,
      name: course.repo,
    });
    await req.locals.store.set("enrollment", null);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});
