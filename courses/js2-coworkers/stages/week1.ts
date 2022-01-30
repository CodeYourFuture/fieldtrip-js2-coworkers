import type { CourseStage } from "../../types";
import { week1Hooks } from "./week1-hooks";
import { week1Milestones } from "./week1-milestones";
import { week1Actions } from "./week1-actions";

export const week1: CourseStage = {
  key: "week-1",
  label: "Week 1",
  summary: (state) => (state ? "./meta/week1-enrolled.md" : "./meta/week1.md"),
  actions: week1Actions,
  milestones: week1Milestones,
  hooks: week1Hooks,
};
