import * as bots from "../bots";
import type { Probot } from "probot";
import { OAuthAppAuthentication } from "@octokit/auth-oauth-user";
import { getUserOctokit } from "../utils";

type User = {
  octokit: ReturnType<typeof getUserOctokit>;
  [key: string]: any;
};

type Bots = typeof bots;

declare global {
  namespace Express {
    interface Request {
      locals: {
        user: User | null;
        bots:
          | {
              [botName in keyof Bots]?: {
                octokit: Awaited<ReturnType<Probot["auth"]>>;
                installationId: number;
              };
            };
      };
      session: {
        user?: {
          id: number;
          login: string;
          auth: OAuthAppAuthentication;
        };
        bots?: {
          [botName in keyof Bots]?: number;
        };
      };
    }
  }
}
