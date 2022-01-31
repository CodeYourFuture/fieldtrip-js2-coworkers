import type { CourseStage } from "../../types";
import { sprint1Hooks } from "./sprint1-hooks";
import { sprint1Milestones } from "./sprint1-milestones";
import { sprint1Actions } from "./sprint1-actions";

export const sprint1: CourseStage = {
  key: "sprint-1",
  label: "Sprint 1",
  summary: (state) =>
    state ? "./website/sprint1-enrolled.md" : "./website/sprint1.md",
  actions: sprint1Actions,
  milestones: sprint1Milestones,
  hooks: sprint1Hooks,
};
