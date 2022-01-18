import { ProbotOctokit } from "probot";
import type { OAuthAppAuthentication } from "@octokit/auth-oauth-user";

export function getUserOctokit(auth: OAuthAppAuthentication) {
  return new ProbotOctokit({
    auth: auth,
  });
}
