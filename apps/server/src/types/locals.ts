import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import type { Probot } from "probot";
import type { Octokit } from "@octokit/rest";
import type { Bots } from "./";

export type Locals = {
  repo: string;
  user: User | null;
  bots: {
    [botName in keyof Bots]?: Bot;
  };
  enrollment: {
    repoUrl: string;
  } | null;
  meta: {
    triggers: string[];
  };
};

export type AuthenticatedLocals = Locals & {
  user: NonNullable<Locals["user"]>;
  bots: Locals["bots"] & { root: Bot };
};

export type Bot = {
  octokit: Awaited<ReturnType<Probot["auth"]>>;
  installationId: number;
};

export type User = {
  octokit: Octokit;
} & RestEndpointMethodTypes["users"]["getAuthenticated"]["response"]["data"];
