import { Probot } from "probot";
import { createProbot } from "../utils";
import { bots } from "../config";

export const app = (app: Probot) => {
  app.on(["installation_repositories.added"], async (context) => {
    const { repositories_added } = context.payload;
    const selectedRepo = repositories_added.find((repo) => repo.name === "js2");
    if (!selectedRepo) return;
    await context.octokit.issues.create({
      owner: context.payload.installation.account.login,
      repo: "js2",
      title: "Introducing your product owner",
      body: getFirstIssue(),
    });
  });

  app.on(["installation.created"], async (context) => {
    const { repositories } = context.payload;
    const selectedRepo = repositories.find((repo) => repo.name === "js2");
    if (!selectedRepo) return;
    await context.octokit.issues.create({
      owner: context.payload.installation.account.login,
      repo: "js2",
      title: "Introducing your product owner",
      body: getFirstIssue(),
    });
  });
};

export const instance = createProbot(bots.malachi);
export const config = bots.malachi;

function getFirstIssue() {
  return `Hi! My job is to understand users' needs so that we can build a product that really helps people. I do this by talking to users and stakeholders to find out what problems need to be solved and learn about how users are currently solving these problems.

From these discussions I create user stories, which describe how particular users will be able to solve their problems once the work is done.

What I don't do is describe how a story should be built – I leave that to the designers and developers. My job is all about people!

## Next Steps

I've create a board for our project where we can track changes. 

To complete this step, head over to the projects board and assign the highest priority task to yourself.
`;
}
