import { Router } from "express";
import { compileCourse } from "../utils";
import courses from "@packages/courses";

export const api = Router();

api.get("/user", async (req, res) => {
  const { user } = req.locals;
  if (!user) {
    res.send(null);
    return;
  }
  res.json({
    login: user.login,
    avatar_url: user.avatar_url,
  });
});

api.get("/courses", async (req, res) => {
  res.json(Object.keys(courses));
});

api.get("/courses/:id", async (req, res) => {
  const { user } = req.locals;
  const courseConfig = courses[req.params.id];

  if (!courseConfig) {
    res.status(404).send("Course not found");
    return;
  }

  if (!user) {
    const courseMeta = await compileCourse(courseConfig);
    res.send(courseMeta);
    return;
  }

  const repo = await user.octokit
    .request("GET /repos/{username}/{name}", {
      username: user.login,
      name: req.params.id,
    })
    .catch((err: any) => err);

  const courseLoggedIn = {
    ...(await compileCourse(courseConfig)),
    active: repo.status === 200,
  };

  res.send(courseLoggedIn);
});

api.post("/courses/:id", async (req, res, next) => {
  const { user } = req.locals;
  if (!user) return res.send(403);
  try {
    await user.octokit.request("POST /user/repos", {
      name: req.params.id,
    });

    const status = {
      id: req.params.id,
      active: true,
    };

    res.status(201).send({ status });
  } catch (err) {
    next(err);
  }
});
