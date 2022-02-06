import type { CourseMilestone } from "@notation/fieldtrip";
import { on, prByOwner, prRefsIssue } from "@notation/fieldtrip";

export const sprint1Milestones: CourseMilestone[] = [
  {
    id: "merge-repo-setup-pr",
    label: "Merged Uma's repo setup PR",
    passed: on(
      "pull_request.closed",
      (event, state) => event.pull_request.id === state.hooks.setupPr.id
    ),
  },
  {
    id: "data-issue-assigned-to-self",
    label: "Assigned first issue, *Store member data*, to self",
    passed: on(
      "issues.assigned",
      (event, state) => event.issue.id === state.hooks.storeDataIssue.id
    ),
  },
  {
    id: "member-data-card-in-progress",
    label: "Moved *Store member data* card to *In Progress*",
    passed: on(
      "project_card.moved",
      (event, state) =>
        event.project_card.id === state.hooks.storeDataCard.id &&
        event.project_card.column_id === state.hooks.board.columns.doing.id
    ),
  },
  {
    id: "open-member-data-pr",
    label: "Opened PR, referencing *Store member data* issue ",
    passed: on(
      ["pull_request.opened", "pull_request.edited"],
      (event, state) =>
        prByOwner(event) &&
        prRefsIssue(event.pull_request, state.hooks.storeDataIssue)
    ),
  },
  // {
  //   id: "assigned-member-data-pr",
  //   label: "Assigned reviewer to *Store member data* PR",
  //   passed: on(
  //     "pull_request.review_requested",
  //     (event, state) =>
  //       event.pull_request.requested_reviewers.length > 0 &&
  //       prByOwner(event) &&
  //       prRefsIssue(event.pull_request, state.hooks.storeDataIssue)
  //   ),
  // },
  {
    id: "member-data-card-in-review",
    label: "Moved *Store member data* card to *In Review*",
    passed: on(
      "project_card.moved",
      (event, state) =>
        event.project_card.id === state.hooks.storeDataCard.id &&
        event.project_card.column_id === state.hooks.board.columns.review.id
    ),
  },
  {
    id: "merged-member-data-pr",
    label: "Merged *Store member data* PR (once peer-reviewed)",
    passed: on(
      "pull_request.closed",
      (event, state) =>
        event.pull_request.merged &&
        prByOwner(event) &&
        prRefsIssue(event.pull_request, state.hooks.storeDataIssue)
    ),
  },

  {
    id: "member-data-card-done",
    label: "Moved *Store member data* card to *Done*",
    passed: on(
      "project_card.moved",
      (event, state) =>
        event.project_card.id === state.hooks.storeDataCard.id &&
        event.project_card.column_id === state.hooks.board.columns.done.id
    ),
  },
  {
    id: "merge-cli-setup-pr",
    label: "Merged Uma's *CLI setup* PR",
    passed: on(
      "pull_request.closed",
      (event, state) => event.pull_request.id === state.hooks.cliPr.id
    ),
  },
  {
    id: "list-issue-assigned-to-self",
    label: "Assigned next issue, *CLI list command* to self",
    passed: on(
      "issues.assigned",
      (event, state) => event.issue.id === state.hooks.listCommandIssue.id
    ),
  },
  {
    id: "list-card-in-progress",
    label: "Moved *CLI list command* card to *In Progress*",
    passed: on(
      "project_card.moved",
      (event, state) =>
        event.project_card.id === state.hooks.listCommandCard.id &&
        event.project_card.column_id === state.hooks.board.columns.doing.id
    ),
  },
  {
    id: "open-list-pr",
    label: "Opened *CLI list command* PR",
    passed: on(
      ["pull_request.opened", "pull_request.edited"],
      (event, state) =>
        prByOwner(event) &&
        prRefsIssue(event.pull_request, state.hooks.listCommandIssue)
    ),
  },
  // {
  //   id: "assigned-list-pr",
  //   label: "Assigned reviewer to List Command PR",
  //   passed: on(
  //     "pull_request.assigned",
  //     (event, state) =>
  //       event.pull_request.assignees.length > 0 &&
  //       prByOwner(event) &&
  //       prRefsIssue(event.pull_request, state.hooks.listCommandIssue)
  //   ),
  // },
  {
    id: "list-card-in-review",
    label: "Moved *CLI list command* card to *In Review*",
    passed: on(
      "project_card.moved",
      (event, state) =>
        event.project_card.id === state.hooks.listCommandCard.id &&
        event.project_card.column_id === state.hooks.board.columns.review.id
    ),
  },
  {
    id: "list-pr-merged",
    label: "Merged *CLI list command* PR (once peer-reviewed)",
    passed: on(
      "pull_request.closed",
      (event, state) =>
        event.pull_request.merged &&
        prByOwner(event) &&
        prRefsIssue(event.pull_request, state.hooks.listCommandIssue)
    ),
  },
  {
    id: "list-card-done",
    label: "Moved *CLI list command* card to Done",
    passed: on(
      "project_card.moved",
      (event, state) =>
        event.project_card.id === state.hooks.listCommandCard.id &&
        event.project_card.column_id === state.hooks.board.columns.done.id
    ),
  },
];
