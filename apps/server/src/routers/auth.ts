import { Router } from "express";
import querystring from "querystring";
import { createOAuthUserAuth } from "@octokit/auth-oauth-user";
import { getUserOctokit } from "../utils";
import * as config from "../config";

export const auth = Router();

auth.get("/login", async (_, res) => {
  const params = querystring.stringify({
    client_id: config.bots.root.GITHUB_CLIENT_ID,
    redirect_uri: `${config.HOST}/auth/login/cb`,
  });
  const url = `https://github.com/login/oauth/authorize?${params}`;
  res.redirect(url);
});

auth.get("/login/cb", async (req, res, next) => {
  try {
    const authorise = createOAuthUserAuth({
      clientId: config.bots.root.GITHUB_CLIENT_ID,
      clientSecret: config.bots.root.GITHUB_CLIENT_SECRET,
      code: req.query.code as string,
    });

    const auth = await authorise();
    const userOctokit = getUserOctokit(auth);
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

auth.get("/install/:bot", (req, res) => {
  const botName = req.params.bot;
  const botConfig = config.bots[botName as keyof typeof config.bots];

  if (!botConfig) {
    res.sendStatus(404);
    return;
  }

  const installUrl = `https://github.com/apps/${botConfig.NAME}/installations/new`;
  res.redirect(installUrl);
});

auth.get("/install/:bot/cb", async (req, res, next) => {
  const installationId = Number(req.query.installation_id);
  if (!Number.isInteger(installationId)) return;

  const botName = req.params.bot;
  const botConfig = config.bots[botName as keyof typeof config.bots];

  if (!botConfig) {
    res.sendStatus(400);
    return;
  }

  req.session!.bots = {
    ...req.session!.bots,
    [botName]: installationId,
  };

  res.redirect("/");
});
