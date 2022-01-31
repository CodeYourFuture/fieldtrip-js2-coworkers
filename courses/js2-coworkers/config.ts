import { sprint1, sprint2, sprint3 } from "./stages";
import type { CourseConfig } from "../types";

const config: CourseConfig = {
  id: "js2",
  repo: "coworker-tools",
  title: "Coworker Discovery Tools",
  module: "JS2",
  summary: "./website/intro.md",
  stages: [sprint1, sprint2, sprint3],
};

export default config;
