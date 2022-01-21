import { Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree";
import { types, flow } from "mobx-state-tree";
import { User } from "./user";
import { Course } from "./course";
import { router } from "src/utils/router";
import { toaster } from "evergreen-ui";

export const Root = types
  .model({
    user: types.maybeNull(User),
    courses: types.map(Course),
  })
  .actions((self) => ({
    loadUser: flow(function* () {
      try {
        const res = yield fetch("/api/user");
        if (res.status === 401) return;
        const user = yield res.json();
        self.user = user;
      } catch (err: any) {
        console.log(err);
        toaster.danger("Failed to load user");
      }
    }),
    loadCourse: flow(function* (courseId) {
      try {
        const course = yield fetch(`/api/courses/${courseId}`).then((res) =>
          res.json()
        );
        self.courses.put(course);
      } catch (err: any) {
        if (err.status === 404) {
          router.replace("/404");
        } else {
          toaster.danger("Failed to load course");
        }
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
