import type { Probot } from "probot";
import type { Bots } from "./";
import { getUserOctokit } from "../utils";

export type User = {
  octokit: ReturnType<typeof getUserOctokit>;
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
