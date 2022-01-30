import { week1, week2, week3 } from "./stages";
import type { CourseConfig } from "../types";

const config: CourseConfig = {
  id: "js2",
  repo: "coworker-tools",
  title: "Coworker Discovery Tools",
  module: "JS2",
  summary: "./meta/intro.md",
  stages: [week1, week2, week3],
};

export default config;
