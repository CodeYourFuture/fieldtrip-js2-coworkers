import { ProbotOctokit } from "probot";
import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import type { Probot } from "probot";
import type { Bots } from "./";

export type AuthenticatedLocals = Locals & {
  user: NonNullable<Locals["user"]>;
};

export type Locals = {
  user: User | null;
  bots:
    | {
        [botName in keyof Bots]?: {
          octokit: Awaited<ReturnType<Probot["auth"]>>;
          installationId: number;
        };
      };
};

export type User = {
  octokit: InstanceType<typeof ProbotOctokit>;
} & RestEndpointMethodTypes["users"]["getAuthenticated"]["response"]["data"];
