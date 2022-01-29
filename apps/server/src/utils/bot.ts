import type { Context as BaseContext } from "probot";
import { getFile } from ".";
import { Store } from "./store";

export type EventContext =
  | BaseContext<InstallationEvents>
  | BaseContext<RepoEvents>;

type InstallationEvents =
  | "installation.created"
  | "installation_repositories.added";

type RepoEvents = "issues.opened" | "issues.closed";

export class Bot {
  context: EventContext;
  octokit: EventContext["octokit"];
  state: Store;
  repoName: string;

  constructor(context: EventContext, repo: string) {
    this.context = context;
    this.octokit = context.octokit;
    this.repoName = repo;
    this.state = new Store(this.repo());
  }

  // Unfortunately, can't add a Type guard here as it's too complex for the compiler
  private isInstallationEvent() {
    return (
      this.context.name === "installation" ||
      this.context.name === "installation_repositories"
    );
  }

  get eventShouldBeIgnored() {
    if (this.isInstallationEvent()) {
      return (
        this.installedRepos?.filter((r) => r.name === this.repoName).length ===
        0
      );
    }
    return this.context.repo().repo !== this.repoName;
  }

  repo<T>(o?: T): any {
    if (this.isInstallationEvent()) {
      return {
        owner: this.context.payload.sender.login,
        repo: this.repoName,
        ...o,
      };
    }
    return this.context.repo(o);
  }

  private async maybeMarkdown(body: string) {
    if (body.split("?")[0]?.endsWith(".md")) {
      const props = { user: `@${this.username}` };
      return getFile(body, props);
    }
    return body;
  }

  private async fileToBase64(path: string) {
    const content = await getFile(path);
    return Buffer.from(content).toString("base64");
  }

  get installedRepos() {
    if ("repositories_added" in this.context.payload) {
      return this.context.payload.repositories_added || [];
    }
    if ("repositories" in this.context.payload) {
      return this.context.payload.repositories || [];
    }
  }

  get username() {
    return this.repo().owner;
  }

  async createIssue(params: {
    title: string;
    body: string;
    assignee?: string;
  }) {
    const { title, body } = params;
    const { data } = await this.octokit.issues.create(
      this.repo({
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
      this.repo({
        name,
        body: await this.maybeMarkdown(body),
      })
    );
    return data;
  }

  async createProjectColumn(params: { projectId: number; name: string }) {
    const { projectId, name } = params;
    const { data } = await this.octokit.projects.createColumn(
      this.repo({
        project_id: projectId,
        name,
      })
    );
    return data;
  }

  async createProjectCard(params: { columnId: number; issueId: number }) {
    const { columnId, issueId } = params;
    const { data } = await this.octokit.projects.createCard(
      this.repo({
        column_id: columnId,
        content_id: issueId,
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
      this.repo({
        title: params.title,
        body: await this.maybeMarkdown(params.body),
        reviewers: params.reviewers,
        head: params.from,
        base: params.to,
      })
    );
    await this.octokit.pulls.requestReviewers(
      this.repo({
        pull_number: pull.data.number,
        reviewers: params.reviewers,
      })
    );
    return pull.data;
  }

  async createBranch(branchName: string) {
    const ref = await this.octokit.git.getRef(
      this.repo({
        ref: "heads/main",
      })
    );

    return await this.octokit.git.createRef(
      this.repo({
        ref: `refs/heads/${branchName}`,
        sha: ref.data.object.sha,
      })
    );
  }

  async createFile(params: {
    path: string;
    message?: string;
    content: string;
    branch: string;
  }) {
    return this.octokit.repos.createOrUpdateFileContents(
      this.repo({
        path: params.path,
        message: params.message || `Create ${params.path}`,
        content: await this.fileToBase64(params.content),
        branch: params.branch,
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
      this.repo({
        path: params.path,
      })
    );

    return this.octokit.repos.createOrUpdateFileContents(
      this.repo({
        path: params.path,
        message: params.message || `Update ${params.path}`,
        content: await this.fileToBase64(params.content),
        branch: params.branch,
        sha: Array.isArray(currentFile.data)
          ? currentFile.data[0].sha
          : currentFile.data.sha,
      })
    );
  }
}
