import { Probot, ProbotOctokit } from "probot";
import type { OAuthAppAuthentication } from "@octokit/auth-oauth-user";

export function getUserOctokit(auth: OAuthAppAuthentication, app: Probot) {
  return new ProbotOctokit({
    auth: auth,
    log: app.log.child({ name: "user" }),
  });
}
