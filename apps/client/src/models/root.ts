import { types, flow } from "mobx-state-tree";
import { User } from "./user";
import { Course } from "./course";
import { router } from "src/utils/router";

export const Root = types
  .model({
    user: types.maybeNull(User),
    courses: types.map(Course),
  })
  .actions((self) => {
    const loadUser = flow(function* () {
      const user = yield fetch("/api/user").then((res) => res.json());
      self.user = user;
    });

    const loadCourses = flow(function* () {
      const courses = yield fetch("/api/courses").then((res) => res.json());
      courses.forEach((course: any) => self.courses.put(course));
    });

    const loadCourseStatus = flow(function* ({ params }) {
      const course = self.courses.get(params.id);
      if (!course) return;
      yield course.getStatus();
    });

    return {
      // lazy loading: load everything up front so I don't have to implement loading states :)
      init: flow(function* () {
        yield loadUser();
        yield loadCourses();
        yield router.match("/courses/:id/*", loadCourseStatus);
      }),
    };
  })
  .views((self) => ({
    get courseList() {
      return Array.from(self.courses.values());
    },
  }));
