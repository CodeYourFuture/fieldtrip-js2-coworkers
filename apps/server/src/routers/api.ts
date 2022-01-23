import { Router } from "express";
import { Course } from "../utils";
import courses from "@packages/courses";

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

api.get("/courses/:id", async (req, res) => {
  const { user } = req.locals;
  const courseConfig = courses[req.params.id as keyof typeof courses];
  const course = new Course(courseConfig, req.locals);

  if (!courseConfig) {
    return res.status(404).send("Course not found");
  }

  if (!user) {
    const courseMeta = await course.compileMeta();
    return res.send({ ...courseMeta, enrollment: null });
  }

  try {
    const repo = await user.octokit.request("GET /repos/{username}/{name}", {
      username: user.login,
      name: req.params.id,
    });
    req.locals.enrollment = {
      repoUrl: repo.data.html_url,
    };
  } catch (err) {
    const courseMeta = await course.compileMeta();
    return res.send({ ...courseMeta, enrollment: null });
  }

  const courseEnrolled = course.compile();

  res.send({ ...courseEnrolled, enrollment: req.locals.enrollment });
});

api.post("/courses/:id", async (req, res, next) => {
  const { user } = req.locals;
  if (!user) return res.send(403);
  try {
    await user.octokit.request("POST /user/repos", {
      name: req.params.id,
    });
    res.sendStatus(201);
  } catch (err) {
    // if this fails it could mean:
    // a) repo already exists
    // b) user uninstall the root app, but didn't revoke its oauth privileges
    next(err);
  }
});

api.delete("/courses/:id", async (req, res, next) => {
  const { user } = req.locals;
  if (!user) return res.send(403);
  try {
    await user.octokit.request("DELETE /repos/{username}/{name}", {
      username: user.login,
      name: req.params.id,
    });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});
