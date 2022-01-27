import { Event } from "../utils";

export const actions = {
  malachi: {
    intro: async (event: Event) => {
      await event.createIssue({
        title: "Introducing your product owner",
        body: "week1/malachi/intro.md",
      });
    },
    setupBoard: async (event: Event) => {
      const project = await event.createProject({
        name: "Co-worker tools",
        body: "A collection of tools for co-workers",
      });

      const columnNames = ["Todo", "In progress", "Blocked", "Done"];

      const columns = await Promise.all(
        columnNames.map((columnName) =>
          event.createProjectColumn({
            projectId: project.data.id,
            name: columnName,
          })
        )
      );

      await event.meta.set("projectId", project.data.id);
      await event.meta.set(
        "projectColumns",
        columns.map((column) => ({
          id: column.data.id,
          name: column.data.name,
        }))
      );

      const task = await event.createIssue({
        title: "Set up repo",
        body: "./week1/tasks/set-up-repo.md",
      });

      await event.createProjectCard({
        columnId: columns[0].data.id,
        issueNumber: task.data.id,
      });
    },
  },
  uma: {
    intro: async (event: Event) => {
      await event.createIssue({
        title: "Introducing your technical lead",
        body: "week1/uma/intro.md",
      });
    },
    createSetupPR: async (event: Event) => {
      await event.createBranch("setup-repo");

      await event.updateFile({
        path: "README.md",
        content: "#JS",
        branch: "setup-repo",
      });

      await event.createPullRequest({
        from: "setup-repo",
        to: "main",
        title: "Set up repo",
        body: "Set up repo",
        reviewers: [event.user.login],
      });
    },
  },
};
