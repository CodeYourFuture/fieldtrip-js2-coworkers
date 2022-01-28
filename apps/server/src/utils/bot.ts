import type { Context as BaseContext } from "probot";
import { getMarkdown } from ".";
import { Store } from "./store";

export type EventContext = BaseContext<SupportedEvents>;

export type SupportedEvents =
  | "installation.created"
  | "installation_repositories.added"
  | "issues.opened"
  | "issues.closed";

export class Bot {
  context: EventContext;
  octokit: EventContext["octokit"];
  repo: string;
  meta: Store;

  constructor(context: EventContext, repo: string) {
    this.context = context;
    this.octokit = context.octokit;
    this.repo = repo;
    this.context.repo = <T>(o?: T): any => ({
      owner: this.user.login,
      repo: this.repo,
      ...o,
    });
    this.meta = new Store(this.context.repo());
  }

  private async maybeMarkdown(body: string) {
    return body.endsWith(".md")
      ? getMarkdown(body, { user: `@${this.user.login}` })
      : body;
  }

  get installedRepos() {
    if ("repositories_added" in this.context.payload) {
      return this.context.payload.repositories_added || [];
    }
    if ("repositories" in this.context.payload) {
      return this.context.payload.repositories || [];
    }
  }

  get user() {
    return this.context.payload.sender;
  }

  get eventShouldBeIgnored() {
    if (this.context.repo) {
      return this.context.repo().repo !== this.repo;
    }
    return Boolean(this.installedRepos?.find((r) => r.name === this.repo));
  }

  async createIssue(params: {
    title: string;
    body: string;
    assignee?: string;
  }) {
    const { title, body } = params;
    const { data } = await this.octokit.issues.create(
      this.context.repo({
        title,
        body: await this.maybeMarkdown(body),
        assignee: params.assignee,
      })
    );
    return data;
  }

  async createProject(params: { name: string; body: string }) {
    const { name, body } = params;
    const { data } = await this.octokit.projects.createForRepo(
      this.context.repo({
        name,
        body: await this.maybeMarkdown(body),
      })
    );
    return data;
  }

  async createProjectColumn(params: { projectId: number; name: string }) {
    const { projectId, name } = params;
    const { data } = await this.octokit.projects.createColumn(
      this.context.repo({
        project_id: projectId,
        name,
      })
    );
    return data;
  }

  async createProjectCard(params: { columnId: number; issueNumber: number }) {
    const { columnId, issueNumber } = params;
    const { data } = await this.octokit.projects.createCard(
      this.context.repo({
        column_id: columnId,
        content_id: issueNumber,
        content_type: "Issue",
      })
    );
    return data;
  }

  async createPullRequest(params: {
    from: string;
    to: string;
    title: string;
    body: string;
    reviewers?: string[];
  }) {
    const pull = await this.octokit.pulls.create(
      this.context.repo({
        title: params.title,
        body: params.body,
        reviewers: params.reviewers,
        head: params.from,
        base: params.to,
      })
    );
    await this.octokit.pulls.requestReviewers(
      this.context.repo({
        pull_number: pull.data.number,
        reviewers: params.reviewers,
      })
    );
    return pull.data;
  }

  async createBranch(branchName: string) {
    const ref = await this.octokit.git.getRef(
      this.context.repo({
        ref: "heads/main",
      })
    );

    return await this.octokit.git.createRef(
      this.context.repo({
        ref: `refs/heads/${branchName}`,
        sha: ref.data.object.sha,
      })
    );
  }

  async updateFile(params: {
    path: string;
    message?: string;
    content: string;
    branch: string;
  }) {
    const currentFile = await this.octokit.repos.getContent(
      this.context.repo({
        path: params.path,
      })
    );

    return this.octokit.repos.createOrUpdateFileContents(
      this.context.repo({
        path: params.path,
        message: params.message || `Update ${params.path}`,
        content: Buffer.from(params.content).toString("base64"),
        branch: params.branch,
        sha: Array.isArray(currentFile.data)
          ? currentFile.data[0].sha
          : currentFile.data.sha,
      })
    );
  }
}
