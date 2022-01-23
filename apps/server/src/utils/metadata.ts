/**
 * Based on https://github.com/probot/metadata
 * Store metadata in issues and pull requests.
 */

import type { Octokit } from "@octokit/rest";

type Key = string | number | symbol;

type Issue = {
  owner: string;
  repo: string;
  issue_number: number;
  body?: string;
};

const regex = /\n\n<!-- probot = (.*) -->/;

export const metadata = (octokit: Octokit, issue: Issue) => {
  return {
    async get(key?: Key) {
      let body = issue.body;

      if (!body) {
        body = (await octokit.issues.get(issue)).data.body || "";
      }

      const match = body.match(regex);

      if (match) {
        const data = JSON.parse(match[1]);
        return key ? data && data[key] : data;
      }
    },

    async set(key: Key, value: any) {
      let body = issue.body;
      let data: Record<Key, any> = {};

      if (!body) body = (await octokit.issues.get(issue)).data.body || "";

      body = body.replace(regex, (_, json) => {
        data = JSON.parse(json);
        return "";
      });

      if (!data) data = {};

      data[key] = value;

      body = `${body}\n\n<!-- probot = ${JSON.stringify(data)} -->`;

      const { owner, repo, issue_number } = issue;
      return octokit.issues.update({ owner, repo, issue_number, body });
    },

    async push(key: Key, value: any) {
      let body = issue.body;
      let data: Record<Key, any> = {};

      if (!body) body = (await octokit.issues.get(issue)).data.body || "";

      body = body.replace(regex, (_, json) => {
        data = JSON.parse(json);
        return "";
      });

      if (!data) data = {};

      if (!data[key]) data[key] = [];
      data[key].push(value);

      body = `${body}\n\n<!-- probot = ${JSON.stringify(data)} -->`;

      const { owner, repo, issue_number } = issue;
      return octokit.issues.update({ owner, repo, issue_number, body });
    },
  };
};
