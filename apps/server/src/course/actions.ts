import { Event } from "../utils/event";

export const actions = {
  malachi: {
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
  },
};
