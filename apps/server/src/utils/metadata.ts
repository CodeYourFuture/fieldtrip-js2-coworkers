/**
 * Based on https://github.com/probot/metadata
 * With support added for arrays and quasi sets
 * Store metadata in issues and pull requests.
 */

import type { Context } from "probot";
import type { Octokit } from "@octokit/rest";
import { SupportedEvents } from "./event";

type Key = string | number | symbol;

type Issue = {
  owner: string;
  repo: string;
  issue_number: number;
  body?: string;
};

const regex = /\n\n<!-- probot = (.*) -->/;

export class Metadata {
  octokit: Octokit;
  issue: Issue;

  constructor(octokit: Octokit, issue: Issue) {
    this.octokit = octokit;
    this.issue = issue;
  }

  async get(key?: Key) {
    const data = await this.getData();
    return key ? data && data[key] : data;
  }

  async set(key: Key, value: any) {
    const data = await this.getData();
    data[key] = value;
    const body = await this.getIssueBody(data);
    await this.updateIssue(body);
    return data[key];
  }

  async push(key: Key, value: any) {
    const data = await this.getData();
    if (!data[key]) data[key] = [];
    if (!Array.isArray(data[key])) throw new Error("Property is not an array");
    data[key].push(value);
    const body = await this.getIssueBody(data);
    await this.updateIssue(body);
    return data[key];
  }

  async add(key: Key, value: any) {
    const data = await this.getData();
    if (!data[key]) data[key] = [];
    if (!Array.isArray(data[key])) throw new Error("Property is not an array");
    if (data[key].includes(value)) return false;
    data[key].push(value);
    const body = await this.getIssueBody(data);
    await this.updateIssue(body);
    return true;
  }

  private async getData() {
    const body = await this.getIssueBody();
    const match = body.match(regex);
    if (match) {
      return JSON.parse(match[1]);
    }
    return {};
  }

  private async getIssueBody(data?: Record<Key, any>) {
    let body = this.issue.body;
    if (!body) {
      body = (await this.octokit.issues.get(this.issue)).data.body || "";
    }
    if (data) {
      body = body.replace(regex, "");
      body += `\n\n<!-- probot = ${JSON.stringify(data)} -->`;
    }
    return body;
  }

  private async updateIssue(body: string) {
    const { owner, repo, issue_number } = this.issue;
    return this.octokit.issues.update({ owner, repo, issue_number, body });
  }
}
