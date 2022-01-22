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
  body: string;
}) => {
  const { context, title, body } = params;
  return context.octokit.issues.create({
    owner: context.payload.installation.account.login,
    repo: "js2",
    title,
    body: await maybeMarkdown(body, context),
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

export const createProjectColumn = async (params: {
  context: Context;
  projectId: number;
  name: string;
}) => {
  const { context, projectId, name } = params;
  return context.octokit.projects.createColumn({
    owner: context.payload.installation.account.login,
    repo: "js2",
    project_id: projectId,
    name,
  });
};

export const createProjectCard = async (params: {
  context: Context;
  columnId: number;
  issueNumber: number;
}) => {
  const { context, columnId, issueNumber } = params;
  return context.octokit.projects.createCard({
    owner: context.payload.installation.account.login,
    repo: "js2",
    column_id: columnId,
    content_id: issueNumber,
    content_type: "Issue",
  });
};

export const maybeMarkdown = async (body: string, context: Context) => {
  if (body.endsWith(".md")) {
    return getMarkdown(body, getMarkdownOptions(context));
  }
  return body;
};
