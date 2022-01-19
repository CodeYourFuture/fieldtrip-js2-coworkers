import { Router } from "express";
import { compileCourse } from "../utils";
import courses from "@packages/courses";

const promisedCourses = Promise.all(courses.map(compileCourse));

export const api = Router();

api.get("/user", async (req, res) => {
  res.json(req.locals.user);
});

api.get("/courses", async (req, res) => {
  res.send(await promisedCourses);
});

api.get("/courses/:id", async (req, res) => {
  const { user } = req.locals;
  if (!user) return res.send(403);

  const repo = await user.octokit
    .request("GET /repos/{username}/{name}", {
      username: user.login,
      name: req.params.id,
    })
    .catch((err: any) => err);

  const status = {
    id: req.params.id,
    active: repo.status === 200,
  };

  res.send({ status });
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
