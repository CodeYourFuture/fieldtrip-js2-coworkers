import { Probot } from "probot";
import { Router } from "express";
import querystring from "querystring";
import { createOAuthUserAuth } from "@octokit/auth-oauth-user";
import { getUserOctokit } from "../utils";
import * as config from "../config";

export const auth = (router: Router, app: Probot) => {
  router.get("/login", async (_, res) => {
    const params = querystring.stringify({
      client_id: config.GH_APP_CLIENT_ID,
      redirect_uri: `${config.PROXY_URL}/auth/login/cb`,
    });
    const url = `https://github.com/login/oauth/authorize?${params}`;
    res.redirect(url);
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
