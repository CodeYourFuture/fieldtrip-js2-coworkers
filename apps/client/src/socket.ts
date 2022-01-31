import { io } from "socket.io-client";
import { toaster } from "evergreen-ui";
import { applySnapshot, getSnapshot } from "mobx-state-tree";
import { store } from "src/store";
import { SERVER_URL } from "src/config";
import { IRootSnapshotOut } from "./models";

export const socket = io(SERVER_URL!, {
  autoConnect: false,
  path: "/ws",
  withCredentials: true,
});

socket.on("course:update", ({ courseId, course }) => {
  const courseModel = store.courses.get(courseId);
  if (!courseModel) return;

  const oldSnap = getSnapshot(courseModel);

  applySnapshot(courseModel, course);

  console.log(course);

  // @todo is there a nicer way to do this where you can just observe changes to particular fields?
  // mobx.reaction doesn't work because applySnapshot replaces the tree

  if (!store.user || !store.courses.get(courseId)?.enrollment) return;

  const newSnap = getSnapshot(courseModel);

  const getMilestones = (snap: IRootSnapshotOut["courses"][number]) =>
    snap.stages.flatMap((stage) => [...stage.actions, ...stage.milestones]);

  const passedMilestones = getMilestones(newSnap).filter((milestone) => {
    const prevMilestone = getMilestones(oldSnap).find(
      (a) => a.id === milestone.id
    );
    return !prevMilestone?.passed && milestone.passed;
  });
  if (passedMilestones.length) {
    onStepPassed(passedMilestones[0].label);
  }
});

const originalTitle = document.title;

function onStepPassed(label: string) {
  document.title = `Step Completed!`;
  setTimeout(() => {
    document.title = originalTitle;
    // Toast doesn't close if tab didn't have focus when it was opened
    toaster.closeAll();
  }, 6500);
  toaster.success("Step Completed!", {
    description: label,
    duration: 6500,
  });
}
