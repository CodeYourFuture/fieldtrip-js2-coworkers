import { week1 } from "./stages/week1";
import type { CourseConfig } from "../types";

const config: CourseConfig = {
  id: "js2",
  title: "Co-worker Discovery Tools",
  module: "JS2",
  summary: "./summary.md",
  stages: [week1],
};

export default config;
