import { Context as BaseContext } from "probot";
import { getMarkdown } from ".";

export type EventContext = BaseContext<SupportedEvents>;

export type SupportedEvents =
  | "installation.created"
  | "installation_repositories.added";

export class Event {
  context: EventContext;
  repo: string;

  constructor(context: EventContext) {
    this.context = context;
    this.repo = "js2";
  }

  private async maybeMarkdown(body: string) {
    return body.endsWith(".md")
      ? getMarkdown(body, { user: `@${this.user.login}` })
      : body;
  }

  get repos() {
    if ("repositories_added" in this.context.payload) {
      return this.context.payload.repositories_added || [];
    }
    return this.context.payload.repositories || [];
  }

  get user() {
    return this.context.payload.sender;
  }

  get shouldBeIgnored() {
    return this.repos.find((repo) => repo.name !== this.repo);
  }

  async createIssue(params: { title: string; body: string }) {
    const { title, body } = params;
    return this.context.octokit.issues.create({
      owner: this.user.login,
      repo: this.repo,
      title,
      body: await this.maybeMarkdown(body),
    });
  }

  async createProject(params: { name: string; body: string }) {
    const { name, body } = params;
    return this.context.octokit.projects.createForRepo({
      owner: this.user.login,
      repo: this.repo,
      name,
      body: await this.maybeMarkdown(body),
    });
  }

  createProjectColumn(params: { projectId: number; name: string }) {
    const { projectId, name } = params;
    return this.context.octokit.projects.createColumn({
      owner: this.user.login,
      repo: this.repo,
      project_id: projectId,
      name,
    });
  }

  createProjectCard(params: { columnId: number; issueNumber: number }) {
    const { columnId, issueNumber } = params;
    return this.context.octokit.projects.createCard({
      owner: this.user.login,
      repo: this.repo,
      column_id: columnId,
      content_id: issueNumber,
      content_type: "Issue",
    });
  }
}
