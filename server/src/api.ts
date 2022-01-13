import { Probot, ProbotOctokit } from "probot";
import { Router } from "express";
import cookieSession from "cookie-session";
import querystring from "querystring";
import Keygrip from "keygrip";
import { createOAuthUserAuth } from "@octokit/auth-oauth-user";
import type { OAuthAppAuthentication } from "@octokit/auth-oauth-user";

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, PROXY_URL } = process.env;
const SESSION_KEYS = [process.env.SESSION_KEY1!, process.env.SESSION_KEY2!];

function getUserOctokit(auth: OAuthAppAuthentication, app: Probot) {
  return new ProbotOctokit({
    auth: auth,
    log: app.log.child({ name: "user" }),
  });
}

export const api = (router: Router, app: Probot) => {
  router.use(
    cookieSession({
      name: "session",
      keys: new Keygrip(SESSION_KEYS, "SHA384", "base64"),
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    })
  );

  router.get("/user", async (req, res) => {
    let user = null;

    if (req.session?.user?.auth) {
      const { auth } = req.session.user;
      try {
        const userOctokit = getUserOctokit(auth, app);
        user = await userOctokit.users.getAuthenticated();
      } catch {}
    }

    res.json(user);
  });

  router.get("/whoami", async (_, res) => {
    const octokit = await app.auth();
    const { data } = await octokit.apps.getAuthenticated();
    res.json(data);
  });

  router.get("/login", async (_, res) => {
    const params = querystring.stringify({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: `${PROXY_URL}/app/login/cb`,
    });
    const url = `https://github.com/login/oauth/authorize?${params}`;
    res.redirect(url);
  });

  router.get("/login/cb", async (req, res) => {
    const authorise = createOAuthUserAuth({
      clientId: GITHUB_CLIENT_ID!,
      clientSecret: GITHUB_CLIENT_SECRET!,
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
  });
};
