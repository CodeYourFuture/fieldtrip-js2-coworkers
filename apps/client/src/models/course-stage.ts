import type { Instance } from "mobx-state-tree";
import { types } from "mobx-state-tree";

export const CourseStage = types
  .model({
    key: types.string,
    label: types.string,
    summary: types.string,
    actions: types.array(types.late(() => CourseAction)),
    milestones: types.array(types.late(() => CourseMilestone)),
  })
  .views((self) => ({
    get actionsWithUnlocked() {
      let prevPassed = true;
      return self.actions.map((item) => {
        const action = { ...item, unlocked: prevPassed };
        if (prevPassed) prevPassed = item.passed;
        return action;
      });
    },
    get milestonesWithUnlocked() {
      let prevPassed = true;
      return self.milestones.map((item) => {
        const milestone = { ...item, unlocked: prevPassed };
        if (prevPassed) prevPassed = item.passed;
        return milestone;
      });
    },
  }));

export const CourseAction = types
  .model({
    id: types.string,
    label: types.string,
    url: types.string,
    passed: types.boolean,
  })
  .actions((self) => ({
    setPassed: (passed: boolean) => {
      self.passed = passed;
    },
  }));

export const CourseMilestone = types
  .model({
    id: types.string,
    label: types.string,
    passed: types.boolean,
  })
  .actions((self) => ({
    setPassed: (passed: boolean) => {
      self.passed = passed;
    },
  }));

export interface ICourseStage extends Instance<typeof CourseStage> {}
export interface ICourseAction extends Instance<typeof CourseAction> {}
export interface ICourseMilestone extends Instance<typeof CourseMilestone> {}
