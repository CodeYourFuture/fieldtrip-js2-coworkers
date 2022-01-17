import { Probot } from "probot";
import { Router } from "express";

export const api = (router: Router, app: Probot) => {
  router.get("/user", async (req, res) => {
    res.json(req.locals.user);
  });

  router.get("/courses/:id", async (req, res) => {
    const { user } = req.locals;
    if (!user) return res.send(403);

    const repo = await user.octokit
      .request("GET /repos/{username}/{name}", {
        username: user.login,
        name: req.params.id,
      })
      .catch((err: any) => err);

    const course = {
      active: repo.status === 200,
    };

    if (!course.active) {
      res.send(course);
      return;
    }

    res.send(course);
  });

  router.post("/courses/:id", async (req, res, next) => {
    const { user } = req.locals;
    if (!user) return res.send(403);
    try {
      const repo = await user.octokit.request("POST /user/repos", {
        name: req.params.id,
      });
      res.status(201).send(repo);
    } catch (err) {
      next(err);
    }
  });

  router.get("/ping/:id", async (req, res) => {
    app.receive({
      id: req.params.id,
      name: "ping",
      payload: req.query,
    });
    res.sendStatus(200);
  });
};
