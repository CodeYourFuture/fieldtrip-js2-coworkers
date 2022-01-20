import type { Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree";
import { types, flow } from "mobx-state-tree";
import { getRoot } from "src/store";
import { toaster } from "evergreen-ui";

export const Course = types
  .model({
    id: types.identifier,
    title: types.string,
    module: types.string,
    summary: types.string,
    stages: types.array(types.late(() => CourseStage)),
    enrolled: types.boolean,
  })
  .actions((self) => ({
    enroll: flow(function* () {
      try {
        toaster.notify("Creating course repository...", {
          id: "enroll",
          duration: 120,
        });
        const res = yield fetch(`/api/courses/${self.id}`, {
          method: "POST",
        });
        toaster.success("Course repository created!", { id: "enroll" });
        self.enrolled = true;
        getRoot(self).loadCourse(self.id);
      } catch (err) {
        console.log(err);
        toaster.danger("Failed to enroll in course", { id: "enroll" });
      }
    }),
  }));

export const CourseStage = types
  .model({
    key: types.string,
    label: types.string,
    summary: types.string,
    actions: types.array(types.late(() => CourseAction)),
  })
  .views((self) => ({
    get actionsWithUnlocked() {
      let prevPassed = true;
      return self.actions.map((item) => {
        const action = { ...item, unlocked: prevPassed };
        prevPassed = item.passed;
        return action;
      });
    },
  }));

export const CourseAction = types.model({
  label: types.string,
  url: types.string,
  passed: types.boolean,
});

export interface ICourse extends Instance<typeof Course> {}
export interface ICourseSnapshotIn extends SnapshotIn<typeof Course> {}
export interface ICourseSnapshotOut extends SnapshotOut<typeof Course> {}
