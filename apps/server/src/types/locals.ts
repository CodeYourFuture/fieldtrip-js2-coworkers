import type { RestEndpointMethodTypes } from "@octokit/plugin-rest-endpoint-methods";
import type { Probot } from "probot";
import type { Octokit } from "@octokit/rest";
import type { Bots } from "./";
import { Store } from "../utils";

export type Locals = UnauthenticatedLocals | AuthenticatedLocals;

export type UnauthenticatedLocals = {
  repo: string | null;
  user: null;
  bots: Record<any, never>;
  store: null;
};

export type AuthenticatedLocals = {
  repo: string;
  user: User;
  bots: Record<Bots, Bot>;
  store: Store;
};

export type Bot = {
  octokit: Awaited<ReturnType<Probot["auth"]>>;
  installationId: number;
};

export type User = {
  octokit: Octokit;
} & RestEndpointMethodTypes["users"]["getAuthenticated"]["response"]["data"];
