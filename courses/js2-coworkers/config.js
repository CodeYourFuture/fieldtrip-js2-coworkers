// @ts-check

/** @type {import('../index').Stage} */
const week1 = {
  key: "week-1",
  label: "Week 1",
  summary: "./week1.md",
  actions: [
    { label: "Add MalachiBot to your repo", url: "/auth/install/malachi" },
    { label: "Add AmberBot to your repo", url: "/auth/install/amber" },
  ],
};

/** @type {import('../index').CourseConfig} */
const config = {
  id: "js2",
  title: "Co-worker Discovery Tools",
  module: "JS2",
  summary: "./summary.md",
  stages: [week1],
};

module.exports = config;
