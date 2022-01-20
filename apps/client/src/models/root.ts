import type { Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree";
import { types, flow } from "mobx-state-tree";
import { User } from "./user";
import { Course } from "./course";
import { router } from "src/utils/router";

export const Root = types
  .model({
    user: types.maybeNull(User),
    courses: types.map(Course),
  })
  .actions((self) => ({
    loadUser: flow(function* () {
      try {
        const user = yield fetch("/api/user").then((res) => res.json());
        self.user = user;
      } catch {}
    }),
    loadCourse: flow(function* (courseId) {
      try {
        const course = yield fetch(`/api/courses/${courseId}`).then((res) =>
          res.json()
        );
        self.courses.put(course);
      } catch {
        router.replace("/404");
      }
    }),
  }))
  .actions((self) => ({
    // lazy loading i.e. load everything up front so I don't have to implement loading states :)
    init: flow(function* () {
      yield self.loadUser();
      yield router.match("/courses/:id/*", ({ params }) => {
        self.loadCourse(params.id);
      });
    }),
  }));

export interface IRoot extends Instance<typeof Root> {}
export interface IRootSnapshotIn extends SnapshotIn<typeof Root> {}
export interface IRootSnapshotOut extends SnapshotOut<typeof Root> {}
