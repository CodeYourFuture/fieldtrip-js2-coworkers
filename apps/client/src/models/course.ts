import type { Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree";
import { types, flow } from "mobx-state-tree";
import { getRoot } from "src/store";
import { toaster } from "evergreen-ui";
import { api } from "src/utils/api";
import { CourseStage } from ".";

export const Course = types
  .model({
    id: types.identifier,
    repo: types.string,
    title: types.string,
    module: types.string,
    summary: types.string,
    stages: types.array(types.late(() => CourseStage)),
    enrollment: types.maybeNull(types.late(() => CourseEnrollment)),
  })
  .actions((self) => ({
    enroll: flow(function* () {
      const root = getRoot(self);
      try {
        toaster.notify("Creating course repository...", {
          id: "enroll",
          duration: 120,
        });
        yield api.enroll(self.id);
        // Workaround to avoid circular types
        const loadCourse = (): Promise<void> => root.loadCourse(self.id);
        yield loadCourse();
        toaster.success("Course repository created!", { id: "enroll" });
      } catch (err) {
        console.log(err);
        toaster.danger("Failed to enroll on course", { id: "enroll" });
      }
    }),
    delete: flow(function* () {
      const confirmed = window.confirm(
        [
          "Deleting the course will PERMANENTLY delete your repo from GitHub.",
          "Any work you've done will be lost unless you have backed it up.",
          "Are you sure you want to do this?",
        ].join("\n\n")
      );
      if (!confirmed) return;
      try {
        toaster.success("Deleting course repository... ", {
          id: "delete",
          duration: 120,
        });
        const res = yield api.delete(self.id);
        if (res.status !== 204) throw res;
        self.enrollment = null;
        getRoot(self).loadCourse(self.id);
        toaster.success("Course deleted!", { id: "delete" });
      } catch (err) {
        console.log(err);
        toaster.danger("Failed to delete course");
      }
    }),
  }));

export const CourseEnrollment = types.model({
  repoUrl: types.string,
});

export interface ICourse extends Instance<typeof Course> {}
export interface ICourseEnrollment extends Instance<typeof CourseEnrollment> {}

export interface ICourseSnapshotIn extends SnapshotIn<typeof Course> {}
export interface ICourseSnapshotOut extends SnapshotOut<typeof Course> {}
