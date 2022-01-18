import { Probot } from "probot";
import { Router } from "express";
import { createOAuthUserAuth } from "@octokit/auth-oauth-user";
import { getUserOctokit } from "../utils";
import * as config from "../config";

const installUrl = `https://github.com/apps/${config.GH_APP_NAME}/installations/new`;

export const auth = (router: Router, app: Probot) => {
  router.get("/login", async (_, res) => {
    res.redirect(installUrl);
  });

  router.get("/login/cb", async (req, res, next) => {
    try {
      const authorise = createOAuthUserAuth({
        clientId: config.GH_APP_CLIENT_ID!,
        clientSecret: config.GH_APP_CLIENT_SECRET!,
        code: req.query.code as string,
      });

      const auth = await authorise();
      const userOctokit = getUserOctokit(auth, app);
      const user = await userOctokit.users.getAuthenticated();

      req.session!.user = {
        id: user.data.id,
        login: user.data.login,
        auth: auth,
      };

      res.redirect("/");
    } catch (err: any) {
      next(err);
    }
  });
};
