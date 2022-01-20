import { ProbotOctokit } from "probot";
import type { Probot } from "probot";
import type { Bots } from "./";

export type User = {
  octokit: InstanceType<typeof ProbotOctokit>;
  [key: string]: any;
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
