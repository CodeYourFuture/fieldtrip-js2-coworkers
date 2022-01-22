import { Context as BaseContext } from "probot";
import { getMarkdown, getMarkdownOptions } from "../utils";

export type Context = BaseContext<SupportedEvents>;

export type SupportedEvents =
  | "installation.created"
  | "installation_repositories.added";

export const getRepos = ({ payload }: Context) => {
  if ("repositories_added" in payload) return payload.repositories_added || [];
  return payload.repositories || [];
};

export const isRepo = (context: Context) =>
  getRepos(context).find((repo) => repo.name === "js2");

export const getUser = (context: Context) => context.payload.sender;

export const createIssue = async (params: {
  context: Context;
  title: string;
  filePath: string;
}) => {
  const { context, title, filePath } = params;
  return context.octokit.issues.create({
    owner: context.payload.installation.account.login,
    repo: "js2",
    title,
    body: await getMarkdown(filePath, getMarkdownOptions(context)),
  });
};

export const createProject = async (params: {
  context: Context;
  name: string;
  body: string;
}) => {
  const { context, name, body } = params;
  return context.octokit.projects.createForRepo({
    owner: context.payload.installation.account.login,
    repo: "js2",
    name,
    body,
  });
};
