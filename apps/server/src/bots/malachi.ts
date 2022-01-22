import { Probot } from "probot";
import { createProbot } from "../utils";
import { bots } from "../config";
import { Event } from "../utils/event";

const actions = {
  setup: async (event: Event) => {
    const project = await event.createProject({
      name: "Co-worker tools",
      body: "A collection of tools for co-workers",
    });

    const columnNames = ["Todo", "In progress", "Blocked", "Done"];

    const [todoCol] = await Promise.all(
      columnNames.map((columnName) =>
        event.createProjectColumn({
          projectId: project.data.id,
          name: columnName,
        })
      )
    );

    await event.createIssue({
      title: "Introducing your product owner",
      body: "week1/malachi/intro.md",
    });

    const task = await event.createIssue({
      title: "Set up repo",
      body: "./week1/tasks/set-up-repo.md",
    });

    await event.createProjectCard({
      columnId: todoCol.data.id,
      issueNumber: task.data.id,
    });
  },
};

export const app = (app: Probot) => {
  app.on(["installation_repositories.added"], async (context) => {
    const event = new Event(context);
    if (event.shouldBeIgnored) return;
    await actions.setup(event);
  });

  app.on(["installation.created"], async (context) => {
    const event = new Event(context);
    if (event.shouldBeIgnored) return;
    await actions.setup(event);
  });
};

export const instance = createProbot(bots.malachi);
export const config = bots.malachi;
