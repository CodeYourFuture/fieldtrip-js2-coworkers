import type { OAuthAppAuthentication } from "@octokit/auth-oauth-user";
import type { Bots } from "./";

export type Session = {
  user?: {
    id: number;
    login: string;
    auth: OAuthAppAuthentication;
  };
  bots?: {
    [botName in keyof Bots]?: number;
  };
};
