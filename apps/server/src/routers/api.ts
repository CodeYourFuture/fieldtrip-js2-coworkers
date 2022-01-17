import { Probot } from "probot";
import { Router } from "express";
import { getUserOctokit } from "../util";

export const api = (router: Router, app: Probot) => {
  router.get("/user", async (req, res) => {
    let user = null;

    if (req.session?.user?.auth) {
      const { auth } = req.session.user;
      try {
        const userOctokit = getUserOctokit(auth, app);
        user = await userOctokit.users.getAuthenticated();
      } catch {}
    }

    res.json(user?.data);
  });

  router.get("/whoami", async (_, res) => {
    const octokit = await app.auth();
    const { data } = await octokit.apps.getAuthenticated();
    res.json(data);
  });

  router.get("/ping", async (_, res) => {
    app.receive({
      id: "test-ping",
      name: "ping",
      payload: "test payload",
    });

    res.send(200);
  });
};
