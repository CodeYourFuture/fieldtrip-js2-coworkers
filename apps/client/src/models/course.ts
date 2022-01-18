import type { Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree";
import { types, flow } from "mobx-state-tree";

export const Course = types
  .model({
    id: types.identifier,
    title: types.string,
    module: types.string,
    summary: types.string,
    stages: types.array(types.late(() => CourseStage)),
    status: types.maybe(types.late(() => CourseStatus)),
  })
  .actions((self) => ({
    enroll: flow(function* () {
      const res = yield fetch(`/api/courses/${self.id}`, { method: "POST" });
      const course = yield res.json();
      self.status = course.status;
    }),
    getStatus: flow(function* () {
      const res = yield fetch(`/api/courses/${self.id}`);
      const course = yield res.json();
      self.status = course.status;
    }),
  }));

export const CourseStatus = types.model({
  active: types.boolean,
});

export const CourseStage = types.model({
  key: types.string,
  label: types.string,
  summary: types.string,
});

export interface ICourse extends Instance<typeof Course> {}
export interface ICourseSnapshotIn extends SnapshotIn<typeof Course> {}
export interface ICourseSnapshotOut extends SnapshotOut<typeof Course> {}
