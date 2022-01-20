import type { Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree";
import { types, flow } from "mobx-state-tree";
import { getRoot } from "src/store";

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
        const res = yield fetch(`/api/courses/${self.id}`, {
          method: "POST",
        });
        self.enrolled = true;
        // @todo: do something better on catch
        // cannot yield here otherwise self-reference breaks types
        getRoot(self).loadCourse(self.id).catch(console.error);
      } catch (err) {
        console.log(err);
      }
    }),
  }));

export const CourseStage = types.model({
  key: types.string,
  label: types.string,
  summary: types.string,
  actions: types.array(types.late(() => CourseAction)),
});

export const CourseAction = types.model({
  label: types.string,
  url: types.string,
  passed: types.boolean,
});

export interface ICourse extends Instance<typeof Course> {}
export interface ICourseSnapshotIn extends SnapshotIn<typeof Course> {}
export interface ICourseSnapshotOut extends SnapshotOut<typeof Course> {}
